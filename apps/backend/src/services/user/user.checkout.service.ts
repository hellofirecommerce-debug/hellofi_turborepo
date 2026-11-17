import { GraphQLError } from "graphql";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import prisma from "@repo/db";
import {
  paymentSchema,
  parseOrThrow,
  schedulePickupSchema,
} from "@repo/validations";
import {
  PICKUP_SLOTS,
  PICKUP_WINDOW_DAYS,
  SAME_DAY_BUFFER_HOURS,
  SLOT_START_HOURS,
} from "../../lib/constants/pickup";

const err = (message: string, code = "BAD_REQUEST") =>
  new GraphQLError(message, { extensions: { code } });

// must match `name` in the Timeline table exactly
const TIMELINE = {
  DOORSTEP: {
    name: "pickup via staff",
    message: "Pickup requested through our service.",
  },
  DROP_TO_OFFICE: {
    name: "drop to office",
    message: "Store drop-off scheduled.",
  },
} as const;

// ---------- IST date helpers ----------
const istNow = () => new Date(Date.now() + 5.5 * 60 * 60 * 1000);
const todayISO = () => istNow().toISOString().slice(0, 10);
const addDaysISO = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const labelDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

function validateSlot(date: string, slot: string) {
  const today = todayISO();
  const last = addDaysISO(today, PICKUP_WINDOW_DAYS - 1);
  if (date < today || date > last)
    throw err("Please choose a date within the next 7 days");

  const idx = (PICKUP_SLOTS as readonly string[]).indexOf(slot);
  if (idx === -1) throw err("Invalid time slot");

  const startHour = SLOT_START_HOURS[idx];
  if (startHour === undefined) throw err("Invalid time slot");

  if (date === today) {
    const hour = istNow().getUTCHours();
    if (startHour < hour + SAME_DAY_BUFFER_HOURS) {
      throw err("This slot is no longer available today");
    }
  }
}

async function findServiceArea(pinCode: string) {
  return prisma.serviceablePincode.findFirst({
    where: { pinCodes: { has: pinCode }, isActive: true },
    select: { city: true, isDropToOfficeAvailable: true },
  });
}

interface PlaceOrderInput {
  addressId: string;
  schedule: unknown;
  payment: unknown;
  agreedToTerms: boolean;
}

class UserCheckoutService {
  // Called by the frontend as soon as an address is confirmed
  async checkPincode(pinCode: string) {
    if (!/^\d{6}$/.test(pinCode)) {
      return { serviceable: false, city: null, isDropToOfficeAvailable: false };
    }
    const area = await findServiceArea(pinCode);
    return {
      serviceable: !!area,
      city: area?.city ?? null,
      isDropToOfficeAvailable: area?.isDropToOfficeAvailable ?? false,
    };
  }

  // The ONLY write for checkout: address + schedule + payment + terms + first timeline event
  async placeOrder(userId: string, orderNo: string, raw: PlaceOrderInput) {
    const schedule = parseOrThrow(schedulePickupSchema, raw.schedule);
    const payment = parseOrThrow(paymentSchema, raw.payment);

    if (!raw.agreedToTerms) throw err("Please accept the Terms and Conditions");

    const order = await prisma.sellingOrder.findFirst({
      where: { orderNo, userId },
    });
    if (!order) throw err("Order not found", "NOT_FOUND");
    if (order.orderStatus !== OrderStatus.AWAITING_ADDRESS) {
      throw err("This order is already confirmed");
    }
    if (order.totalAmount <= 0) {
      throw err("This device is not eligible for selling");
    }

    const address = await prisma.address.findFirst({
      where: { id: raw.addressId, userId },
    });
    if (!address) throw err("Address not found", "NOT_FOUND");

    // re-check everything on the server, never trust the frontend
    const area = await findServiceArea(address.pinCode);
    validateSlot(schedule.date, schedule.slot);

    if (schedule.method === "DOORSTEP" && !area) {
      throw err("Doorstep pickup is not available for your pincode yet");
    }
    if (
      schedule.method === "DROP_TO_OFFICE" &&
      !area?.isDropToOfficeAvailable
    ) {
      throw err("Store drop-off is not available for your city");
    }

    // ---------- timeline: fetch by name, first step becomes the first event ----------
    const timelineCfg = TIMELINE[schedule.method];
    const timeline = await prisma.timeline.findUnique({
      where: { name: timelineCfg.name },
      include: { steps: { orderBy: { position: "asc" }, take: 1 } },
    });
    const firstStep = timeline?.steps[0];
    if (!timeline || !firstStep) {
      throw err(`Timeline "${timelineCfg.name}" is not configured`, "INTERNAL");
    }

    let paymentDetails: Record<string, string> | null = null;
    if (payment.method === "UPI") {
      paymentDetails = { upiId: payment.upiId };
    } else if (payment.method === "BANK") {
      paymentDetails = {
        bankName: payment.bankName,
        accountHolderName: payment.accountHolderName,
        bankAccountNumber: payment.bankAccountNumber,
        ifscCode: payment.ifscCode,
      };
    }

    const scheduleData =
      schedule.method === "DOORSTEP"
        ? {
            pickupMethod: "pickup-via-us",
            isDropToOffice: false,
            pickupISODate: schedule.date,
            pickupDate: labelDate(schedule.date),
            pickupSlot: schedule.slot,
          }
        : {
            pickupMethod: null,
            isDropToOffice: true,
            dropToOfficeISODate: schedule.date,
            dropToOfficeDate: labelDate(schedule.date),
            dropToOfficeSlotTimings: schedule.slot,
          };

    // order update + first timeline event succeed or fail together
    await prisma.$transaction(async (tx) => {
      // guard against double-click / double-submit
      const result = await tx.sellingOrder.updateMany({
        where: { id: order.id, orderStatus: OrderStatus.AWAITING_ADDRESS },
        data: {
          addressId: address.id,
          // snapshot: the order keeps this even if the user edits/deletes the address later
          address: {
            name: address.name,
            contact: address.contact,
            alternateContactNo: address.alternateContactNo,
            email: address.email,
            address: address.address,
            pinCode: address.pinCode,
            landMark: address.landMark,
            cityDistrict: address.cityDistrict,
            state: address.state,
            gst: address.gst,
            addressType: address.addressType,
          },
          serviceAvailable: !!area,
          ...scheduleData,
          paymentMethod: payment.method as PaymentMethod,
          paymentDetails: paymentDetails ?? undefined,
          isAgreedToTerms: true,
          currentStep: 4,
          orderTimelineName: timeline.name,
          orderStatus: OrderStatus.AWAITING_PICKUP,
        },
      });
      if (result.count === 0) throw err("This order is already confirmed");

      await tx.orderTimeline.create({
        data: {
          orderId: order.id,
          status: firstStep.status, // e.g. "pickuprequested"
          label: firstStep.label, // e.g. "Pickup Requested"
          message: timelineCfg.message,
        },
      });
    });

    return prisma.sellingOrder.findUniqueOrThrow({ where: { id: order.id } });
  }
}

export default new UserCheckoutService();

import { GraphQLError } from "graphql";
import prisma from "@repo/db";
import { addressInputSchema, parseOrThrow } from "@repo/validations";

const MAX_ADDRESSES = 10;

const err = (message: string, code: string) =>
  new GraphQLError(message, { extensions: { code } });

type AddressInput = ReturnType<typeof parseOrThrow<typeof addressInputSchema>>;

function toData(input: AddressInput) {
  return {
    name: input.name,
    contact: input.contact,
    alternateContactNo: input.alternateContactNo ?? null,
    email: input.email,
    address: input.address,
    pinCode: input.pinCode,
    landMark: input.landMark ?? null,
    cityDistrict: input.cityDistrict,
    state: input.state,
    gst: input.gst ?? null,
    addressType: input.addressType,
  };
}

class UserAddressService {
  list(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async create(userId: string, raw: unknown) {
    const input = parseOrThrow(addressInputSchema, raw);

    return prisma.$transaction(async (tx) => {
      const count = await tx.address.count({ where: { userId } });
      if (count >= MAX_ADDRESSES) {
        throw err(
          `You can save up to ${MAX_ADDRESSES} addresses`,
          "BAD_REQUEST",
        );
      }

      const makeDefault = input.isDefault || count === 0;
      if (makeDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: { userId, ...toData(input), isDefault: makeDefault },
      });
    });
  }

  async update(userId: string, id: string, raw: unknown) {
    const input = parseOrThrow(addressInputSchema, raw);

    return prisma.$transaction(async (tx) => {
      const existing = await tx.address.findFirst({ where: { id, userId } });
      if (!existing) throw err("Address not found", "NOT_FOUND");

      if (input.isDefault && !existing.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id },
        data: {
          ...toData(input),
          // can't un-default the only default; pick another one to change it
          isDefault: input.isDefault || existing.isDefault,
        },
      });
    });
  }

  async remove(userId: string, id: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.address.findFirst({ where: { id, userId } });
      if (!existing) throw err("Address not found", "NOT_FOUND");

      await tx.address.delete({ where: { id } });

      if (existing.isDefault) {
        const next = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });
        if (next) {
          await tx.address.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
        }
      }
      return true;
    });
  }
}

export default new UserAddressService();

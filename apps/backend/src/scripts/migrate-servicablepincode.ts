import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import prisma from "@repo/db";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const servicablePincodeSchema = new mongoose.Schema(
  {
    isDropToOfficeAvailable: { type: Boolean, default: false },
    city: { type: String, required: true },
    pinCodes: { type: [String], required: true },
  },
  { timestamps: true },
);

const ServiceablePincode = mongoose.model(
  "servicablepincode",
  servicablePincodeSchema,
);

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB");

  const areas = await ServiceablePincode.find({});
  console.log(`Found ${areas.length} serviceable areas`);

  let success = 0;
  let skipped = 0;

  // pincode → city, to catch the same pincode listed under two cities
  const seen = new Map<string, string>();

  for (const area of areas) {
    try {
      const city = (area.city ?? "").trim();
      if (!city) {
        console.log(`⚠️ Area ${area._id} has no city — skipping`);
        skipped++;
        continue;
      }

      // ── Clean pincodes: trim, keep only 6-digit values, remove duplicates ──
      const pinCodes = [
        ...new Set(
          (area.pinCodes ?? [])
            .map((p) => String(p).trim())
            .filter((p) => /^\d{6}$/.test(p)),
        ),
      ];

      if (pinCodes.length === 0) {
        console.log(`⚠️ No valid pincodes for ${city} — skipping`);
        skipped++;
        continue;
      }

      const removed = (area.pinCodes?.length ?? 0) - pinCodes.length;
      if (removed > 0) {
        console.log(
          `ℹ️ ${city}: removed ${removed} invalid/duplicate pincodes`,
        );
      }

      // ── Warn if a pincode is already under another city ──
      for (const pin of pinCodes) {
        const other = seen.get(pin);
        if (other && other !== city) {
          console.log(`⚠️ Pincode ${pin} is in both "${other}" and "${city}"`);
        } else {
          seen.set(pin, city);
        }
      }

      await prisma.serviceablePincode.upsert({
        where: { id: area._id.toString() },
        update: {},
        create: {
          id: area._id.toString(),
          city,
          pinCodes,
          isDropToOfficeAvailable: area.isDropToOfficeAvailable ?? false,
          isActive: true,
        },
      });

      success++;
      console.log(`✅ Migrated: ${city} (${pinCodes.length} pincodes)`);
    } catch (err) {
      console.error(`❌ Error migrating ${area.city}:`, err);
    }
  }

  console.log(`\nMigration complete — ${success} success, ${skipped} skipped`);
  await mongoose.disconnect();
}

migrate().catch(console.error);

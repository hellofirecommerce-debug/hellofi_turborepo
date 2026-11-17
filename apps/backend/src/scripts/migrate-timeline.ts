import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import prisma from "@repo/db";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const timelineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    steps: [
      {
        status: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

const Timeline = mongoose.model("Timeline", timelineSchema);

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB");

  const timelines = await Timeline.find({});
  console.log(`Found ${timelines.length} timelines`);

  let success = 0;
  let skipped = 0;

  for (const timeline of timelines) {
    try {
      const name = (timeline.name ?? "").trim();
      if (!name) {
        console.log(`⚠️ Timeline ${timeline._id} has no name — skipping`);
        skipped++;
        continue;
      }

      // ── Name is unique in Postgres: skip if another timeline already has it ──
      const sameName = await prisma.timeline.findUnique({ where: { name } });
      if (sameName && sameName.id !== timeline._id.toString()) {
        console.log(
          `⚠️ Timeline "${name}" already exists (id ${sameName.id}) — skipping`,
        );
        skipped++;
        continue;
      }

      // ── Clean steps: keep array order, drop empty ones, one step per status ──
      const seenStatus = new Set<string>();
      const steps = (timeline.steps ?? [])
        .map((s) => ({
          status: (s.status ?? "").trim(),
          label: (s.label ?? "").trim(),
        }))
        .filter((s) => {
          if (!s.status || !s.label) return false;
          if (seenStatus.has(s.status)) return false;
          seenStatus.add(s.status);
          return true;
        })
        .map((s, index) => ({ ...s, position: index + 1 }));

      if (steps.length === 0) {
        console.log(`⚠️ Timeline "${name}" has no valid steps — skipping`);
        skipped++;
        continue;
      }

      const removed = (timeline.steps?.length ?? 0) - steps.length;
      if (removed > 0) {
        console.log(`ℹ️ ${name}: removed ${removed} empty/duplicate steps`);
      }

      await prisma.timeline.upsert({
        where: { id: timeline._id.toString() },
        update: {},
        create: {
          id: timeline._id.toString(),
          name,
          isActive: true,
          steps: { create: steps },
        },
      });

      success++;
      console.log(`✅ Timeline migrated: ${name} (${steps.length} steps)`);
    } catch (err) {
      console.error(`❌ Error migrating timeline ${timeline.name}:`, err);
    }
  }

  console.log(`\nMigration complete — ${success} success, ${skipped} skipped`);
  await mongoose.disconnect();
}

migrate().catch(console.error);

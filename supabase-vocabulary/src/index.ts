import * as dotenv from "dotenv";
dotenv.config();

import { buildRows } from "./data/seed";
import { pushVocabulary } from "./services/vocabularyService";

async function main() {
  const userId = process.env.SEED_USER_ID;
  if (!userId || userId.trim() === "") {
    console.error("❌ SEED_USER_ID is not set in .env");
    console.error("   Go to Supabase → Authentication → Users, copy your UUID, and paste it into .env");
    process.exit(1);
  }

  console.log(`🚀 Seeding vocabulary for user: ${userId}`);
  const rows = buildRows(userId);
  console.log(`�� Total cards to push: ${rows.length}`);
  await pushVocabulary(rows);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});

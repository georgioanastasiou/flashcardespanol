import { supabase } from "../client";
import { CardRow } from "../types";

const BATCH_SIZE = 50;

export async function pushVocabulary(rows: CardRow[]): Promise<void> {
  console.log(`\n📦 Pushing ${rows.length} cards in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("cards").upsert(batch, { onConflict: "id" });
    if (error) throw new Error(`Batch ${i / BATCH_SIZE + 1} failed: ${error.message}`);
    console.log(`  ✅ Batch ${i / BATCH_SIZE + 1} — pushed cards ${i + 1}–${i + batch.length}`);
  }

  console.log(`\n🎉 Done! ${rows.length} cards pushed to Supabase.\n`);
}

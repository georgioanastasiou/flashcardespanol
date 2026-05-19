import { supabase } from "./supabase";

export async function uploadImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("card-images")
    .upload(path, file, { upsert: true });

  if (error) { console.error("Storage error:", error); throw new Error(error.message); }

  const { data } = supabase.storage.from("card-images").getPublicUrl(path);
  return data.publicUrl;
}

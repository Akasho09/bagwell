import { supabase } from "./sups";

export async function uploadImage(
  file: File,
  category: string
): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const path = `${category}/${fileName}`;

  const { error } = await supabase.storage
    .from("imagess")
    .upload(path, file);

  if (error) throw error;

  return path; // 👈 store this in DB
}

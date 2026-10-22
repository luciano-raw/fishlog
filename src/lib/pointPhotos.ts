import "server-only";
import { supabase } from "./supabase";
import { pointPhotoFile } from "./pointInput";

export async function uploadPointPhotos(form: FormData, userId: string, kind: "spot" | "hazard") {
  const image = pointPhotoFile(form.get("image"), 750000);
  const thumbnail = pointPhotoFile(form.get("thumbnail"), 250000);
  if (thumbnail && !image) throw new Error("Vuelve a seleccionar la foto.");
  const paths: string[] = [];
  async function upload(file: File | null, suffix: string) {
    if (!file) return null;
    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${kind}-${userId}-${crypto.randomUUID()}-${suffix}.${extension}`;
    const { error } = await supabase.storage.from("catches").upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
    if (error) { console.error("Point photo upload failed", error); throw new Error("No pudimos subir la foto. Intenta otra vez o quítala para publicar sin foto."); }
    paths.push(path);
    return supabase.storage.from("catches").getPublicUrl(path).data.publicUrl;
  }
  const cleanup = async () => {
    if (paths.length) {
      const { error } = await supabase.storage.from("catches").remove(paths);
      if (error) console.error("Point photo cleanup failed", error);
    }
  };
  try { return { imageUrl: await upload(image, "full"), thumbnailUrl: await upload(thumbnail, "preview"), cleanup }; }
  catch (error) { await cleanup(); throw error; }
}

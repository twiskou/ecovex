import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function saveUploadedFile(file: File): Promise<{ url: string; error?: string }> {
  try {
    if (!file || file.size === 0) {
      return { url: "", error: "Fichier image manquant ou vide." };
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        url: "",
        error: "Format d'image non supporté. Formats acceptés : JPG, PNG, WEBP, AVIF.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { url: "", error: "L'image ne doit pas dépasser 10 Mo." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // On local environment / development, also try saving to public/uploads if possible
    const isLocal = process.env.NODE_ENV !== "production" && !process.env.VERCEL;
    if (isLocal) {
      try {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, uniqueName);
        await writeFile(filePath, buffer);
        // On local, we can return the public relative URL or the dataUrl
        return { url: `/uploads/${uniqueName}` };
      } catch (localWriteErr) {
        console.warn("Could not write to local disk, using data URL fallback:", localWriteErr);
      }
    }

    // In production / Vercel serverless (where disk is read-only), return the Base64 Data URL
    return { url: dataUrl };
  } catch (err: any) {
    console.error("saveUploadedFile error:", err);
    return { url: "", error: err?.message || "Erreur lors du traitement de l'image." };
  }
}

import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function saveUploadedFile(file: File): Promise<{ url: string; error?: string }> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { url: "", error: "Format d'image non supporté. Formats acceptés : JPG, PNG, WEBP, AVIF." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { url: "", error: "L'image ne doit pas dépasser 5 Mo." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, uniqueName);

  await writeFile(filePath, buffer);

  return { url: `/uploads/${uniqueName}` };
}


import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(images: any): string | null {
  if (!images) return null;
  let parsed = images;
  if (typeof images === "string") {
    try {
      parsed = JSON.parse(images);
    } catch {
      if (images.startsWith("http")) return images;
      return null;
    }
  }
  if (Array.isArray(parsed) && parsed.length > 0) {
    const url = parsed[0];
    if (typeof url === "string" && url.startsWith("http")) return url;
  }
  return null;
}

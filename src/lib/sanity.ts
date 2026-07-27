import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export function isSanityConfigured(): boolean {
  return Boolean(import.meta.env.PUBLIC_SANITY_PROJECT_ID);
}

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: import.meta.env.SANITY_API_READ_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource): string {
  return builder.image(source).width(1200).fit("max").auto("format").url();
}

export function imageUrlFromSanity(image: unknown): string {
  if (!image || typeof image !== "object") return "";
  if ("asset" in image && image.asset) {
    return urlFor(image as SanityImageSource);
  }
  return "";
}

export function parseImages(images: string | string[]): string[] {
  if (Array.isArray(images)) return images;
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
}

export function stringifyImages(images: string[]): string {
  return JSON.stringify(images);
}

export function formatPrice(priceInPaise: number): string {
  return `₹${(priceInPaise / 100).toFixed(2)}`;
}

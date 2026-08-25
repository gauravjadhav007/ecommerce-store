export function getWhatsAppOrderLink(
  phone: string,
  orderNumber: string,
  total: number
): string {
  const message = encodeURIComponent(
    `Hi! I'd like to follow up on my order ${orderNumber} (₹${(total / 100).toFixed(0)}). Thank you!`
  );
  return `https://wa.me/91${phone}?text=${message}`;
}

// Central WhatsApp configuration for Zakaria Fragrances
export const DEFAULT_WHATSAPP_PHONE = "212694024691";

/**
 * Sanitizes phone number to international digit-only format for WhatsApp wa.me links
 * e.g. "+212 694-024691" -> "212694024691"
 * e.g. "0694024691" -> "212694024691"
 */
export function formatPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  
  // If Moroccan local format (starts with 06 or 07), convert to 2126... / 2127...
  if (cleaned.startsWith("06") || cleaned.startsWith("07")) {
    cleaned = "212" + cleaned.substring(1);
  }
  
  return cleaned || DEFAULT_WHATSAPP_PHONE;
}

export function getWhatsAppUrl(message: string, recipientPhone: string = DEFAULT_WHATSAPP_PHONE): string {
  const cleanPhone = formatPhoneForWhatsApp(recipientPhone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Security Utilities: Input Sanitization & Security Protection
 */

/**
 * Sanitizes input strings to prevent XSS attacks and HTML injection.
 */
export function sanitizeInput(input: string | undefined | null): string {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitizes a phone number to only keep valid characters (digits, spaces, +, -)
 */
export function sanitizePhone(phone: string | undefined | null): string {
  if (!phone || typeof phone !== "string") return "";
  return phone.replace(/[^\d+ -]/g, "").trim().slice(0, 20);
}

/**
 * Validates and converts price/quantity to safe numbers
 */
export function sanitizeNumber(value: unknown, fallback: number = 0): number {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num) || num < 0) return fallback;
  return num;
}

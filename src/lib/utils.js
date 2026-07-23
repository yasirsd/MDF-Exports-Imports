import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names, resolving conflicts intelligently.
 * @param {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Read a Vite env var with a safe fallback.
 * @param {string} key
 * @param {string} fallback
 */
export function env(key, fallback = "") {
  const value = import.meta.env?.[key];
  return value === undefined || value === "" ? fallback : value;
}

/**
 * Build a WhatsApp click-to-chat URL with a prefilled message.
 * @param {string} phone digits only, international format
 * @param {string} message
 */
export function whatsappUrl(phone, message = "") {
  const clean = String(phone).replace(/[^\d]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${clean}${text}`;
}

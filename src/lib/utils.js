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

/**
 * Build a mailto: URL with URL-encoded subject and body.
 * Kept as a mobile fallback when the Gmail app scheme is unavailable.
 * @param {string} email
 * @param {{ subject?: string, body?: string }} [opts]
 */
export function mailtoUrl(email, { subject = "", body = "" } = {}) {
  // Use encodeURIComponent (not URLSearchParams) so spaces are %20 — better for mail clients
  const parts = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  return parts.length ? `mailto:${email}?${parts.join("&")}` : `mailto:${email}`;
}

/**
 * Rough mobile / tablet detection for choosing Gmail app vs Gmail web.
 */
export function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua)) {
    return true;
  }
  // iPadOS reports as Macintosh but supports touch
  return navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua);
}

/**
 * Gmail website compose URL (desktop). Prefills to / subject / body.
 * @param {string} email
 * @param {{ subject?: string, body?: string }} [opts]
 */
export function gmailComposeUrl(email, { subject = "", body = "" } = {}) {
  const params = new URLSearchParams();
  params.set("view", "cm");
  params.set("fs", "1");
  params.set("to", email);
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Gmail app deep-link (iOS / Android when the app is installed).
 * @param {string} email
 * @param {{ subject?: string, body?: string }} [opts]
 */
export function gmailAppComposeUrl(email, { subject = "", body = "" } = {}) {
  const params = new URLSearchParams();
  params.set("to", email);
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  return `googlegmail://co?${params.toString()}`;
}

/**
 * Open a prefilled email compose:
 * - Desktop → Gmail website (new tab)
 * - Android → Gmail app via Intent, falls back to Gmail web
 * - iOS → Gmail app scheme, falls back to mailto then Gmail web
 *
 * Why not mailto alone: Chrome/Edge on Windows often have no mail handler, so
 * mailto: appears to "do nothing". HTTPS Gmail compose always works in a browser.
 *
 * @param {string} email
 * @param {{ subject?: string, body?: string }} [opts]
 */
export function openEmailCompose(email, { subject = "", body = "" } = {}) {
  const opts = { subject, body };
  const webUrl = gmailComposeUrl(email, opts);

  if (typeof window === "undefined") return webUrl;

  if (!isMobileDevice()) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return webUrl;
  }

  const ua = navigator.userAgent || "";

  // Android: Intent opens the Gmail app when installed; otherwise browser_fallback_url
  if (/Android/i.test(ua)) {
    const intent = [
      `intent://co?to=${encodeURIComponent(email)}`,
      subject ? `&subject=${encodeURIComponent(subject)}` : "",
      body ? `&body=${encodeURIComponent(body)}` : "",
      "#Intent;scheme=googlegmail;package=com.google.android.gm;",
      `S.browser_fallback_url=${encodeURIComponent(webUrl)};end`,
    ].join("");
    window.location.assign(intent);
    return webUrl;
  }

  // iOS / other mobile: try Gmail app, then system mail, then Gmail web
  const appUrl = gmailAppComposeUrl(email, opts);
  const mailUrl = mailtoUrl(email, opts);
  let leftPage = false;
  const markLeft = () => {
    leftPage = true;
  };
  document.addEventListener("visibilitychange", markLeft);
  window.addEventListener("pagehide", markLeft);

  window.location.assign(appUrl);

  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", markLeft);
    window.removeEventListener("pagehide", markLeft);
    if (leftPage || document.hidden) return;
    window.location.assign(mailUrl);
    window.setTimeout(() => {
      if (!document.hidden) {
        window.open(webUrl, "_blank", "noopener,noreferrer");
      }
    }, 700);
  }, 900);

  return webUrl;
}

/**
 * Build a tel: URL for the device dialer / phone app (mobile + desktop).
 * Keeps a leading + for international numbers; strips other formatting.
 * @param {string} phone
 */
export function telUrl(phone) {
  const raw = String(phone || "").trim();
  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/[^\d]/g, "");
  return hasPlus ? `tel:+${digits}` : `tel:${digits}`;
}

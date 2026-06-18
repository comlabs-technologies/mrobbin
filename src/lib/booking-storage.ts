const BOOKING_CONFIRMED_KEY = "uttam-booking-confirmed";

export function isBookingConfirmed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(BOOKING_CONFIRMED_KEY) === "true";
}

export function markBookingConfirmed(): void {
  localStorage.setItem(BOOKING_CONFIRMED_KEY, "true");
  window.dispatchEvent(new Event("uttam-booking-confirmed"));
}

export const BOOKING_CONFIRMED_EVENT = "uttam-booking-confirmed";

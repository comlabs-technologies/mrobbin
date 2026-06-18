"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  bookingConfirmedNote,
  bookingConfirmedStatus,
  bookingDetails,
  bookingStatus,
  bookingTotal,
} from "@/lib/content";
import { isBookingConfirmed, markBookingConfirmed } from "@/lib/booking-storage";
import { CancelButton } from "./cancel-button";
import { ConfirmationModal } from "./confirmation-modal";

export function BookingCard() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIsConfirmed(isBookingConfirmed());
    setHydrated(true);
  }, []);

  function handleCloseModal() {
    setModalOpen(false);
  }

  async function handleConfirm() {
    setSending(true);
    setEmailError(null);

    try {
      const response = await fetch("/api/booking/confirm", { method: "POST" });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to send confirmation email");
      }

      markBookingConfirmed();
      setIsConfirmed(true);
      setModalOpen(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not send confirmation email";
      setEmailError(message);
    } finally {
      setSending(false);
    }
  }

  const statusLabel = isConfirmed ? bookingConfirmedStatus : bookingStatus;

  return (
    <div className="rounded-xl border border-rose-100 bg-blush-surface p-5 shadow-[0_6px_16px_rgba(244,63,94,0.07)] sm:p-6">
      <div className="flex flex-col gap-2 border-b border-deco pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h3 className="text-base font-semibold tracking-tight text-hof">Your stay</h3>
        <span
          className={`w-fit rounded-full border px-2.5 py-1 text-xs font-medium tracking-tight ${
            isConfirmed
              ? "border-rose-100 bg-rose-50 text-rausch"
              : "border-rose-100 bg-rose-50 text-rausch"
          }`}
        >
          {hydrated ? statusLabel : bookingStatus}
        </span>
      </div>

      <dl className="divide-y divide-deco">
        {bookingDetails.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <dt className="flex items-center gap-2 text-sm tracking-tight text-foggy">
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {label}
            </dt>
            <dd className="pl-6 text-sm font-medium tracking-tight text-hof sm:pl-0 sm:text-right">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between border-t border-deco pt-4">
        <span className="text-base font-semibold tracking-tight text-hof">Total</span>
        <span className="text-base font-semibold tracking-tight text-rausch">{bookingTotal}</span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {isConfirmed ? (
          <div className="rounded-lg border border-rose-100 bg-rose-50/70 px-4 py-4 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-50">
              <CheckCircle2 className="h-4 w-4 text-rausch" strokeWidth={2} />
            </div>
            <p className="text-sm font-semibold tracking-tight text-hof">Booking confirmed</p>
            <p className="mt-1 text-xs leading-normal tracking-tight text-foggy">
              {bookingConfirmedNote}
            </p>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={sending}
              className="min-h-11 w-full rounded-lg bg-rausch px-5 py-3.5 text-sm font-semibold tracking-tight text-white transition-colors hover:bg-rausch-dark active:bg-rausch-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? "Sending confirmation…" : "Confirm booking"}
            </button>
            {emailError && (
              <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-center text-xs leading-normal tracking-tight text-rausch">
                {emailError}
              </p>
            )}
            <CancelButton />
          </>
        )}
      </div>

      <ConfirmationModal open={modalOpen} onClose={handleCloseModal} />
    </div>
  );
}

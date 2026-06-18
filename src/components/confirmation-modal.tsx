"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { bookingConfirmedModal } from "@/lib/content";
import { HeartPour } from "./heart-pour";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConfirmationModal({ open, onClose }: ConfirmationModalProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 380, damping: 32 }
            }
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-deco bg-blush-surface shadow-[0_6px_16px_rgba(244,63,94,0.07)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-foggy transition-colors hover:bg-rose-50 hover:text-hof"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative px-6 pb-8 pt-12 text-center sm:px-8 sm:pb-10">
              <HeartPour active />

              <motion.div
                className="relative z-[1] mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50"
                initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0.15 }
                    : { type: "spring", stiffness: 420, damping: 24, delay: 0.05 }
                }
              >
                <Heart
                  className="h-6 w-6 text-rausch"
                  strokeWidth={2}
                  fill="currentColor"
                  fillOpacity={0.12}
                />
              </motion.div>

              <motion.h3
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="relative z-[1] text-[1.375rem] font-semibold tracking-tighter text-hof"
              >
                {bookingConfirmedModal.title}
              </motion.h3>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.16 }}
                className="relative z-[1] mt-3 text-base font-medium tracking-tight text-rausch"
              >
                {bookingConfirmedModal.body}
              </motion.p>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.22 }}
                className="relative z-[1] mt-2 text-sm leading-normal tracking-tight text-foggy"
              >
                {bookingConfirmedModal.subtext}
              </motion.p>
              <motion.button
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.28 }}
                type="button"
                onClick={onClose}
                className="relative z-[1] mt-6 min-h-11 w-full rounded-lg bg-rausch px-6 py-3 text-sm font-semibold tracking-tight text-white transition-colors hover:bg-rausch-dark active:bg-rausch-dark"
              >
                {bookingConfirmedModal.cta}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

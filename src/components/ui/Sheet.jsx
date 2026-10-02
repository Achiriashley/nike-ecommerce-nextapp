"use client";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Slide-over panel with overlay, Escape to close, scroll lock and focus handling.
export default function Sheet({ open, onClose, side = "right", title, description, children, footer, className }) {
  const panelRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-in fade-in" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute top-0 flex h-full w-full max-w-[440px] flex-col bg-white shadow-pop outline-none",
          side === "right" ? "right-0 animate-slide-in-right" : "left-0 animate-slide-in-left",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-ink">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-neutral-600">{description}</p>}
          </div>
          <button onClick={onClose} className="-mr-2 rounded-full p-2 text-ink hover:bg-surface" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t p-5">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface SpotlightGridProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightGrid({ children, className = "" }: SpotlightGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      // Find the closest card
      const target = e.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>(
        ".card-light, .card-glass, .feature-card, .value-card, .industry-card, .client-card, .division-card, .statement-card, .edge-card, .sustainability-items > div, .checklist-item, .contact-information, .contact-form, .division-benefit"
      );

      if (!card) return;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
      });
    };

    el.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageGalleryLightboxProps {
  images: LightboxImage[];
  sizes?: string;
  className?: string;
  frameClassName?: string;
}

export function ImageGalleryLightbox({
  images,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 380px",
  className = "division-media-gallery",
  frameClassName = "division-media-frame",
}: ImageGalleryLightboxProps) {
  // false on the server and during hydration, true afterwards (needed for the body portal).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loadedThumbs, setLoadedThumbs] = useState<Record<string, boolean>>({});
  const [loadedLarge, setLoadedLarge] = useState<Record<string, boolean>>({});
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const isOpen = activeIndex !== null;

  const closeLightbox = useCallback(() => {
    const prevIndex = activeIndex;
    setActiveIndex(null);
    if (prevIndex !== null && triggerRefs.current[prevIndex]) {
      triggerRefs.current[prevIndex]?.focus();
    }
  }, [activeIndex]);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % images.length;
    });
  }, [images.length]);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + images.length) % images.length;
    });
  }, [images.length]);

  // Lock scroll without layout shift
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Keyboard navigation & escape listener & focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        showNext();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrev();
        return;
      }

      // Simple focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeLightbox, showNext, showPrev]);

  // Focus modal close button or container on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const closeBtn = modalRef.current.querySelector<HTMLButtonElement>(".lightbox-close");
      closeBtn?.focus();
    }
  }, [isOpen]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartXRef.current;
    const diffY = touch.clientY - touchStartYRef.current;

    // Minimum swipe threshold 40px and predominantly horizontal
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        showNext();
      } else {
        showPrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <>
      <div className={className}>
        {images.map((img, idx) => (
          <button
            key={img.src}
            ref={(el) => {
              triggerRefs.current[idx] = el;
            }}
            type="button"
            className={`${frameClassName} division-media-frame--interactive${loadedThumbs[img.src] ? "" : " is-loading"}`}
            aria-label={`View larger image: ${img.alt}`}
            onClick={() => setActiveIndex(idx)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={sizes}
              className="division-media-image"
              onLoad={() => setLoadedThumbs((prev) => ({ ...prev, [img.src]: true }))}
              onError={() => setLoadedThumbs((prev) => ({ ...prev, [img.src]: true }))}
            />
            <span className="division-media-zoom-badge" aria-hidden="true">
              <ZoomIn size={15} />
            </span>
          </button>
        ))}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && activeIndex !== null && (
              <motion.div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label="Image viewer"
                className="lightbox-overlay"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                onClick={closeLightbox}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Close button */}
                <button
                  type="button"
                  className="lightbox-close"
                  aria-label="Close image viewer"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeLightbox();
                  }}
                >
                  <X size={24} />
                </button>

                {/* Previous button */}
                {images.length > 1 && (
                  <button
                    type="button"
                    className="lightbox-nav lightbox-nav--prev"
                    aria-label="Previous image"
                    onClick={(e) => {
                      e.stopPropagation();
                      showPrev();
                    }}
                  >
                    <ChevronLeft size={28} />
                  </button>
                )}

                {/* Next button */}
                {images.length > 1 && (
                  <button
                    type="button"
                    className="lightbox-nav lightbox-nav--next"
                    aria-label="Next image"
                    onClick={(e) => {
                      e.stopPropagation();
                      showNext();
                    }}
                  >
                    <ChevronRight size={28} />
                  </button>
                )}

                {/* Enlarged image container */}
                <motion.div
                  key={activeIndex}
                  className={`lightbox-content-frame${loadedLarge[images[activeIndex].src] ? "" : " is-loading is-loading--spinner"}`}
                  initial={
                    reduceMotion
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.94 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0, scale: 1 }
                      : { opacity: 0, scale: 0.94 }
                  }
                  transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={images[activeIndex].src}
                    alt={images[activeIndex].alt}
                    fill
                    sizes="94vw"
                    className="lightbox-image"
                    priority
                    onLoad={() => setLoadedLarge((prev) => ({ ...prev, [images[activeIndex].src]: true }))}
                    onError={() => setLoadedLarge((prev) => ({ ...prev, [images[activeIndex].src]: true }))}
                  />
                </motion.div>

                {/* Counter */}
                {images.length > 1 && (
                  <div
                    className="lightbox-counter"
                    aria-live="polite"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {activeIndex + 1} / {images.length}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

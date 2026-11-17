import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  ariaLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'max-w-3xl',
  ariaLabel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore upon close
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus inside modal
    const focusTimer = setTimeout(() => {
      if (dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          dialogRef.current.focus();
        }
      }
    }, 50);

    // Escape and Focus Trap handling
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === 'function') {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const titleId = `modal-title-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const descId = subtitle ? `${titleId}-desc` : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        aria-label={ariaLabel || title}
        tabIndex={-1}
        className={`skeuo-surface border border-[#27272E] rounded-2xl ${maxWidth} w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-7 space-y-5 text-[#EDEDED] font-sans focus:outline-none`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-xl skeuo-well flex items-center justify-center text-white shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h2 id={titleId} className="text-base sm:text-lg font-bold text-white tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p id={descId} className="text-xs text-[#A1A1A1] mt-0.5 font-mono">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="skeuo-btn p-1.5 rounded-lg text-[#A1A1A1] hover:text-white transition-all active:translate-y-[2px] active:shadow-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {children}
      </div>
    </div>
  );
};

export default Modal;

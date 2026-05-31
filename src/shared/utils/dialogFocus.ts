import type { RefObject } from 'react';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function focusFirstDialogControl(container: HTMLElement | null) {
  const firstFocusable = container?.querySelector<HTMLElement>(focusableSelector);
  firstFocusable?.focus();
}

export function keepFocusInDialog(
  event: KeyboardEvent,
  containerRef: RefObject<HTMLElement>
) {
  if (event.key !== 'Tab') {
    return;
  }

  const container = containerRef.current;

  if (!container) {
    return;
  }

  const focusableElements = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelector)
  );

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

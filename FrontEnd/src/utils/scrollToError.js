// Utility to scroll to the first visible validation error on the page
// Consistent with current project style: plain JS utility under src/utils

export function scrollToFirstError(options = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  const {
    container = document, // optionally pass a specific container (e.g., a form element)
    behavior = 'smooth',
    block = 'center',
  } = options;

  // Priority: inputs/selects/textareas marked with error border, then generic error messages
  const selectorsInPriority = [
    'input.border-red-500',
    'select.border-red-500',
    'textarea.border-red-500',
    '[aria-invalid="true"]',
    // Fall back to error text if field itself isn't easily targetable (e.g., hidden file input)
    '.text-red-500',
  ];

  let target = null;
  for (const sel of selectorsInPriority) {
    const el = container.querySelector(sel);
    if (el) {
      target = el;
      break;
    }
  }

  if (!target) return false;

  // If we matched an error text element, try to find a nearby input to focus.
  let focusTarget = target;
  if (!target.matches('input, select, textarea, [contenteditable="true"]')) {
    const prev = target.previousElementSibling;
    if (prev && prev.matches && prev.matches('input, select, textarea, [contenteditable="true"]')) {
      focusTarget = prev;
    } else {
      const closestField = target.closest('input, select, textarea, [contenteditable="true"]');
      if (closestField) focusTarget = closestField;
    }
  }

  try {
    focusTarget.scrollIntoView({ behavior, block, inline: 'nearest' });
  } catch {
    // Fallback for older browsers
    focusTarget.scrollIntoView();
  }

  // Focus the field without re-scrolling (modern browsers)
  try {
    focusTarget.focus?.({ preventScroll: true });
  } catch {
    try { focusTarget.focus?.(); } catch {}
  }

  return true;
}

export default scrollToFirstError;

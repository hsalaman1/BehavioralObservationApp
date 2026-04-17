import { useState } from 'react';

// Mobile-only collapsible wrapper. On md+ the control hides and children always show.
// Renders no extra card chrome so wrapped forms keep their own styling.
export function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden w-full flex items-center justify-between px-4 py-2 mb-2 bg-white border rounded-lg text-sm font-semibold text-gray-800 shadow-sm"
        aria-expanded={open}
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`${open ? 'block' : 'hidden'} md:block`}>
        {children}
      </div>
    </div>
  );
}

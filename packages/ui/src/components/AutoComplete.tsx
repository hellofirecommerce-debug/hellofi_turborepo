// packages/ui/src/components/Combobox.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";

interface AutoCompleteProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  value,
  onChange,
  options,
  placeholder = "Search or type...",
  title,
  className = "",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputVal(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(inputVal.toLowerCase()),
  );

  const handleInput = (val: string) => {
    setInputVal(val);
    onChange(val);
    setOpen(true);
  };

  const handleSelect = (val: string) => {
    setInputVal(val);
    onChange(val);
    setOpen(false);
  };

  const handleClear = () => {
    setInputVal("");
    onChange("");
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          title={title}
          placeholder={placeholder}
          value={inputVal}
          disabled={disabled}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => setOpen(true)}
          className="w-full h-9 px-3 pr-8 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        />
        {/* Clear / Chevron icon */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (inputVal) {
              handleClear();
            } else {
              setOpen((p) => !p);
            }
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          {inputVal ? (
            // X icon
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            // Chevron down icon
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                  value === opt
                    ? "bg-[rgb(33,76,123)]/10 text-[rgb(33,76,123)] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt}
                {value === opt && (
                  // Checkmark
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))
          ) : inputVal ? (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(inputVal)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Use &quot;{inputVal}&quot;
            </button>
          ) : (
            <p className="px-3 py-2 text-sm text-gray-400">
              Start typing to search...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

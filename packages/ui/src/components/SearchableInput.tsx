"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";

interface SearchableInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => Promise<string[]> | string[];
  placeholder?: string;
  title?: string;
  debounceMs?: number;
}

export function SearchableInput({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  title,
  debounceMs = 400,
}: SearchableInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debouncedInput] = useDebounce(inputValue, debounceMs);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Fetch options when debounced input changes ──
  useEffect(() => {
    if (!debouncedInput || debouncedInput.length < 1) {
      setOptions([]);
      setIsOpen(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const results = await onSearch(debouncedInput);
        setOptions(results);
        setIsOpen(results.length > 0);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedInput]);

  // ── Close on outside click ──
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Sync external value ──
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val); // ← allow free text too
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        title={title}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25"
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-3 top-2.5">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin" />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && options.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

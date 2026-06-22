"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { HiChevronDown } from "react-icons/hi2";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  disabled = false,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, close]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
          close();
        } else {
          setIsOpen(true);
          setFocusedIndex(options.findIndex((o) => o.value === value));
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.findIndex((o) => o.value === value));
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    close();
  };

  return (
    <div ref={containerRef} className={`custom-select-wrapper ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`custom-select-trigger ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? "custom-select-value" : "custom-select-placeholder"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <HiChevronDown className={`custom-select-chevron ${isOpen ? "rotated" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="custom-select-menu"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`custom-select-option ${
                option.value === value ? "selected" : ""
              } ${focusedIndex === index ? "focused" : ""}`}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {option.label}
              {option.value === value && (
                <svg className="custom-select-check" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

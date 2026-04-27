"use client";

import { forwardRef, useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseFieldProps {
  label?: string;
  error?: string;
  hint?: string;
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & BaseFieldProps;

/**
 * Form field that adapts to the current Section tone (dark/light).
 * Uses the --section-* tokens from globals.css.
 */
const fieldBase =
  "w-full rounded-lg border px-3.5 py-2.5 text-sm font-light transition-all duration-300 " +
  "bg-[color-mix(in_srgb,var(--section-fg)_3%,transparent)] " +
  "border-[var(--section-border)] " +
  "text-[var(--section-fg)] " +
  "placeholder:text-[var(--section-muted)] placeholder:font-light " +
  "focus:outline-none focus:border-[var(--color-gold-400)]/60 focus:bg-[color-mix(in_srgb,var(--section-fg)_5%,transparent)] focus:ring-1 focus:ring-[var(--color-gold-400)]/20";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type, ...props }, ref) => {
    const inputId = id ?? props.name;
    const isPassword = type === "password";
    const [revealed, setRevealed] = useState(false);
    const effectiveType = isPassword && revealed ? "text" : type;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-[10px] font-light uppercase tracking-[0.2em] text-[var(--section-muted)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            className={cn(
              fieldBase,
              isPassword && "pr-10",
              error && "border-red-500/60 focus:border-red-500 focus:ring-red-500/10",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setRevealed((r) => !r)}
              aria-label={revealed ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-2 inline-flex items-center justify-center w-7 text-[var(--section-muted)] hover:text-[var(--color-gold-300)] transition-colors duration-150"
            >
              {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {hint && !error && <p className="text-[10px] text-[var(--section-muted)]">{hint}</p>}
        {error && <p className="text-[10px] text-red-500">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & BaseFieldProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 4, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-[10px] font-light uppercase tracking-[0.2em] text-[var(--section-muted)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            fieldBase,
            "resize-none leading-relaxed",
            error && "border-red-500/60 focus:border-red-500",
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-[10px] text-[var(--section-muted)]">{hint}</p>}
        {error && <p className="text-[10px] text-red-500">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id, options, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-[10px] font-light uppercase tracking-[0.2em] text-[var(--section-muted)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(fieldBase, "appearance-none cursor-pointer pr-8", className)}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-[var(--bg-elev)] text-[var(--fg)]"
            >
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && <p className="text-[10px] text-[var(--section-muted)]">{hint}</p>}
        {error && <p className="text-[10px] text-red-500">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";

import type { ReactNode } from 'react';
import type { SelectOption } from '../data/options';

// Shared form building blocks: labelled text input, labelled select, and an
// accessible toggle switch (role="switch"). Field errors are linked to their
// input with aria-describedby and set aria-invalid.

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function TextField({ id, label, value, onChange, error, placeholder }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-bold tracking-wide text-[#6e7a91] uppercase">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-10 w-full rounded-lg border bg-white px-3 text-[13px] text-[#14213d] transition focus:border-[#2156e8] focus:ring-2 focus:ring-[#2156e8]/20 focus:outline-none ${
          error ? 'border-[#e04d65]' : 'border-[#e4eaf3] hover:border-[#c6d2e8]'
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[11px] font-semibold text-[#e04d65]">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
}

export function SelectField({ id, label, value, options, onChange, error }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-bold tracking-wide text-[#6e7a91] uppercase">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-10 w-full appearance-none rounded-lg border bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236e7a91%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[position:right_12px_center] bg-no-repeat px-3 pr-9 text-[13px] text-[#14213d] transition focus:border-[#2156e8] focus:ring-2 focus:ring-[#2156e8]/20 focus:outline-none ${
          error ? 'border-[#e04d65]' : 'border-[#e4eaf3] hover:border-[#c6d2e8]'
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[11px] font-semibold text-[#e04d65]">
          {error}
        </p>
      )}
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  suffix?: string;
}

export function NumberField({ id, label, value, onChange, min = 0, suffix }: NumberFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-bold tracking-wide text-[#6e7a91] uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          min={min}
          value={Number.isNaN(value) ? '' : value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-10 w-full rounded-lg border border-[#e4eaf3] bg-white px-3 pr-14 text-[13px] text-[#14213d] transition hover:border-[#c6d2e8] focus:border-[#2156e8] focus:ring-2 focus:ring-[#2156e8]/20 focus:outline-none"
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-semibold text-[#9aa5b8]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

interface ToggleSwitchProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// role="switch" + aria-checked is the accessible toggle pattern; the visible
// label is clickable so the real <button> can stay small.
export function ToggleSwitch({ id, label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-[12.5px] font-bold text-[#14213d]">
          {label}
        </label>
        <p id={`${id}-description`} className="mt-0.5 text-[11px] leading-relaxed text-[#8a96a9]">
          {description}
        </p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={`${id}-description`}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#2156e8]/40 focus-visible:ring-offset-2 focus-visible:outline-none ${
          checked ? 'bg-[#2156e8]' : 'bg-[#d3dce9]'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

/** A labelled section divider inside a settings card, like the design's "System Information". */
export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="border-b border-[#edf1f7] py-5 last:border-b-0">
      <h3 className="mb-4 text-[12px] font-extrabold tracking-wide text-[#14213d]">{title}</h3>
      {children}
    </section>
  );
}

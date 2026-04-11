"use client";

import type { ReactNode } from "react";

const controlClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-200 dark:focus:ring-neutral-200";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
        {label}
      </div>
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${controlClass} min-h-[104px] resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${controlClass} ${props.className ?? ""}`}
    />
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 ${className ?? ""}`}
    />
  );
}

export function GhostButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 ${className ?? ""}`}
    />
  );
}

export function DangerButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-50 ${className ?? ""}`}
    />
  );
}

"use client";

import { useState } from "react";
import { GhostButton, TextInput } from "./fields";

type TagInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const t = draft.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <TextInput
          value={draft}
          placeholder={placeholder ?? "Type a tag and press Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
        />
        <GhostButton type="button" onClick={commit} className="shrink-0">
          Add tag
        </GhostButton>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
          >
            {tag}
            <button
              type="button"
              className="rounded px-0.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((x) => x !== tag))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

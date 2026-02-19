// /src/storage.ts
import type { Submission } from "./types";

const KEY_SUBMISSIONS = "hiddenUAE:submissions";

export function getSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(KEY_SUBMISSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Submission[];
  } catch {
    return [];
  }
}

export function saveSubmissions(items: Submission[]) {
  localStorage.setItem(KEY_SUBMISSIONS, JSON.stringify(items));
}

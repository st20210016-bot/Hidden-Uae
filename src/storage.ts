// /src/storage.ts
import type { Locale, ProgressState, Submission } from "./types";
export type { ProgressState } from "./types";

const KEY = "hiddenUAE:progress";

const DEFAULT_STATE: ProgressState = {
  unlockedGemIds: [],
  totalPoints: 0,
  earnedBadges: [],
  preferredLocale: "en",
  submissions: [],
  points: 0
};

function safeParse(raw: string | null): any {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalize(input: any): ProgressState {
  if (!input || typeof input !== "object") return { ...DEFAULT_STATE };

  const unlockedGemIds = Array.isArray(input.unlockedGemIds)
    ? input.unlockedGemIds.filter((x: any) => typeof x === "string")
    : [];

  const earnedBadges = Array.isArray(input.earnedBadges)
    ? input.earnedBadges.filter((x: any) => typeof x === "string")
    : [];

  const preferredLocale: Locale = input.preferredLocale === "ar" ? "ar" : "en";

  const submissions = Array.isArray(input.submissions) ? (input.submissions as Submission[]) : [];

  const totalPoints =
    typeof input.totalPoints === "number"
      ? input.totalPoints
      : typeof input.points === "number"
        ? input.points
        : 0;

  return {
    unlockedGemIds,
    earnedBadges: earnedBadges as any,
    preferredLocale,
    submissions,
    totalPoints,
    points: totalPoints
  };
}

// ✅ Accept any call style (0, 1, 2 args) so TS never complains
export function loadProgress(): ProgressState;
export function loadProgress(_a: unknown): ProgressState;
export function loadProgress(_a: unknown, _b: unknown): ProgressState;
export function loadProgress(_a?: unknown, _b?: unknown): ProgressState {
  return normalize(safeParse(localStorage.getItem(KEY)));
}

export function saveProgress(state: ProgressState): void;
export function saveProgress(_a: unknown, state: ProgressState): void;
export function saveProgress(arg1: any, arg2?: any): void {
  const state: ProgressState = arg2 ? (arg2 as ProgressState) : (arg1 as ProgressState);
  localStorage.setItem(KEY, JSON.stringify(normalize(state)));
}

export function setPreferredLocale(locale: Locale) {
  const s = loadProgress();
  saveProgress({ ...s, preferredLocale: locale });
}

export function getSubmissions(): Submission[] {
  return loadProgress().submissions ?? [];
}

export function saveSubmissions(items: Submission[]) {
  const s = loadProgress();
  saveProgress({ ...s, submissions: items });
}

export function addSubmission(item: Submission) {
  saveSubmissions([item, ...getSubmissions()]);
}

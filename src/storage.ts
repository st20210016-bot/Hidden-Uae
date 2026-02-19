// /src/storage.ts
import type { Locale, ProgressState, Submission } from "./types";

export type { ProgressState } from "./types";

const KEY = "hiddenUAE:progress";

const DEFAULT_STATE: ProgressState = {
  unlockedGemIds: [],
  totalPoints: 0,
  earnedBadges: [],
  preferredLocale: "en",
  submissions: []
};

function safeParse(raw: string | null): any {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Some older code might call loadProgress(locale) or loadProgress(key, locale).
 * We accept extra args and ignore them to keep builds passing.
 */
export function loadProgress(_arg1?: unknown, _arg2?: unknown): ProgressState {
  const parsed = safeParse(localStorage.getItem(KEY));
  if (!parsed || typeof parsed !== "object") return { ...DEFAULT_STATE };

  const unlockedGemIds = Array.isArray(parsed.unlockedGemIds)
    ? parsed.unlockedGemIds.filter((x: any) => typeof x === "string")
    : [];

  // Canonical points field is totalPoints, but fallback to points if present
  const totalPoints =
    typeof parsed.totalPoints === "number"
      ? parsed.totalPoints
      : typeof parsed.points === "number"
        ? parsed.points
        : 0;

  const earnedBadges = Array.isArray(parsed.earnedBadges)
    ? parsed.earnedBadges.filter((x: any) => typeof x === "string")
    : [];

  const preferredLocale: Locale = parsed.preferredLocale === "ar" ? "ar" : "en";

  const submissions = Array.isArray(parsed.submissions) ? (parsed.submissions as Submission[]) : [];

  return {
    unlockedGemIds,
    totalPoints,
    earnedBadges,
    preferredLocale,
    submissions,
    // keep backward-compat mirror
    points: totalPoints
  };
}

/**
 * Some older code might call saveProgress(locale, state) or saveProgress(state, locale).
 * We accept optional extra args and ignore them.
 */
export function saveProgress(state: ProgressState, _arg2?: unknown): void {
  const normalized: ProgressState = {
    ...DEFAULT_STATE,
    ...state,
    totalPoints: typeof state.totalPoints === "number" ? state.totalPoints : state.points ?? 0,
    points: typeof state.totalPoints === "number" ? state.totalPoints : state.points ?? 0
  };
  localStorage.setItem(KEY, JSON.stringify(normalized));
}

export function setPreferredLocale(locale: Locale): void {
  const s = loadProgress();
  saveProgress({ ...s, preferredLocale: locale });
}

export function getSubmissions(): Submission[] {
  return loadProgress().submissions ?? [];
}

/**
 * Your SubmitPage expects `saveSubmissions(array)`
 */
export function saveSubmissions(items: Submission[]): void {
  const s = loadProgress();
  saveProgress({ ...s, submissions: items });
}

/**
 * Convenience helper
 */
export function addSubmission(item: Submission): void {
  const prev = getSubmissions();
  saveSubmissions([item, ...prev]);
}

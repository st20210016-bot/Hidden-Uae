// /src/badges.ts
import type { Badge, BadgeKey, Gem } from "./types";

export const BADGES: Badge[] = [
  {
    key: "first_unlock",
    titleKey: "badges.first_unlock.title",
    descKey: "badges.first_unlock.desc",
    icon: "✨"
  },
  {
    key: "explorer",
    titleKey: "badges.explorer.title",
    descKey: "badges.explorer.desc",
    icon: "🧭"
  },
  {
    key: "adventurer",
    titleKey: "badges.adventurer.title",
    descKey: "badges.adventurer.desc",
    icon: "🏜️"
  },
  {
    key: "photographer",
    titleKey: "badges.photographer.title",
    descKey: "badges.photographer.desc",
    icon: "📸"
  },
  {
    key: "emirate_specialist",
    titleKey: "badges.emirate_specialist.title",
    descKey: "badges.emirate_specialist.desc",
    icon: "🗺️"
  }
];

export function computeEarnedBadges(params: {
  unlockedGemIds: string[];
  allGems: Gem[];
}): BadgeKey[] {
  const { unlockedGemIds, allGems } = params;
  const unlocked = allGems.filter((g) => unlockedGemIds.includes(g.id));

  const earned = new Set<BadgeKey>();

  if (unlockedGemIds.length >= 1) earned.add("first_unlock");
  if (unlockedGemIds.length >= 5) earned.add("explorer");
  if (unlockedGemIds.length >= 15) earned.add("adventurer");

  const photogenicCount = unlocked.filter((g) => g.photogenic).length;
  if (photogenicCount >= 10) earned.add("photographer");

  // Emirate Specialist: unlock 5 in same emirate
  const byEmirate = new Map<string, number>();
  for (const g of unlocked) {
    byEmirate.set(g.emirate, (byEmirate.get(g.emirate) ?? 0) + 1);
  }
  for (const [, count] of byEmirate) {
    if (count >= 5) {
      earned.add("emirate_specialist");
      break;
    }
  }

  return Array.from(earned);
}

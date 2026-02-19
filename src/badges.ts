// /src/badges.ts
import type { Badge, BadgeKey, Emirate, Gem } from "./types";

export const BADGES: Badge[] = [
  {
    key: "first_unlock",
    titleKey: "badges.first_unlock.title",
    descKey: "badges.first_unlock.desc",
    icon: "✨",
    goal: 1
  },
  {
    key: "explorer",
    titleKey: "badges.explorer.title",
    descKey: "badges.explorer.desc",
    icon: "🧭",
    goal: 5
  },
  {
    key: "adventurer",
    titleKey: "badges.adventurer.title",
    descKey: "badges.adventurer.desc",
    icon: "🏔️",
    goal: 15
  },
  {
    key: "photographer",
    titleKey: "badges.photographer.title",
    descKey: "badges.photographer.desc",
    icon: "📸",
    goal: 10
  },
  {
    key: "emirate_specialist",
    titleKey: "badges.emirate_specialist.title",
    descKey: "badges.emirate_specialist.desc",
    icon: "🏙️",
    goal: 5
  }
];

export function computeEarnedBadges(gems: Gem[], unlockedIds: string[]): BadgeKey[] {
  const unlockedSet = new Set(unlockedIds);
  const unlocked = gems.filter((g) => unlockedSet.has(g.id));

  const totalUnlocked = unlocked.length;
  const photogenicUnlocked = unlocked.filter((g) => g.photogenic).length;

  // Emirate specialist: 5 in the same emirate
  const emirateCounts: Record<Emirate, number> = {
    Dubai: 0,
    "Abu Dhabi": 0,
    Sharjah: 0,
    Ajman: 0,
    Fujairah: 0,
    "Ras Al Khaimah": 0,
    "Umm Al Quwain": 0
  };
  for (const g of unlocked) emirateCounts[g.emirate]++;

  const hasEmirateSpecialist = Object.values(emirateCounts).some((n) => n >= 5);

  const earned: BadgeKey[] = [];

  if (totalUnlocked >= 1) earned.push("first_unlock");
  if (totalUnlocked >= 5) earned.push("explorer");
  if (totalUnlocked >= 15) earned.push("adventurer");
  if (photogenicUnlocked >= 10) earned.push("photographer");
  if (hasEmirateSpecialist) earned.push("emirate_specialist");

  return earned;
}

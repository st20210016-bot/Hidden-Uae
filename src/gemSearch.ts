// /src/gemSearch.ts
import type { Budget, Emirate, Gem } from "./types";
import type { TFunction } from "i18next";
import type { Filters } from "./FilterBar";

export function emirateLabel(t: TFunction, emirate: Emirate) {
  return t(`emirates.${emirate}`);
}

export function budgetLabel(t: TFunction, budget: Budget) {
  return t(`budgets.${budget}`);
}

export function matchesFilters(gem: Gem, f: Filters, locale: "en" | "ar") {
  if (f.emirate !== "all" && gem.emirate !== f.emirate) return false;
  if (f.budget !== "all" && gem.budget !== f.budget) return false;
  if (f.photogenicOnly && !gem.photogenic) return false;

  const q = f.search.trim().toLowerCase();
  if (!q) return true;

  const name = (locale === "ar" ? gem.name_ar : gem.name_en).toLowerCase();
  const area = (locale === "ar" ? gem.area_ar : gem.area_en).toLowerCase();
  const tags = gem.tags.join(" ").toLowerCase();
  const category = gem.category.toLowerCase();

  return [name, area, tags, category].some((s) => s.includes(q));
}

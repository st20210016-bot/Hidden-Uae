// /src/CollectionPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Gem, Locale, ProgressState } from "./types";
import { isLocale } from "./types";
import { loadProgress, saveProgress } from "./storage";

export default function CollectionPage() {
  const { locale } = useParams();
  const loc: Locale = isLocale(locale) ? locale : "en";
  const { t } = useTranslation();

  const [gems, setGems] = useState<Gem[]>([]);
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    fetch("/data/gems.json")
      .then((r) => r.json())
      .then((d) => setGems(Array.isArray(d) ? (d as Gem[]) : []))
      .catch(() => setGems([]));
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const unlockedSet = useMemo(() => new Set(progress.unlockedGemIds), [progress.unlockedGemIds]);
  const unlockedGems = useMemo(() => gems.filter((g) => unlockedSet.has(g.id)), [gems, unlockedSet]);

  return (
    <div className="px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">{t("collection.title")}</h1>
            <div className="mt-2 text-sm text-slate-300">
              {t("collection.points")}: <span className="font-semibold text-white">{progress.totalPoints}</span>
              {" • "}
              {t("collection.unlocked")}: <span className="font-semibold text-white">{progress.unlockedGemIds.length}</span>
            </div>
          </div>
          <Link
            to={`/${loc}/map`}
            className="rounded-xl bg-teal-500/20 px-4 py-2 text-white hover:bg-teal-500/30"
          >
            {t("collection.backToMap")}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {unlockedGems.map((g) => (
            <div key={g.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <img
                src={g.images?.[0] ?? "/gems/dubai-skyline.svg"}
                className="h-40 w-full rounded-xl border border-white/10 object-cover"
                alt={loc === "ar" ? g.name_ar : g.name_en}
              />
              <div className="mt-3 font-medium text-white">{loc === "ar" ? g.name_ar : g.name_en}</div>
              <div className="mt-1 text-xs text-slate-400">
                {loc === "ar" ? g.area_ar : g.area_en} • {g.emirate}
              </div>
              <Link to={`/${loc}/gem/${g.id}`} className="mt-3 inline-block text-sm text-teal-300 hover:text-teal-200">
                {t("common.viewDetails")} →
              </Link>
            </div>
          ))}

          {unlockedGems.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
              {t("collection.empty")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

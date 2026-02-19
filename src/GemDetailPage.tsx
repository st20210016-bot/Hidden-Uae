// /src/GemDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Gem, Locale, ProgressState } from "./types";
import { isLocale } from "./types";
import { loadProgress, saveProgress } from "./storage";

export default function GemDetailPage() {
  const { locale, id } = useParams();
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

  const gem = useMemo(() => gems.find((g) => g.id === id), [gems, id]);
  const unlocked = gem ? progress.unlockedGemIds.includes(gem.id) : false;

  function unlock() {
    if (!gem || unlocked) return;
    setProgress((p) => ({
      ...p,
      unlockedGemIds: [gem.id, ...p.unlockedGemIds],
      totalPoints: p.totalPoints + 5,
      points: p.totalPoints + 5
    }));
  }

  if (!gem) {
    return (
      <div className="px-4 py-10">
        <div className="mx-auto max-w-3xl text-slate-200">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <Link to={`/${loc}/map`} className="text-teal-300 hover:text-teal-200">
            ← {t("common.back")}
          </Link>
          <div className="text-sm text-slate-300">
            {t("map.points")}: <span className="font-semibold text-white">{progress.totalPoints}</span>
          </div>
        </div>

        <h1 className="mt-4 text-3xl font-semibold text-white">
          {loc === "ar" ? gem.name_ar : gem.name_en}
        </h1>
        <div className="mt-2 text-slate-400">
          {loc === "ar" ? gem.area_ar : gem.area_en} • {gem.emirate} • {t(`budget.${gem.budget}`)}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <img
            src={gem.images?.[0] ?? "/gems/dubai-skyline.svg"}
            className="h-[380px] w-full object-cover"
            alt=""
          />
        </div>

        <p className="mt-5 text-slate-200">
          {loc === "ar" ? gem.description_ar : gem.description_en}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={unlocked}
            onClick={unlock}
            className={`rounded-xl px-5 py-3 font-medium text-white ${
              unlocked ? "bg-white/10 text-slate-400" : "bg-teal-500/20 hover:bg-teal-500/30"
            }`}
          >
            {unlocked ? t("map.unlocked") : t("map.unlock")}
          </button>

          {gem.google_maps_url && (
            <a
              href={gem.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-white/10 px-5 py-3 text-white hover:bg-white/15"
            >
              {t("common.openMaps")}
            </a>
          )}

          <Link
            to={`/${loc}/collection`}
            className="rounded-xl bg-orange-500/15 px-5 py-3 text-white hover:bg-orange-500/25"
          >
            {t("map.myCollection")}
          </Link>
        </div>
      </div>
    </div>
  );
}

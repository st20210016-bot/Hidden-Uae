// /src/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Gem, Locale, ProgressState } from "./types";
import { isLocale } from "./types";
import { loadProgress, saveProgress } from "./storage";

export default function HomePage() {
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

  const featured = useMemo(() => gems.slice(0, 6), [gems]);
  const unlockedCount = progress.unlockedGemIds.length;

  // Keep localStorage in sync if state changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  return (
    <div className="px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_40px_rgba(45,212,191,0.12)] md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Hidden UAE" className="h-14 w-14 rounded-2xl border border-white/10 bg-black/30" />
              <h1 className="text-4xl font-semibold text-white">Hidden UAE</h1>
            </div>
            <p className="mt-3 max-w-xl text-slate-300">{t("home.subtitle")}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/${loc}/map`}
                className="rounded-xl bg-teal-500/20 px-5 py-3 font-medium text-white shadow-[0_0_25px_rgba(45,212,191,0.25)] hover:bg-teal-500/30"
              >
                {t("home.cta.map")}
              </Link>
              <Link
                to={`/${loc}/collection`}
                className="rounded-xl bg-orange-500/15 px-5 py-3 font-medium text-white shadow-[0_0_25px_rgba(251,146,60,0.18)] hover:bg-orange-500/25"
              >
                {t("home.cta.collection")}
              </Link>
            </div>

            <div className="mt-6 text-sm text-slate-300">
              {t("home.progress")}{" "}
              <span className="font-semibold text-white">
                {unlockedCount}
              </span>{" "}
              • {t("home.points")}{" "}
              <span className="font-semibold text-white">
                {progress.totalPoints}
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="text-sm text-slate-300">{t("home.tipTitle")}</div>
            <div className="mt-2 text-white">{t("home.tipBody")}</div>
            <Link
              to={`/${loc}/submit`}
              className="mt-4 inline-block rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            >
              {t("home.cta.submit")}
            </Link>
          </div>
        </div>

        <h2 className="mt-10 text-xl font-semibold text-white">{t("home.featured")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((g) => (
            <div key={g.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <img
                src={g.images?.[0] ?? "/gems/dubai-skyline.svg"}
                alt={loc === "ar" ? g.name_ar : g.name_en}
                className="h-40 w-full rounded-xl border border-white/10 object-cover"
              />
              <div className="mt-3 text-white font-medium">
                {loc === "ar" ? g.name_ar : g.name_en}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {loc === "ar" ? g.area_ar : g.area_en} • {g.emirate}
              </div>
              <Link
                to={`/${loc}/gem/${g.id}`}
                className="mt-3 inline-block text-sm text-teal-300 hover:text-teal-200"
              >
                {t("common.viewDetails")} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

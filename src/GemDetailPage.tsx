// /src/GemDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Gem, Locale } from "./types";
import { loadProgress, saveProgress } from "./storage";
import { computeEarnedBadges } from "./badges";

export default function GemDetailPage({ locale }: { locale: Locale }) {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const id = params.id ?? "";

  const [gems, setGems] = useState<Gem[]>([]);
  const [progress, setProgress] = useState(loadProgress());
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/data/gems.json");
      const data = (await res.json()) as Gem[];
      setGems(data);
    })();
  }, []);

  const gem = useMemo(() => gems.find((g) => g.id === id) ?? null, [gems, id]);
  const unlocked = gem ? progress.unlockedGemIds.includes(gem.id) : false;

  const unlock = () => {
    if (!gem || unlocked) return;
    const next = {
      ...progress,
      unlockedGemIds: [...progress.unlockedGemIds, gem.id],
      totalPoints: progress.totalPoints + 5
    };
    next.earnedBadges = computeEarnedBadges({ unlockedGemIds: next.unlockedGemIds, allGems: gems });
    setProgress(next);
    saveProgress(next);
  };

  if (!gem) {
    return (
      <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6 shadow-glow">
        <div className="text-slate-300">{t("labels.loading")}</div>
        <Link className="text-brandTeal hover:underline" to={`/${locale}/map`}>
          {t("actions.back")}
        </Link>
      </div>
    );
  }

  const name = locale === "ar" ? gem.name_ar : gem.name_en;
  const area = locale === "ar" ? gem.area_ar : gem.area_en;
  const desc = locale === "ar" ? gem.description_ar : gem.description_en;

  const images = gem.images?.length ? gem.images : ["/gems/al-qudra-lakes.svg"];
  const current = images[idx % images.length];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link to={`/${locale}/map`} className="text-brandTeal hover:underline">
          ← {t("actions.back")}
        </Link>
        <div className="text-sm text-slate-300">
          <span className="text-slate-400">{t("labels.points")}:</span>{" "}
          <span className="font-semibold text-brandTeal">{progress.totalPoints}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5 shadow-glow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <img
              src={current}
              alt={name}
              className="w-full h-64 object-cover rounded-2xl border border-slate-800/70"
            />
            {images.length > 1 && (
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded-xl border border-slate-800/70 bg-slate-900/40 hover:bg-slate-900/60 text-sm"
                  onClick={() => setIdx((v) => (v - 1 + images.length) % images.length)}
                >
                  ◀
                </button>
                <button
                  className="px-3 py-2 rounded-xl border border-slate-800/70 bg-slate-900/40 hover:bg-slate-900/60 text-sm"
                  onClick={() => setIdx((v) => (v + 1) % images.length)}
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-2xl font-extrabold">{name}</div>
              <div className="text-slate-400">{area}</div>
            </div>

            <p className="text-slate-300">{desc}</p>

            <div className="flex flex-wrap gap-2">
              {gem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-slate-900/60 border border-slate-800/70 text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {gem.google_maps_url && (
                <a
                  className="px-4 py-2 rounded-xl text-sm border border-brandTeal/30 bg-brandTeal/15 text-brandTeal hover:bg-brandTeal/20"
                  href={gem.google_maps_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("actions.openMaps")}
                </a>
              )}

              <button
                disabled={unlocked}
                onClick={unlock}
                className={[
                  "px-4 py-2 rounded-xl text-sm font-semibold border transition",
                  unlocked
                    ? "bg-slate-900/40 text-slate-500 border-slate-800/70 cursor-not-allowed"
                    : "bg-brandOrange/20 text-brandOrange border-brandOrange/30 hover:bg-brandOrange/25"
                ].join(" ")}
              >
                {unlocked ? t("actions.unlocked") : t("actions.unlock")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

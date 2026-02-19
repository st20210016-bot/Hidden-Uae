// /src/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Gem, Locale } from "./types";
import { loadProgress, saveProgress } from "./storage";
import GemCard from "./GemCard";
import BadgeRow from "./BadgeRow";
import { computeEarnedBadges } from "./badges";

export default function HomePage({ locale }: { locale: Locale }) {
  const { t, i18n } = useTranslation();
  const [gems, setGems] = useState<Gem[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/data/gems.json");
      const data = (await res.json()) as Gem[];
      setGems(data);
      setLoading(false);
    })();
  }, []);

  const featured = useMemo(() => gems.slice(0, 6), [gems]);

  const earned = useMemo(() => computeEarnedBadges({ unlockedGemIds: progress.unlockedGemIds, allGems: gems }), [progress, gems]);

  const onUnlock = (id: string) => {
    if (progress.unlockedGemIds.includes(id)) return;
    const next = {
      ...progress,
      unlockedGemIds: [...progress.unlockedGemIds, id],
      totalPoints: progress.totalPoints + 5
    };
    next.earnedBadges = computeEarnedBadges({ unlockedGemIds: next.unlockedGemIds, allGems: gems });
    setProgress(next);
    saveProgress(next);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800/70 bg-slate-950/40 p-6 md:p-10 shadow-glow">
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {t("home.heroTitle")}
            </h1>
            <p className="text-slate-300 max-w-2xl">{t("home.heroSubtitle")}</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/${locale}/map`}
                className="px-5 py-3 rounded-2xl font-semibold bg-brandTeal/20 text-brandTeal border border-brandTeal/30 hover:bg-brandTeal/25"
              >
                {t("actions.exploreMap")}
              </Link>
              <Link
                to={`/${locale}/collection`}
                className="px-5 py-3 rounded-2xl font-semibold bg-brandOrange/20 text-brandOrange border border-brandOrange/30 hover:bg-brandOrange/25"
              >
                {t("actions.myCollection")}
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <img
              src="/logo.png"
              alt="Hidden UAE"
              className="h-28 w-28 md:h-32 md:w-32 rounded-3xl shadow-glow ring-1 ring-slate-700/60"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold">{t("labels.featured")}</h2>
            <p className="text-sm text-slate-400">{t("home.featuredHint")}</p>
          </div>
          <div className="text-sm text-slate-300">
            <span className="text-slate-400">{t("labels.points")}:</span>{" "}
            <span className="font-semibold text-brandTeal">{progress.totalPoints}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-400">{t("labels.loading")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((g) => (
              <GemCard key={g.id} locale={locale} gem={g} progress={progress} onUnlock={onUnlock} compact />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t("home.topBadges")}</h2>
        <BadgeRow earned={earned} previewCount={3} />
      </section>
    </div>
  );
}

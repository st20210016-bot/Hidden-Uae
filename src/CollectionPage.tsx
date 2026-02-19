// /src/CollectionPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Gem, Locale } from "./types";
import { loadProgress, saveProgress } from "./storage";
import GemCard from "./GemCard";
import BadgeRow from "./BadgeRow";
import ShareCard from "./ShareCard";
import { computeEarnedBadges } from "./badges";

export default function CollectionPage({ locale }: { locale: Locale }) {
  const { t, i18n } = useTranslation();
  const [gems, setGems] = useState<Gem[]>([]);
  const [progress, setProgress] = useState(loadProgress());
  const [loading, setLoading] = useState(true);

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

  const unlocked = useMemo(
    () => gems.filter((g) => progress.unlockedGemIds.includes(g.id)),
    [gems, progress.unlockedGemIds]
  );

  const earned = useMemo(
    () => computeEarnedBadges({ unlockedGemIds: progress.unlockedGemIds, allGems: gems }),
    [progress.unlockedGemIds, gems]
  );

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
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{t("collection.title")}</h1>
          <p className="text-sm text-slate-400">{t("labels.unlockedGems")}</p>
        </div>
        <div className="text-sm text-slate-300">
          <span className="text-slate-400">{t("labels.points")}:</span>{" "}
          <span className="font-semibold text-brandTeal">{progress.totalPoints}</span>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t("labels.badges")}</h2>
        <BadgeRow earned={earned} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t("labels.unlockedGems")}</h2>

        {loading ? (
          <div className="text-slate-400">{t("labels.loading")}</div>
        ) : unlocked.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6 text-slate-400">
            {t("labels.nothingUnlocked")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map((g) => (
              <GemCard key={g.id} locale={locale} gem={g} progress={progress} onUnlock={onUnlock} compact />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">{t("collection.shareTitle")}</h2>
        <p className="text-sm text-slate-400">{t("collection.shareSubtitle")}</p>
        <ShareCard unlockedCount={progress.unlockedGemIds.length} points={progress.totalPoints} />
      </section>
    </div>
  );
}

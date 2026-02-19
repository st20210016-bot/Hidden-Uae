// /src/GemCard.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Gem, Locale } from "./types";
import { ProgressState } from "./storage";
import { budgetLabel, emirateLabel } from "./gemSearch";
import { Link } from "react-router-dom";

export default function GemCard({
  locale,
  gem,
  progress,
  onUnlock,
  compact
}: {
  locale: Locale;
  gem: Gem;
  progress: ProgressState;
  onUnlock: (gemId: string) => void;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const unlocked = progress.unlockedGemIds.includes(gem.id);

  const name = locale === "ar" ? gem.name_ar : gem.name_en;
  const area = locale === "ar" ? gem.area_ar : gem.area_en;
  const desc = locale === "ar" ? gem.description_ar : gem.description_en;

  const img = gem.images?.[0] ?? "/gems/al-qudra-lakes.svg";

  const meta = useMemo(() => {
    return {
      emirate: emirateLabel(t, gem.emirate),
      budget: budgetLabel(t, gem.budget)
    };
  }, [gem.emirate, gem.budget, t]);

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/50 overflow-hidden shadow-glow">
      <div className="relative">
        <img src={img} alt={name} className="h-40 w-full object-cover" loading="lazy" />
        {gem.photogenic && (
          <div className="absolute top-3 end-3 px-3 py-1 rounded-full text-xs bg-brandTeal/20 text-brandTeal ring-1 ring-brandTeal/30">
            {t("labels.photogenic")}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-bold text-slate-100">{name}</div>
            <div className="text-sm text-slate-400">{area}</div>
          </div>
          <div className="text-xs text-slate-400 text-end">
            <div>{meta.emirate}</div>
            <div>{meta.budget}</div>
          </div>
        </div>

        {!compact && <p className="text-sm text-slate-300 line-clamp-3">{desc}</p>}

        <div className="flex flex-wrap gap-2">
          {gem.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-slate-900/60 border border-slate-800/70 text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <Link
              to={`/${locale}/gem/${gem.id}`}
              className="text-sm text-slate-200 hover:underline"
            >
              {t("actions.viewDetails")}
            </Link>

            {gem.google_maps_url ? (
              <a
                href={gem.google_maps_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-brandTeal hover:underline"
              >
                {t("actions.openMaps")}
              </a>
            ) : (
              <span className="text-sm text-slate-500">{t("labels.noMaps")}</span>
            )}
          </div>

          <button
            disabled={unlocked}
            onClick={() => onUnlock(gem.id)}
            className={[
              "px-4 py-2 rounded-xl text-sm font-semibold transition border",
              unlocked
                ? "bg-slate-900/40 text-slate-400 border-slate-800/70 cursor-not-allowed"
                : "bg-brandOrange/20 text-brandOrange border-brandOrange/30 hover:bg-brandOrange/25"
            ].join(" ")}
          >
            {unlocked ? t("actions.unlocked") : t("actions.unlock")}
          </button>
        </div>
      </div>
    </div>
  );
}

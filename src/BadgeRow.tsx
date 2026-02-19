// /src/BadgeRow.tsx
import { useTranslation } from "react-i18next";
import { BADGES } from "./badges";
import type { BadgeKey } from "./types";

export default function BadgeRow({
  earned,
  previewCount
}: {
  earned: BadgeKey[];
  previewCount?: number;
}) {
  const { t } = useTranslation();
  const list = previewCount ? BADGES.slice(0, previewCount) : BADGES;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {list.map((b) => {
        const has = earned.includes(b.key);
        return (
          <div
            key={b.key}
            className={[
              "rounded-2xl border p-4 shadow-glow",
              has
                ? "bg-brandTeal/10 border-brandTeal/30"
                : "bg-slate-950/40 border-slate-800/70"
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{b.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-100 flex items-center gap-2">
                  {t(b.titleKey)} {has && <span className="text-brandTeal">✓</span>}
                </div>
                <div className="text-sm text-slate-400">{t(b.descKey)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

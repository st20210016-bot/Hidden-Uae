// /src/FilterBar.tsx
import { useTranslation } from "react-i18next";
import { Budget, EMIRATES, Emirate } from "./types";

export type Filters = {
  emirate: Emirate | "all";
  budget: Budget | "all";
  photogenicOnly: boolean;
  search: string;
};

export default function FilterBar({
  filters,
  onChange
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4 shadow-glow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("labels.emirate")}</label>
          <select
            className="w-full rounded-xl bg-slate-900/50 border border-slate-800/70 px-3 py-2 text-sm"
            value={filters.emirate}
            onChange={(e) => onChange({ ...filters, emirate: e.target.value as any })}
          >
            <option value="all">{t("labels.filters")} — {t("labels.emirate")}</option>
            {EMIRATES.map((em) => (
              <option key={em} value={em}>
                {t(`emirates.${em}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("labels.budget")}</label>
          <select
            className="w-full rounded-xl bg-slate-900/50 border border-slate-800/70 px-3 py-2 text-sm"
            value={filters.budget}
            onChange={(e) => onChange({ ...filters, budget: e.target.value as any })}
          >
            <option value="all">{t("labels.filters")} — {t("labels.budget")}</option>
            <option value="free">{t("budgets.free")}</option>
            <option value="low">{t("budgets.low")}</option>
            <option value="mid">{t("budgets.mid")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("labels.search")}</label>
          <input
            className="w-full rounded-xl bg-slate-900/50 border border-slate-800/70 px-3 py-2 text-sm"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder={t("labels.search")}
          />
        </div>

        <div className="flex items-end">
          <label className="w-full flex items-center justify-between gap-3 rounded-xl bg-slate-900/30 border border-slate-800/70 px-3 py-2">
            <span className="text-sm text-slate-200">{t("labels.photogenicOnly")}</span>
            <input
              type="checkbox"
              checked={filters.photogenicOnly}
              onChange={(e) => onChange({ ...filters, photogenicOnly: e.target.checked })}
              className="h-5 w-5 accent-brandTeal"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

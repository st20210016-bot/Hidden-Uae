// /src/SubmitPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "./types";
import { addSubmission } from "./storage";
import { EMIRATES } from "./types";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function SubmitPage({ locale }: { locale: Locale }) {
  const { t, i18n } = useTranslation();

  const [name, setName] = useState("");
  const [emirate, setEmirate] = useState(EMIRATES[0]);
  const [mapsLink, setMapsLink] = useState("");
  const [why, setWhy] = useState("");
  const [photogenic, setPhotogenic] = useState(false);
  const [budget, setBudget] = useState<"free" | "low" | "mid">("free");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale, i18n]);

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && why.trim().length >= 6;
  }, [name, why]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    addSubmission({
      id: uid(),
      name: name.trim(),
      emirate,
      mapsLink: mapsLink.trim(),
      why: why.trim(),
      photogenic,
      budget,
      createdAt: Date.now()
    });

    setName("");
    setMapsLink("");
    setWhy("");
    setPhotogenic(false);
    setBudget("free");

    setToast(t("submit.success"));
    window.setTimeout(() => setToast(null), 2400);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">{t("submit.title")}</h1>
        <p className="text-sm text-slate-400">{t("submit.subtitle")}</p>
      </div>

      {toast && (
        <div className="rounded-2xl border border-brandTeal/30 bg-brandTeal/10 text-brandTeal px-4 py-3 shadow-glow">
          {toast}
        </div>
      )}

      <form onSubmit={submit} className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5 shadow-glow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("submit.name")}</label>
            <input
              className="w-full rounded-xl bg-slate-900/50 border border-slate-800/70 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("submit.emirate")}</label>
            <select
              className="w-full rounded-xl bg-slate-900/50 border border-slate-800/70 px-3 py-2 text-sm"
              value={emirate}
              onChange={(e) => setEmirate(e.target.value)}
            >
              {EMIRATES.map((em) => (
                <option key={em} value={em}>
                  {t(`emirates.${em}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("submit.maps")}</label>
          <input
            className="w-full rounded-xl bg-slate-900/50 border border-slate-800/70 px-3 py-2 text-sm"
            value={mapsLink}
            onChange={(e) => setMapsLink(e.target.value)}
            placeholder="https://maps.google.com/?q=..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("submit.budget")}</label>
            <select
              className="w-full rounded-xl bg-slate-900/50 border border-slate-800/70 px-3 py-2 text-sm"
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
            >
              <option value="free">{t("budgets.free")}</option>
              <option value="low">{t("budgets.low")}</option>
              <option value="mid">{t("budgets.mid")}</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <label className="w-full flex items-center justify-between gap-3 rounded-xl bg-slate-900/30 border border-slate-800/70 px-3 py-2">
              <span className="text-sm text-slate-200">{t("submit.photogenic")}</span>
              <input
                type="checkbox"
                checked={photogenic}
                onChange={(e) => setPhotogenic(e.target.checked)}
                className="h-5 w-5 accent-brandTeal"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("submit.why")}</label>
          <textarea
            className="w-full min-h-[120px] rounded-xl bg-slate-900/50 border border-slate-800/70 px-3 py-2 text-sm"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={[
            "px-5 py-3 rounded-2xl font-semibold border transition",
            canSubmit
              ? "bg-brandOrange/20 text-brandOrange border-brandOrange/30 hover:bg-brandOrange/25"
              : "bg-slate-900/40 text-slate-500 border-slate-800/70 cursor-not-allowed"
          ].join(" ")}
        >
          {t("submit.send")}
        </button>
      </form>
    </div>
  );
}

// /src/SubmitPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Budget, Emirate, Submission } from "./types";
import { getSubmissions, saveSubmissions } from "./storage";
import { applyLocaleToDocument } from "./rtl";

const EMIRATES: Emirate[] = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Fujairah",
  "Ras Al Khaimah",
  "Umm Al Quwain"
];

const BUDGETS: Budget[] = ["free", "low", "mid"];

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function SubmitPage() {
  const { locale } = useParams();
  const nav = useNavigate();
  const { t, i18n } = useTranslation();

  // Ensure correct dir/lang on page load
  useEffect(() => {
    const loc = locale === "ar" ? "ar" : "en";
    if (i18n.language !== loc) i18n.changeLanguage(loc);
    applyLocaleToDocument(loc);
  }, [locale, i18n]);

  const isAr = (locale ?? "en") === "ar";

  const [name, setName] = useState("");
  const [emirate, setEmirate] = useState<Emirate>("Dubai");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [why, setWhy] = useState("");
  const [photogenic, setPhotogenic] = useState(true);
  const [budget, setBudget] = useState<Budget>("free");

  const [toast, setToast] = useState<{ show: boolean; msg: string }>({
    show: false,
    msg: ""
  });

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && why.trim().length >= 10;
  }, [name, why]);

  function showToast(msg: string) {
    setToast({ show: true, msg });
    window.setTimeout(() => setToast({ show: false, msg: "" }), 2200);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      showToast(t("submit.validation"));
      return;
    }

    const submission: Submission = {
      id: uid(),
      name: name.trim(),
      emirate,
      googleMapsUrl: googleMapsUrl.trim(),
      why: why.trim(),
      photogenic,
      budget,
      createdAt: new Date().toISOString()
    };

    const prev = getSubmissions();
    const next = [submission, ...prev];
    saveSubmissions(next);

    showToast(t("submit.success"));

    // Reset
    setName("");
    setEmirate("Dubai");
    setGoogleMapsUrl("");
    setWhy("");
    setPhotogenic(true);
    setBudget("free");

    // Optional: navigate back after a moment
    window.setTimeout(() => nav(`/${locale ?? "en"}`), 800);
  }

  return (
    <div className="min-h-[calc(100vh-140px)] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {t("submit.title")}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {t("submit.subtitle")}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(45,212,191,0.10)]"
        >
          <div className="grid gap-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm text-slate-200">
                {t("submit.fields.name")}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-teal-400/50"
                placeholder={t("submit.placeholders.name")}
              />
            </div>

            {/* Emirate */}
            <div>
              <label className="mb-1 block text-sm text-slate-200">
                {t("submit.fields.emirate")}
              </label>
              <select
                value={emirate}
                onChange={(e) => setEmirate(e.target.value as Emirate)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-teal-400/50"
              >
                {EMIRATES.map((em) => (
                  <option key={em} value={em}>
                    {em}
                  </option>
                ))}
              </select>
            </div>

            {/* Google Maps */}
            <div>
              <label className="mb-1 block text-sm text-slate-200">
                {t("submit.fields.maps")}
              </label>
              <input
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-teal-400/50"
                placeholder={t("submit.placeholders.maps")}
              />
              <p className="mt-1 text-xs text-slate-400">
                {t("submit.hints.maps")}
              </p>
            </div>

            {/* Why */}
            <div>
              <label className="mb-1 block text-sm text-slate-200">
                {t("submit.fields.why")}
              </label>
              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-teal-400/50"
                placeholder={t("submit.placeholders.why")}
              />
              <p className="mt-1 text-xs text-slate-400">
                {t("submit.hints.why")}
              </p>
            </div>

            {/* Budget + Photogenic */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-200">
                  {t("submit.fields.budget")}
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as Budget)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-teal-400/50"
                >
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>
                      {t(`budget.${b}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <div>
                  <div className="text-sm text-slate-200">
                    {t("submit.fields.photogenic")}
                  </div>
                  <div className="text-xs text-slate-400">
                    {t("submit.hints.photogenic")}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPhotogenic((v) => !v)}
                  className={[
                    "relative h-10 w-16 rounded-full border border-white/10 transition",
                    photogenic
                      ? "bg-teal-500/30 shadow-[0_0_20px_rgba(45,212,191,0.25)]"
                      : "bg-white/5"
                  ].join(" ")}
                  aria-pressed={photogenic}
                >
                  <span
                    className={[
                      "absolute top-1 h-8 w-8 rounded-full bg-white transition-transform",
                      photogenic ? (isAr ? "right-1" : "left-7") : (isAr ? "right-7" : "left-1")
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-400">
                {t("submit.note")}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={[
                  "rounded-xl px-5 py-3 font-medium transition",
                  canSubmit
                    ? "bg-teal-500/20 text-white shadow-[0_0_25px_rgba(45,212,191,0.25)] hover:bg-teal-500/30"
                    : "cursor-not-allowed bg-white/5 text-slate-400"
                ].join(" ")}
              >
                {t("submit.cta")}
              </button>
            </div>
          </div>
        </form>

        {/* Toast */}
        {toast.show && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
            <div className="rounded-xl border border-white/10 bg-black/70 px-4 py-3 text-sm text-white shadow-lg">
              {toast.msg}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

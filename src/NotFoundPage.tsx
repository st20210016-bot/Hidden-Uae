// /src/NotFoundPage.tsx
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Locale } from "./types";
import { isLocale } from "./types";

export default function NotFoundPage() {
  const { locale } = useParams();
  const loc: Locale = isLocale(locale) ? locale : "en";
  const { t } = useTranslation();

  return (
    <div className="px-4 py-14">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="text-4xl">🧭</div>
        <h1 className="mt-3 text-2xl font-semibold text-white">
          {t("notFound.title")}
        </h1>
        <p className="mt-2 text-slate-300">{t("notFound.body")}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to={`/${loc}`}
            className="rounded-xl bg-teal-500/20 px-5 py-3 font-medium text-white hover:bg-teal-500/30"
          >
            {t("common.home")}
          </Link>
          <Link
            to={`/${loc}/map`}
            className="rounded-xl bg-white/10 px-5 py-3 font-medium text-white hover:bg-white/15"
          >
            {t("home.cta.map")}
          </Link>
        </div>
      </div>
    </div>
  );
}

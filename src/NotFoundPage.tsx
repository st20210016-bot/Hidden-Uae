// /src/NotFoundPage.tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Locale } from "./types";

export default function NotFoundPage({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-6 shadow-glow">
      <div className="text-lg font-semibold">{t("errors.notFound")}</div>
      <Link to={`/${locale}`} className="text-brandTeal hover:underline">
        {t("actions.back")}
      </Link>
    </div>
  );
}

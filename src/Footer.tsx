// /src/Footer.tsx
import { useTranslation } from "react-i18next";
import { Locale } from "./types";

export default function Footer({ locale }: { locale: Locale }) {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-800/70 bg-slate-950/40">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-400 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div>
          <span className="text-slate-200 font-semibold">Hidden UAE</span>{" "}
          <span className="text-slate-500">•</span> {t("footer.madeForFun")}
        </div>
        <div className="flex gap-4">
          <a className="hover:text-slate-200" href={`/${locale}/map`}>{t("nav.map")}</a>
          <a className="hover:text-slate-200" href={`/${locale}/collection`}>{t("nav.collection")}</a>
        </div>
      </div>
    </footer>
  );
}

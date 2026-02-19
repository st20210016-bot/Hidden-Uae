// /src/Navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Locale } from "./types";
import { setPreferredLocale } from "./storage";

function swapLocaleInPath(pathname: string, next: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${next}`;
  parts[0] = next;
  return "/" + parts.join("/");
}

export default function Navbar({ locale }: { locale: Locale }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const onSwitch = (next: Locale) => {
    setPreferredLocale(next);
    void i18n.changeLanguage(next);
    navigate(swapLocaleInPath(location.pathname, next));
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to={`/${locale}`} className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Hidden UAE"
            className="h-9 w-9 rounded-xl shadow-glow ring-1 ring-slate-700/60"
          />
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-lg">Hidden UAE</div>
            <div className="text-xs text-slate-400">{t("tagline")}</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to={`/${locale}/map`} className="px-3 py-2 rounded-xl text-sm hover:bg-slate-800/40">
            {t("nav.map")}
          </Link>
          <Link to={`/${locale}/collection`} className="px-3 py-2 rounded-xl text-sm hover:bg-slate-800/40">
            {t("nav.collection")}
          </Link>
          <Link to={`/${locale}/submit`} className="px-3 py-2 rounded-xl text-sm hover:bg-slate-800/40">
            {t("nav.submit")}
          </Link>

          <div className="ml-2 flex items-center rounded-xl border border-slate-800/70 bg-slate-900/30 p-1">
            <button
              onClick={() => onSwitch("en")}
              className={[
                "px-3 py-1.5 text-sm rounded-lg transition",
                locale === "en"
                  ? "bg-brandTeal/20 text-brandTeal ring-1 ring-brandTeal/30"
                  : "text-slate-300 hover:bg-slate-800/40"
              ].join(" ")}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <button
              onClick={() => onSwitch("ar")}
              className={[
                "px-3 py-1.5 text-sm rounded-lg transition",
                locale === "ar"
                  ? "bg-brandOrange/20 text-brandOrange ring-1 ring-brandOrange/30"
                  : "text-slate-300 hover:bg-slate-800/40"
              ].join(" ")}
              aria-pressed={locale === "ar"}
            >
              AR
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

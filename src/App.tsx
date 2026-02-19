// /src/App.tsx
import { useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { isLocale, type Locale } from "./types";
import { setPreferredLocale } from "./storage";
import { applyLocaleToDocument } from "./rtl";

import HomePage from "./HomePage";
import MapPage from "./MapPage";
import CollectionPage from "./CollectionPage";
import SubmitPage from "./SubmitPage";
import GemDetailPage from "./GemDetailPage";
import NotFoundPage from "./NotFoundPage";

function LocaleShell({ children }: { children: React.ReactNode }) {
  const { locale } = useParams();
  const { i18n } = useTranslation();

  const loc: Locale = isLocale(locale) ? locale : "en";

  if (!isLocale(locale)) return <Navigate to="/en" replace />;

  useEffect(() => {
    if (i18n.language !== loc) i18n.changeLanguage(loc);
    setPreferredLocale(loc);
    applyLocaleToDocument(loc);
  }, [loc, i18n]);

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/en" replace />} />

      <Route
        path="/:locale"
        element={
          <LocaleShell>
            <HomePage />
          </LocaleShell>
        }
      />
      <Route
        path="/:locale/map"
        element={
          <LocaleShell>
            <MapPage />
          </LocaleShell>
        }
      />
      <Route
        path="/:locale/collection"
        element={
          <LocaleShell>
            <CollectionPage />
          </LocaleShell>
        }
      />
      <Route
        path="/:locale/submit"
        element={
          <LocaleShell>
            <SubmitPage />
          </LocaleShell>
        }
      />
      <Route
        path="/:locale/gem/:id"
        element={
          <LocaleShell>
            <GemDetailPage />
          </LocaleShell>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

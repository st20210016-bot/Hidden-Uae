// /src/App.tsx
import { useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { isLocale, type Locale } from "./types";
import { setPreferredLocale } from "./storage";
import { applyLocaleToDocument } from "./rtl";

// Pages (adjust imports to your exact filenames)
import HomePage from "./HomePage";
import MapPage from "./MapPage";
import CollectionPage from "./CollectionPage";
import SubmitPage from "./SubmitPage";
import GemDetailPage from "./GemDetailPage";
import NotFoundPage from "./NotFoundPage";

function LocaleGuard({ children }: { children: React.ReactNode }) {
  const { locale } = useParams();
  const { i18n } = useTranslation();

  const loc: Locale = isLocale(locale) ? locale : "en";

  // Redirect invalid locale to /en
  if (!isLocale(locale)) {
    return <Navigate to="/en" replace />;
  }

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
      {/* default route */}
      <Route path="/" element={<Navigate to="/en" replace />} />

      {/* locale routes */}
      <Route
        path="/:locale"
        element={
          <LocaleGuard>
            <HomePage />
          </LocaleGuard>
        }
      />
      <Route
        path="/:locale/map"
        element={
          <LocaleGuard>
            <MapPage />
          </LocaleGuard>
        }
      />
      <Route
        path="/:locale/collection"
        element={
          <LocaleGuard>
            <CollectionPage />
          </LocaleGuard>
        }
      />
      <Route
        path="/:locale/submit"
        element={
          <LocaleGuard>
            <SubmitPage />
          </LocaleGuard>
        }
      />
      <Route
        path="/:locale/gem/:id"
        element={
          <LocaleGuard>
            <GemDetailPage />
          </LocaleGuard>
        }
      />

      {/* fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// /src/App.tsx
import { useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Locale } from "./types";
import { isLocale } from "./types";
import { setPreferredLocale } from "./storage";
import { applyLocaleToDocument } from "./rtl";

// Pages (keep your current filenames)
import HomePage from "./HomePage";
import MapPage from "./MapPage";
import CollectionPage from "./CollectionPage";
import SubmitPage from "./SubmitPage";
import GemDetailPage from "./GemDetailPage";
import NotFoundPage from "./NotFoundPage";

/**
 * This wrapper:
 * - validates locale
 * - applies RTL/lang + saves preference
 * - passes locale prop into the real page component
 */
function LocalePage({
  component: Component
}: {
  component: React.ComponentType<{ locale: Locale }>;
}) {
  const { locale } = useParams();
  const { i18n } = useTranslation();

  const loc: Locale = isLocale(locale) ? locale : "en";

  // Redirect invalid locale to /en
  if (!isLocale(locale)) return <Navigate to="/en" replace />;

  useEffect(() => {
    if (i18n.language !== loc) i18n.changeLanguage(loc);
    setPreferredLocale(loc);
    applyLocaleToDocument(loc);
  }, [loc, i18n]);

  return <Component locale={loc} />;
}

export default function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/en" replace />} />

      {/* Locale routes */}
      <Route path="/:locale" element={<LocalePage component={HomePage} />} />
      <Route path="/:locale/map" element={<LocalePage component={MapPage} />} />
      <Route path="/:locale/collection" element={<LocalePage component={CollectionPage} />} />
      <Route path="/:locale/submit" element={<LocalePage component={SubmitPage} />} />
      <Route path="/:locale/gem/:id" element={<LocalePage component={GemDetailPage} />} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

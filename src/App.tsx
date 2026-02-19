// /src/App.tsx
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import SparkleBg from "./SparkleBg";

import HomePage from "./HomePage";
import MapPage from "./MapPage";
import CollectionPage from "./CollectionPage";
import SubmitPage from "./SubmitPage";
import GemDetailPage from "./GemDetailPage";
import NotFoundPage from "./NotFoundPage";

import { Locale, isLocale } from "./types";
import { applyLocaleToDocument } from "./rtl";

function LocaleLayout({ locale }: { locale: Locale }) {
  applyLocaleToDocument(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <SparkleBg />
      <Navbar locale={locale} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Routes>
            <Route index element={<HomePage locale={locale} />} />
            <Route path="map" element={<MapPage locale={locale} />} />
            <Route path="collection" element={<CollectionPage locale={locale} />} />
            <Route path="submit" element={<SubmitPage locale={locale} />} />
            <Route path="gem/:id" element={<GemDetailPage locale={locale} />} />
            <Route path="*" element={<NotFoundPage locale={locale} />} />
          </Routes>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/en" replace />} />
      <Route path="/:locale/*" element={<LocaleWrapper />} />
      <Route path="*" element={<Navigate to="/en" replace />} />
    </Routes>
  );
}

function LocaleWrapper() {
  const params = useParams();
  const locale = params.locale ?? "en";
  const safe: Locale = isLocale(locale) ? locale : "en";
  return <LocaleLayout locale={safe} />;
}

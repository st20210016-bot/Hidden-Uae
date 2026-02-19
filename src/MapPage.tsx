// /src/MapPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { Map as MLMap, Marker } from "maplibre-gl";
import { useTranslation } from "react-i18next";

import type { Gem, Locale } from "./types";
import { loadProgress, saveProgress } from "./storage";
import FilterBar, { Filters } from "./FilterBar";
import { matchesFilters } from "./gemSearch";
import { computeEarnedBadges } from "./badges";

export default function MapPage({ locale }: { locale: Locale }) {
  const { t, i18n } = useTranslation();

  const mapRef = useRef<MLMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Marker[]>([]);

  const [gems, setGems] = useState<Gem[]>([]);
  const [progress, setProgress] = useState(loadProgress());
  const [selected, setSelected] = useState<Gem | null>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    emirate: "all",
    budget: "all",
    photogenicOnly: false,
    search: ""
  });

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/data/gems.json");
      const data = (await res.json()) as Gem[];
      setGems(data);
      setLoading(false);
    })();
  }, []);

  // init map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [55.2708, 25.2048], // Dubai-ish
      zoom: 8.2,
      minZoom: 6,
      maxZoom: 14
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const filteredGems = useMemo(
    () => gems.filter((g) => matchesFilters(g, filters, locale)),
    [gems, filters, locale]
  );

  // refresh markers whenever filtered list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // cleanup old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    for (const gem of filteredGems) {
      const el = document.createElement("button");
      el.type = "button";
      el.className =
        "h-3.5 w-3.5 rounded-full shadow-glow border border-slate-200/20 " +
        (progress.unlockedGemIds.includes(gem.id) ? "bg-brandTeal" : "bg-brandOrange");

      el.title = locale === "ar" ? gem.name_ar : gem.name_en;

      el.addEventListener("click", () => setSelected(gem));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([gem.coords.lng, gem.coords.lat])
        .addTo(map);

      markersRef.current.push(marker);
    }
  }, [filteredGems, progress.unlockedGemIds, locale]);

  const unlock = (id: string) => {
    if (progress.unlockedGemIds.includes(id)) return;

    const next = {
      ...progress,
      unlockedGemIds: [...progress.unlockedGemIds, id],
      totalPoints: progress.totalPoints + 5
    };
    next.earnedBadges = computeEarnedBadges({ unlockedGemIds: next.unlockedGemIds, allGems: gems });
    setProgress(next);
    saveProgress(next);
  };

  const selectedUnlocked = selected ? progress.unlockedGemIds.includes(selected.id) : false;
  const selectedName = selected ? (locale === "ar" ? selected.name_ar : selected.name_en) : "";
  const selectedArea = selected ? (locale === "ar" ? selected.area_ar : selected.area_en) : "";
  const selectedDesc = selected ? (locale === "ar" ? selected.description_ar : selected.description_en) : "";

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{t("map.title")}</h1>
          <p className="text-sm text-slate-400">{t("map.hint")}</p>
        </div>
        <div className="text-sm text-slate-300">
          <span className="text-slate-400">{t("labels.points")}:</span>{" "}
          <span className="font-semibold text-brandTeal">{progress.totalPoints}</span>
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/70 bg-slate-950/40 overflow-hidden shadow-glow">
          <div ref={mapContainerRef} className="h-[520px] w-full" />
        </div>

        <aside className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4 shadow-glow">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-slate-200 font-semibold">{t("map.panelTitle")}</div>
              <div className="text-xs text-slate-500">{loading ? t("labels.loading") : `${filteredGems.length} gems`}</div>
            </div>
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-800/70 bg-slate-900/40 hover:bg-slate-900/60"
              >
                ✕
              </button>
            )}
          </div>

          {!selected ? (
            <div className="mt-4 text-sm text-slate-400">
              {t("map.hint")}
              <div className="mt-3 text-xs text-slate-500">
                Tip: Use search + filters to find your next unlock.
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <img
                src={selected.images?.[0] ?? "/gems/al-qudra-lakes.svg"}
                className="w-full h-36 object-cover rounded-xl border border-slate-800/70"
                alt={selectedName}
              />
              <div>
                <div className="font-bold text-slate-100">{selectedName}</div>
                <div className="text-sm text-slate-400">{selectedArea}</div>
              </div>
              <p className="text-sm text-slate-300">{selectedDesc}</p>

              <div className="flex flex-wrap gap-2">
                {selected.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-slate-900/60 border border-slate-800/70 text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                {selected.google_maps_url ? (
                  <a
                    className="text-sm text-brandTeal hover:underline"
                    href={selected.google_maps_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("actions.openMaps")}
                  </a>
                ) : (
                  <span className="text-sm text-slate-500">{t("labels.noMaps")}</span>
                )}

                <button
                  disabled={selectedUnlocked}
                  onClick={() => unlock(selected.id)}
                  className={[
                    "px-4 py-2 rounded-xl text-sm font-semibold transition border",
                    selectedUnlocked
                      ? "bg-slate-900/40 text-slate-400 border-slate-800/70 cursor-not-allowed"
                      : "bg-brandOrange/20 text-brandOrange border-brandOrange/30 hover:bg-brandOrange/25"
                  ].join(" ")}
                >
                  {selectedUnlocked ? t("actions.unlocked") : t("actions.unlock")}
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

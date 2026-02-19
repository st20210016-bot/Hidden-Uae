// /src/MapPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Gem, Locale, ProgressState } from "./types";
import { EMIRATES, isLocale } from "./types";
import { loadProgress, saveProgress } from "./storage";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export default function MapPage() {
  const { locale } = useParams();
  const loc: Locale = isLocale(locale) ? locale : "en";
  const { t } = useTranslation();

  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [gems, setGems] = useState<Gem[]>([]);
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [active, setActive] = useState<Gem | null>(null);

  // filters
  const [emirate, setEmirate] = useState<string>("all");
  const [budget, setBudget] = useState<string>("all");
  const [photogenic, setPhotogenic] = useState<boolean>(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/data/gems.json")
      .then((r) => r.json())
      .then((d) => setGems(Array.isArray(d) ? (d as Gem[]) : []))
      .catch(() => setGems([]));
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return gems.filter((g) => {
      if (emirate !== "all" && g.emirate !== emirate) return false;
      if (budget !== "all" && g.budget !== budget) return false;
      if (photogenic && !g.photogenic) return false;
      if (query) {
        const hay = `${g.name_en} ${g.name_ar} ${g.area_en} ${g.area_ar} ${g.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [gems, emirate, budget, photogenic, q]);

  // init map once
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [55.27, 25.2], // Dubai-ish
      zoom: 8,
      minZoom: 6,
      maxZoom: 15
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // update markers whenever filtered list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // clear old markers
    // we store markers on window for simplicity
    const w = window as any;
    if (w.__markers) {
      for (const m of w.__markers) m.remove();
    }
    w.__markers = [];

    for (const g of filtered) {
      const el = document.createElement("button");
      el.className =
        "h-9 w-9 rounded-full border border-white/20 bg-black/60 text-white shadow-[0_0_18px_rgba(45,212,191,0.20)] hover:bg-black/80";
      el.textContent = "✦";
      el.onclick = () => setActive(g);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([g.coords.lng, g.coords.lat])
        .addTo(map);

      w.__markers.push(marker);
    }
  }, [filtered]);

  function unlock(gem: Gem) {
    if (progress.unlockedGemIds.includes(gem.id)) return;
    const next = {
      ...progress,
      unlockedGemIds: [gem.id, ...progress.unlockedGemIds],
      totalPoints: progress.totalPoints + 5,
      points: progress.totalPoints + 5
    };
    setProgress(next);
  }

  const unlocked = active ? progress.unlockedGemIds.includes(active.id) : false;

  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">{t("map.title")}</h1>
            <div className="text-sm text-slate-300">
              {t("map.points")}: <span className="font-semibold text-white">{progress.totalPoints}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={`/${loc}/collection`} className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15">
              {t("map.myCollection")}
            </Link>
            <Link to={`/${loc}`} className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15">
              {t("common.home")}
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white outline-none focus:border-teal-400/50"
            placeholder={t("map.search")}
          />

          <select
            value={emirate}
            onChange={(e) => setEmirate(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white outline-none"
          >
            <option value="all">{t("map.filters.allEmirates")}</option>
            {EMIRATES.map((em) => (
              <option key={em} value={em}>
                {em}
              </option>
            ))}
          </select>

          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white outline-none"
          >
            <option value="all">{t("map.filters.allBudgets")}</option>
            <option value="free">{t("budget.free")}</option>
            <option value="low">{t("budget.low")}</option>
            <option value="mid">{t("budget.mid")}</option>
          </select>

          <button
            type="button"
            onClick={() => setPhotogenic((v) => !v)}
            className={`rounded-xl border border-white/10 px-4 py-2 text-white ${
              photogenic ? "bg-teal-500/20" : "bg-black/30"
            }`}
          >
            {t("map.filters.photogenic")} {photogenic ? "✓" : ""}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div ref={containerRef} className="h-[70vh] w-full" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            {!active ? (
              <div className="text-slate-300">{t("map.pick")}</div>
            ) : (
              <div>
                <div className="text-lg font-semibold text-white">
                  {loc === "ar" ? active.name_ar : active.name_en}
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  {loc === "ar" ? active.area_ar : active.area_en} • {active.emirate}
                </div>

                <img
                  src={active.images?.[0] ?? "/gems/dubai-skyline.svg"}
                  alt=""
                  className="mt-3 h-40 w-full rounded-xl border border-white/10 object-cover"
                />

                <p className="mt-3 text-sm text-slate-200">
                  {loc === "ar" ? active.description_ar : active.description_en}
                </p>

                {active.google_maps_url && (
                  <a
                    href={active.google_maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm text-teal-300 hover:text-teal-200"
                  >
                    {t("common.openMaps")} →
                  </a>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={unlocked}
                    onClick={() => unlock(active)}
                    className={`flex-1 rounded-xl px-4 py-2 font-medium text-white ${
                      unlocked ? "bg-white/10 text-slate-400" : "bg-teal-500/20 hover:bg-teal-500/30"
                    }`}
                  >
                    {unlocked ? t("map.unlocked") : t("map.unlock")}
                  </button>

                  <Link
                    to={`/${loc}/gem/${active.id}`}
                    className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/15"
                  >
                    {t("common.details")}
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-4 border-t border-white/10 pt-4 text-xs text-slate-400">
              {t("map.count")} {filtered.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

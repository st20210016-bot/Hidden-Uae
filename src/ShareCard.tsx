// /src/ShareCard.tsx
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ShareCard({
  unlockedCount,
  points
}: {
  unlockedCount: number;
  points: number;
}) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  const draw = async () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const w = c.width;
    const h = c.height;

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#071021");
    grad.addColorStop(1, "#1a0922");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Glow blobs
    const blob = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };
    blob(w * 0.25, h * 0.25, 320, "rgba(45,212,191,0.25)");
    blob(w * 0.8, h * 0.35, 360, "rgba(251,146,60,0.22)");

    // Text
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 44px ui-sans-serif, system-ui";
    ctx.fillText("Hidden UAE", 40, 80);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px ui-sans-serif, system-ui";
    ctx.fillText(`I unlocked ${unlockedCount} gems`, 40, 130);

    ctx.fillStyle = "#2dd4bf";
    ctx.font = "bold 34px ui-sans-serif, system-ui";
    ctx.fillText(`${points} points`, 40, 180);

    // Small “badge dots”
    ctx.fillStyle = "rgba(251,146,60,0.9)";
    for (let i = 0; i < 12; i++) {
      const x = 50 + i * 60;
      const y = 240 + (i % 2) * 20;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    setReady(true);
  };

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    const url = c.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "hidden-uae-share.png";
    a.click();
  };

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4 shadow-glow space-y-3">
      <canvas ref={canvasRef} width={900} height={500} className="w-full rounded-xl border border-slate-800/70" />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={draw}
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-brandTeal/30 bg-brandTeal/20 text-brandTeal hover:bg-brandTeal/25"
        >
          Render
        </button>
        <button
          onClick={download}
          disabled={!ready}
          className={[
            "px-4 py-2 rounded-xl text-sm font-semibold border",
            ready
              ? "border-brandOrange/30 bg-brandOrange/20 text-brandOrange hover:bg-brandOrange/25"
              : "border-slate-800/70 bg-slate-900/40 text-slate-500 cursor-not-allowed"
          ].join(" ")}
        >
          {t("actions.downloadCard")}
        </button>
      </div>
    </div>
  );
}

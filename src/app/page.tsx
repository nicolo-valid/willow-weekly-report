"use client";
import { useState } from "react";

const channels = [
  { name: "Meta — App (Weblink)", spend: 4329, spendChg: 36.3, downloads: 660, dlChg: 38.4, cpi: 6.56, cpiChg: -1.5, onboardings: 217, onbChg: 42.8, cpo: 19.95, cpoChg: -4.5, signal: "positive" as const },
  { name: "Meta — MAC (Desktop)", spend: 582, spendChg: 0.5, downloads: 88, dlChg: -12.0, cpi: 6.62, cpiChg: 14.1, onboardings: null, onbChg: null, cpo: null, cpoChg: null, signal: "warning" as const },
  { name: "ASA — Brand", spend: 95.65, spendChg: -5.5, downloads: 38, dlChg: -37.7, cpi: 2.52, cpiChg: 51.8, onboardings: 30, onbChg: -21.1, cpo: 3.19, cpoChg: 19.5, signal: "warning" as const },
  { name: "ASA — Generic", spend: 125.50, spendChg: -57.6, downloads: 4, dlChg: -71.4, cpi: 31.38, cpiChg: 48.3, onboardings: null, onbChg: null, cpo: null, cpoChg: null, signal: "negative" as const },
  { name: "ASA — Competitors", spend: 88.23, spendChg: -46.9, downloads: 4, dlChg: -42.9, cpi: 22.06, cpiChg: -7.0, onboardings: null, onbChg: null, cpo: null, cpoChg: null, signal: "negative" as const },
  { name: "Google Ads", spend: 4796, spendChg: -21.0, downloads: 812, dlChg: -14.0, cpi: 5.91, cpiChg: -8.0, onboardings: null, onbChg: null, cpo: null, cpoChg: null, signal: "neutral" as const },
  { name: "Microsoft Ads", spend: 648, spendChg: 887.0, downloads: 93, dlChg: 933.0, cpi: 6.97, cpiChg: -4.0, onboardings: null, onbChg: null, cpo: null, cpoChg: null, signal: "positive" as const },
];

const totals = {
  spend: channels.reduce((s, c) => s + c.spend, 0),
  downloads: channels.reduce((s, c) => s + c.downloads, 0),
  onboardings: channels.filter(c => c.onboardings).reduce((s, c) => s + (c.onboardings ?? 0), 0),
  cpi: 0,
  cpo: 0,
};
totals.cpi = totals.spend / totals.downloads;
totals.cpo = totals.spend / totals.onboardings;

const fmt = (v: number | null, prefix = "") =>
  v != null ? `${prefix}${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—";
const fmtInt = (v: number | null) => (v != null ? v.toLocaleString("en-US") : "—");

const Badge = ({ value, invert = false }: { value: number | null; invert?: boolean }) => {
  if (value == null) return <span className="text-gray-400">—</span>;
  const isGood = invert ? value < 0 : value > 0;
  const color = isGood ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {value > 0 ? "↑" : "↓"} {Math.abs(value).toFixed(1)}%
    </span>
  );
};

const SignalDot = ({ signal }: { signal: "positive" | "warning" | "negative" | "neutral" }) => {
  const colors = { positive: "bg-emerald-500", warning: "bg-amber-400", negative: "bg-red-500", neutral: "bg-blue-400" };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[signal]} mr-2`} />;
};

const insights = [
  { icon: "🚀", title: "Meta App — Growth Engine", text: "Scaled +36% spend while CPI held flat and cost/onboarding improved. Conversion rate at 24%. Keep pushing.", color: "border-emerald-500 bg-emerald-50" },
  { icon: "⚠️", title: "Meta Desktop — Needs Attention", text: "Downloads dropped 12% despite CTR gains. Conversion rate slipping. Investigate LP or creative.", color: "border-amber-400 bg-amber-50" },
  { icon: "⚠️", title: "ASA Brand — Volume Drop", text: "Downloads down 38%, CPI up 52%. Still cheapest channel at $2.52 CPI. Monitor for trend.", color: "border-amber-400 bg-amber-50" },
  { icon: "🛑", title: "ASA Generic + Competitors", text: "Effectively paused. CPIs at $31+ and $22+ are not sustainable.", color: "border-red-400 bg-red-50" },
  { icon: "🚀", title: "Microsoft Ads — Breakout", text: "Scaled from near-zero to 93 conversions at $6.97. Strong non-brand signal.", color: "border-emerald-500 bg-emerald-50" },
  { icon: "📊", title: "Google Ads — Budget Capped", text: "Spent full allocation at $5.91/conversion. Consider increasing budget.", color: "border-blue-400 bg-blue-50" },
];

export default function WillowReport() {
  const [tab, setTab] = useState("table");

  const sortedBySpend = [...channels].sort((a, b) => b.spend - a.spend);
  const sortedByDl = [...channels].sort((a, b) => b.downloads - a.downloads);
  const sortedByCpi = [...channels].sort((a, b) => a.cpi - b.cpi);
  const maxSpend = Math.max(...channels.map(c => c.spend));
  const maxDl = Math.max(...channels.map(c => c.downloads));

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WILLOW — Weekly Performance</h1>
              <p className="text-sm text-gray-500">Feb 9–15 vs Feb 2–8, 2026</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Spend", value: fmt(totals.spend, "$"), sub: "across 7 channels" },
            { label: "Total Downloads", value: fmtInt(totals.downloads), sub: "all platforms" },
            { label: "Blended CPI", value: fmt(totals.cpi, "$"), sub: "cost per download" },
            { label: "Onboardings", value: fmtInt(totals.onboardings), sub: "Meta + ASA Brand" },
          ].map((kpi, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          {[
            { id: "table", label: "Channel Breakdown" },
            { id: "insights", label: "Key Insights" },
            { id: "visual", label: "Visual" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "table" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Channel</th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold uppercase tracking-wider">Spend</th>
                    <th className="text-center px-3 py-3.5 text-xs font-semibold uppercase tracking-wider">WoW</th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold uppercase tracking-wider">Downloads</th>
                    <th className="text-center px-3 py-3.5 text-xs font-semibold uppercase tracking-wider">WoW</th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold uppercase tracking-wider">Cost/DL</th>
                    <th className="text-center px-3 py-3.5 text-xs font-semibold uppercase tracking-wider">WoW</th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold uppercase tracking-wider">Onboardings</th>
                    <th className="text-center px-3 py-3.5 text-xs font-semibold uppercase tracking-wider">WoW</th>
                    <th className="text-right px-4 py-3.5 text-xs font-semibold uppercase tracking-wider">Cost/Onb</th>
                    <th className="text-center px-3 py-3.5 text-xs font-semibold uppercase tracking-wider">WoW</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map((ch, i) => (
                    <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-indigo-50/30 transition-colors`}>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap"><SignalDot signal={ch.signal} />{ch.name}</td>
                      <td className="text-right px-4 py-3.5 text-sm text-gray-700 font-mono">{fmt(ch.spend, "$")}</td>
                      <td className="text-center px-3 py-3.5"><Badge value={ch.spendChg} /></td>
                      <td className="text-right px-4 py-3.5 text-sm text-gray-700 font-mono">{fmtInt(ch.downloads)}</td>
                      <td className="text-center px-3 py-3.5"><Badge value={ch.dlChg} /></td>
                      <td className="text-right px-4 py-3.5 text-sm text-gray-700 font-mono">{fmt(ch.cpi, "$")}</td>
                      <td className="text-center px-3 py-3.5"><Badge value={ch.cpiChg} invert /></td>
                      <td className="text-right px-4 py-3.5 text-sm text-gray-700 font-mono">{fmtInt(ch.onboardings)}</td>
                      <td className="text-center px-3 py-3.5"><Badge value={ch.onbChg} /></td>
                      <td className="text-right px-4 py-3.5 text-sm text-gray-700 font-mono">{fmt(ch.cpo, "$")}</td>
                      <td className="text-center px-3 py-3.5"><Badge value={ch.cpoChg} invert /></td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-900 bg-gray-900 text-white">
                    <td className="px-5 py-3.5 text-sm font-bold">TOTAL</td>
                    <td className="text-right px-4 py-3.5 text-sm font-bold font-mono">{fmt(totals.spend, "$")}</td>
                    <td></td>
                    <td className="text-right px-4 py-3.5 text-sm font-bold font-mono">{fmtInt(totals.downloads)}</td>
                    <td></td>
                    <td className="text-right px-4 py-3.5 text-sm font-bold font-mono">{fmt(totals.cpi, "$")}</td>
                    <td></td>
                    <td className="text-right px-4 py-3.5 text-sm font-bold font-mono">{fmtInt(totals.onboardings)}</td>
                    <td></td>
                    <td className="text-right px-4 py-3.5 text-sm font-bold font-mono">{fmt(totals.cpo, "$")}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "insights" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((ins, i) => (
              <div key={i} className={`rounded-2xl p-5 border-l-4 ${ins.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{ins.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm">{ins.title}</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{ins.text}</p>
              </div>
            ))}
            <div className="md:col-span-2 rounded-2xl bg-white border border-gray-200 p-6 mt-2">
              <h3 className="font-bold text-gray-900 mb-3">Recommended Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Continue scaling Meta App Weblink",
                  "Investigate Meta Desktop LP/creative",
                  "Monitor ASA Brand volume trend",
                  "Consider increasing Google Ads budget",
                  "Keep scaling Microsoft Ads",
                  "Keep ASA Generic + Competitors paused",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-indigo-500 mt-0.5 font-bold">{i + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "visual" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Spend by Channel</h3>
              <div className="space-y-3">
                {sortedBySpend.map((ch, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-44 text-sm text-gray-700 font-medium truncate">{ch.name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden relative">
                      <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(ch.spend / maxSpend) * 100}%` }} />
                      <span className="absolute inset-y-0 left-3 flex items-center text-xs font-semibold text-white drop-shadow">{fmt(ch.spend, "$")}</span>
                    </div>
                    <div className="w-24"><Badge value={ch.spendChg} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Downloads by Channel</h3>
              <div className="space-y-3">
                {sortedByDl.map((ch, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-44 text-sm text-gray-700 font-medium truncate">{ch.name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden relative">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(ch.downloads / maxDl) * 100}%` }} />
                      <span className="absolute inset-y-0 left-3 flex items-center text-xs font-semibold text-white drop-shadow">{fmtInt(ch.downloads)}</span>
                    </div>
                    <div className="w-24"><Badge value={ch.dlChg} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Cost per Download</h3>
              <div className="space-y-3">
                {sortedByCpi.map((ch, i) => {
                  const maxCpi = 35;
                  const color = ch.cpi < 7 ? "bg-emerald-500" : ch.cpi < 15 ? "bg-amber-400" : "bg-red-500";
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-44 text-sm text-gray-700 font-medium truncate">{ch.name}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden relative">
                        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.min((ch.cpi / maxCpi) * 100, 100)}%` }} />
                        <span className="absolute inset-y-0 left-3 flex items-center text-xs font-semibold text-white drop-shadow">{fmt(ch.cpi, "$")}</span>
                      </div>
                      <div className="w-24"><Badge value={ch.cpiChg} invert /></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Under $7</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> $7–$15</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Over $15</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">Prepared by Valid for Willow — Week of Feb 9–15, 2026</p>
      </div>
    </div>
  );
}


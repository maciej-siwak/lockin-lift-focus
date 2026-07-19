import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, LineChart as LineChartIcon, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AppShell } from "./AppShell";
import { storage } from "@/lib/storage";
import type { SessionLog } from "@/lib/types";
import { useT } from "@/lib/i18n";

interface Props { onBack: () => void; }

interface Point { t: number; date: string; weight: number; }

export const Charts = ({ onBack }: Props) => {
  const t = useT();
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const unit = useMemo(() => storage.getSettings().weightUnit, []);

  useEffect(() => { setSessions(storage.getSessions()); }, []);

  // Map: exerciseKey -> { displayName, sessionCount, peak }
  const exercises = useMemo(() => {
    const map: Record<string, { name: string; count: number; peak: number }> = {};
    for (const s of sessions) {
      for (const ex of s.exercises) {
        const key = ex.exerciseName.toLowerCase();
        const maxW = ex.sets.reduce((m, x) => Math.max(m, x.weight || 0), 0);
        if (maxW <= 0) continue;
        if (!map[key]) map[key] = { name: ex.exerciseName, count: 0, peak: 0 };
        map[key].count += 1;
        if (maxW > map[key].peak) map[key].peak = maxW;
      }
    }
    return Object.entries(map)
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.peak - a.peak);
  }, [sessions]);

  const points: Point[] = useMemo(() => {
    if (!selected) return [];
    const rows: Point[] = [];
    for (const s of sessions) {
      const ex = s.exercises.find(e => e.exerciseName.toLowerCase() === selected);
      if (!ex) continue;
      const maxW = ex.sets.reduce((m, x) => Math.max(m, x.weight || 0), 0);
      if (maxW <= 0) continue;
      rows.push({
        t: s.startedAt,
        date: new Date(s.startedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        weight: maxW,
      });
    }
    return rows.sort((a, b) => a.t - b.t);
  }, [sessions, selected]);

  const selectedName = selected ? exercises.find(e => e.key === selected)?.name ?? selected : "";
  const peak = points.reduce((m, p) => Math.max(m, p.weight), 0);

  return (
    <AppShell
      title={selected ? selectedName : t("charts.title")}
      left={
        <button
          onClick={() => (selected ? setSelected(null) : onBack())}
          aria-label={t("common.back")}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      }
    >
      <div className="pt-5">
        {selected ? (
          points.length === 0 ? (
            <EmptyState text={t("charts.noData")} />
          ) : (
            <section className="rounded-2xl bg-gradient-dark border border-border p-4 shadow-card">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {t("charts.topWeight")}
                  </h3>
                </div>
                <span className="font-mono-timer text-xs text-muted-foreground">
                  {t("charts.peak")} <span className="text-foreground font-bold">{peak}{unit}</span>
                </span>
              </div>
              <div className="h-64 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={points} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      stroke="hsl(var(--border))"
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      stroke="hsl(var(--border))"
                      tickLine={false}
                      width={36}
                      unit={unit}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                      formatter={(v: number) => [`${v}${unit}`, t("charts.topWeight")]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground text-center">
                {points.length} {t("charts.sessions")}
              </p>
            </section>
          )
        ) : exercises.length === 0 ? (
          <EmptyState text={t("charts.empty")} />
        ) : (
          <>
            <h3 className="font-mono-data text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-3">
              {t("charts.pickExercise")}
            </h3>
            <ul className="space-y-2">
              {exercises.map(ex => (
                <li key={ex.key}>
                  <button
                    onClick={() => setSelected(ex.key)}
                    className="w-full rounded-2xl bg-card border border-border/70 p-3.5 flex items-center gap-3.5 text-left transition-base hover:border-primary/40"
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary/70 flex items-center justify-center text-muted-foreground shrink-0">
                      <LineChartIcon className="w-[15px] h-[15px]" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[14px] leading-tight tracking-tight truncate">{ex.name}</p>
                      <p className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
                        {t("charts.peak")} {ex.peak}{unit} · {ex.count} {t("charts.sessions")}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/70" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </AppShell>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <div className="rounded-2xl border border-dashed border-border p-8 text-center">
    <LineChartIcon className="w-8 h-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
    <p className="mt-3 text-sm text-muted-foreground">{text}</p>
  </div>
);
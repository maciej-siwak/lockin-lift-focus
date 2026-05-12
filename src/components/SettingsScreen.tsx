import { useState } from "react";
import { ArrowLeft, Check, Globe, Timer, Scale, Volume2, Vibrate } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { LANGUAGES, useI18n, type Lang } from "@/lib/i18n";

interface Props { onBack: () => void; }

export const SettingsScreen = ({ onBack }: Props) => {
  const { t, lang, setLang } = useI18n();
  const [s, setS] = useState(storage.getSettings());

  const save = () => {
    storage.saveSettings({ ...s, language: lang });
    toast.success(t("settings.saved"));
    onBack();
  };

  const onLangChange = (code: Lang) => {
    setLang(code);
    setS(prev => ({ ...prev, language: code }));
  };

  return (
    <AppShell
      title={t("settings.title")}
      left={<button onClick={onBack} aria-label={t("common.back")} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
      right={<button onClick={save} aria-label={t("common.save")} className="p-2 -mr-2 text-primary"><Check className="w-5 h-5" /></button>}
    >
      <div className="pt-6 pb-8 space-y-7">
        {/* Language */}
        <Group icon={<Globe className="w-3.5 h-3.5" />} title={t("settings.language")}>
          <div className="p-2 grid grid-cols-2 gap-1.5">
            {LANGUAGES.map(l => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => onLangChange(l.code)}
                  className={`relative h-12 rounded-xl font-semibold text-sm transition-base px-3 flex items-center justify-between ${
                    active
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-secondary/60 text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="truncate">{l.native}</span>
                  {active && <Check className="w-4 h-4 shrink-0" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </Group>

        {/* Training */}
        <Group icon={<Timer className="w-3.5 h-3.5" />} title={t("settings.defaultRest")}>
          <div className="p-2 grid grid-cols-4 gap-1.5">
            {[60, 90, 120, 180].map(v => {
              const active = s.defaultRestSeconds === v;
              return (
                <button key={v} onClick={() => setS({ ...s, defaultRestSeconds: v })}
                  className={`h-12 rounded-xl font-mono-timer font-bold text-sm transition-base ${active ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary/60 text-foreground hover:bg-secondary"}`}>
                  {v}<span className={`ml-0.5 text-[10px] ${active ? "opacity-70" : "text-muted-foreground"}`}>s</span>
                </button>
              );
            })}
          </div>
        </Group>

        <Group icon={<Scale className="w-3.5 h-3.5" />} title={t("settings.weightUnit")}>
          <div className="p-2 grid grid-cols-2 gap-1.5">
            {(["kg","lb"] as const).map(v => {
              const active = s.weightUnit === v;
              return (
                <button key={v} onClick={() => setS({ ...s, weightUnit: v })}
                  className={`h-12 rounded-xl font-bold text-sm uppercase tracking-wider transition-base ${active ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary/60 text-foreground hover:bg-secondary"}`}>
                  {v}
                </button>
              );
            })}
          </div>
        </Group>

        {/* Feedback */}
        <Group title={t("home.settings")}>
          <Row icon={<Volume2 className="w-4 h-4 text-primary" />} label={t("settings.sound")} desc={t("settings.soundDesc")}>
            <Switch checked={s.sound} onCheckedChange={v => setS({ ...s, sound: v })} />
          </Row>
          <div className="h-px bg-border/60 mx-4" />
          <Row icon={<Vibrate className="w-4 h-4 text-primary" />} label={t("settings.vibration")} desc={t("settings.vibrationDesc")}>
            <Switch checked={s.vibration} onCheckedChange={v => setS({ ...s, vibration: v })} />
          </Row>
        </Group>

        <Button onClick={save} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-glow">{t("common.save")}</Button>
      </div>
    </AppShell>
  );
};

const Group = ({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section>
    <h3 className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-1.5">
      {icon}{title}
    </h3>
    <div className="rounded-2xl bg-card/80 border border-border shadow-card overflow-hidden">
      {children}
    </div>
  </section>
);

const Row = ({ icon, label, desc, children }: { icon?: React.ReactNode; label: string; desc?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 px-4 py-3.5">
    <div className="flex items-start gap-3 min-w-0">
      {icon && (
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-sm leading-tight">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-1 leading-snug">{desc}</p>}
      </div>
    </div>
    {children}
  </div>
);

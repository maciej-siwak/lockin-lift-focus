import { useState } from "react";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { LANGUAGES, useI18n, type Lang } from "@/lib/i18n";
import { setSkin, type Skin } from "@/lib/skin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const onSkinChange = (skin: Skin) => {
    setS(prev => ({ ...prev, skin }));
    setSkin(skin);
  };

  const resetApp = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* no-op */
    }
    toast.success(t("settings.resetDone"));
    // Hard reload to fully reinitialise app state
    setTimeout(() => window.location.reload(), 150);
  };

  return (
    <AppShell
      title={t("settings.title")}
      left={<button onClick={onBack} aria-label={t("common.back")} className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
      right={<button onClick={save} aria-label={t("common.save")} className="p-2 -mr-2 text-primary"><Check className="w-5 h-5" /></button>}
    >
      <div className="pt-5 space-y-5">
        <Card>
          <Label>{t("settings.language")}</Label>
          <div className="mt-3">
            <Select value={lang} onValueChange={(v) => onLangChange(v as Lang)}>
              <SelectTrigger className="h-11 rounded-xl bg-secondary border-0 font-semibold text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(l => (
                  <SelectItem key={l.code} value={l.code}>{l.native}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card>
          <Label>{t("settings.defaultRest")}</Label>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[60, 90, 120, 180].map(v => (
              <button key={v} onClick={() => setS({ ...s, defaultRestSeconds: v })}
                className={`h-11 rounded-xl font-semibold text-sm transition-base ${s.defaultRestSeconds === v ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                {v}s
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <Label>{t("settings.weightUnit")}</Label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["kg","lb"] as const).map(v => (
              <button key={v} onClick={() => setS({ ...s, weightUnit: v })}
                className={`h-11 rounded-xl font-semibold text-sm uppercase transition-base ${s.weightUnit === v ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                {v}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <Row label={t("settings.sound")} desc={t("settings.soundDesc")}>
            <Switch checked={s.sound} onCheckedChange={v => setS({ ...s, sound: v })} />
          </Row>
        </Card>

        <Card>
          <Label>{t("settings.skins")}</Label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {([
              { id: "default", label: t("settings.skinDefault") },
              { id: "time-chamber", label: t("settings.skinTimeChamber") },
            ] as const).map(opt => {
              const active = (s.skin ?? "default") === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSkinChange(opt.id)}
                  className={`h-11 rounded-xl font-semibold text-sm transition-base ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Card>

        <Button onClick={save} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold">{t("common.save")}</Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="w-full h-14 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-base"
              style={{
                borderColor: "hsl(28 100% 55% / 0.5)",
                backgroundColor: "hsl(28 100% 55% / 0.1)",
                color: "hsl(28 100% 60%)",
                boxShadow: "0 0 24px hsl(28 100% 55% / 0.45)",
              }}
            >
              <Trash2 className="w-4 h-4" />
              {t("settings.resetApp")}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("settings.resetConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>{t("settings.resetConfirmDesc")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={resetApp}
                className="text-white"
                style={{ backgroundColor: "hsl(28 100% 55%)" }}
              >
                {t("settings.resetConfirmCta")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <p className="text-xs text-muted-foreground text-center">{t("settings.resetDesc")}</p>
      </div>
    </AppShell>
  );
};

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl bg-card border border-border p-4">{children}</div>
);
const Label = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</h3>
);
const Row = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="min-w-0">
      <p className="font-semibold">{label}</p>
      {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
    </div>
    {children}
  </div>
);

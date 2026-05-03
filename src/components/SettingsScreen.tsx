import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

interface Props { onBack: () => void; }

export const SettingsScreen = ({ onBack }: Props) => {
  const [s, setS] = useState(storage.getSettings());

  const save = () => {
    storage.saveSettings(s);
    toast.success("Settings saved");
    onBack();
  };

  return (
    <AppShell
      title="Settings"
      left={<button onClick={onBack} aria-label="Back" className="p-2 -ml-2"><ArrowLeft className="w-5 h-5" /></button>}
      right={<button onClick={save} aria-label="Save" className="p-2 -mr-2 text-primary"><Check className="w-5 h-5" /></button>}
    >
      <div className="pt-5 space-y-5">
        <Card>
          <Label>Default rest</Label>
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
          <Label>Weight unit</Label>
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
          <Row label="Countdown sound" desc="Beeps in the last 10 seconds of rest.">
            <Switch checked={s.sound} onCheckedChange={v => setS({ ...s, sound: v })} />
          </Row>
          <div className="border-t border-border my-3" />
          <Row label="Vibration" desc="Pulses on countdown and set log.">
            <Switch checked={s.vibration} onCheckedChange={v => setS({ ...s, vibration: v })} />
          </Row>
        </Card>

        <Button onClick={save} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold">Save</Button>
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
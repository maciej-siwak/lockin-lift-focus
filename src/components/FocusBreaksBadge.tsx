import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { useT } from "@/lib/i18n";

/** Shows total focus breaks across all logged sessions. */
export const FocusBreaksBadge = () => {
  const t = useT();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const sessions = storage.getSessions();
    const sum = sessions.reduce((a, s) => a + (s.focusBreaks ?? 0), 0);
    setTotal(sum);
  }, []);

  if (total == null) return null;
  return (
    <span
      title={t("focus.tooltipTotal")}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${total > 0 ? "border-warning/40 bg-warning/10 text-warning" : "border-border bg-muted text-muted-foreground"}`}
    >
      <Eye className="w-3 h-3" />
      {total}
    </span>
  );
};
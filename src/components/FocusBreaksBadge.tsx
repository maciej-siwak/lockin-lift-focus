import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

/** Shows total focus breaks across all logged sessions. */
export const FocusBreaksBadge = () => {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const sessions = storage.getSessions();
    const sum = sessions.reduce((a, s) => a + (s.focusBreaks ?? 0), 0);
    setTotal(sum);
  }, []);

  if (total == null) return null;
  return (
    <span
      title="Total focus breaks across all sessions"
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-warning/40 bg-warning/10 text-warning"
    >
      <Eye className="w-3 h-3" />
      {total}
    </span>
  );
};
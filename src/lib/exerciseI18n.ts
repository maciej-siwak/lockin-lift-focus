import type { Lang } from "./i18n";
import en from "./exercise-locales/en.json";
import es from "./exercise-locales/es.json";
import pt from "./exercise-locales/pt.json";
import de from "./exercise-locales/de.json";
import ja from "./exercise-locales/ja.json";
import ko from "./exercise-locales/ko.json";
import pl from "./exercise-locales/pl.json";
import bg from "./exercise-locales/bg.json";

export interface LocalizedExerciseFields {
  muscles: string[];
  equipment: string;
  difficulty: string;
  type: string;
  description: string;
  setup: string;
  execution: string;
  tips: string;
  mistakes: string;
}

type LocaleMap = Record<string, LocalizedExerciseFields>;

const LOCALES: Record<Lang, LocaleMap> = {
  en: en as LocaleMap,
  es: es as LocaleMap,
  pt: pt as LocaleMap,
  de: de as LocaleMap,
  ja: ja as LocaleMap,
  ko: ko as LocaleMap,
  pl: pl as LocaleMap,
  bg: bg as LocaleMap,
};

/** Look up localized text for an exercise by its imageKey slug. Falls back to English. */
export function getLocalizedExerciseFields(
  imageKey: string,
  lang: Lang
): LocalizedExerciseFields | null {
  const dict = LOCALES[lang] ?? LOCALES.en;
  return dict[imageKey] ?? LOCALES.en[imageKey] ?? null;
}
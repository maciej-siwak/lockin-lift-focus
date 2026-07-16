import { storage } from "./storage";
import type { Settings } from "./types";

export type Skin = NonNullable<Settings["skin"]>;

const EVT = "lockin:skin-change";

export function applySkin(skin: Skin) {
  const root = document.documentElement;
  if (skin === "default") root.removeAttribute("data-skin");
  else root.setAttribute("data-skin", skin);
}

export function getSkin(): Skin {
  return (storage.getSettings().skin ?? "default") as Skin;
}

export function setSkin(skin: Skin) {
  const s = storage.getSettings();
  storage.saveSettings({ ...s, skin });
  applySkin(skin);
  window.dispatchEvent(new CustomEvent(EVT, { detail: skin }));
}

export function onSkinChange(cb: (skin: Skin) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<Skin>).detail);
  window.addEventListener(EVT, handler);
  return () => window.removeEventListener(EVT, handler);
}
// One-time unlock via Google Play Billing (Capacitor).
// Uses cordova-plugin-purchase (works with Capacitor Android/iOS).
// On web, falls back to a no-op mock so the app keeps working in the browser.
//
// Entitlement persistence: the unlock flag is mirrored to several stores that
// survive an in-app "Reset app" (which clears localStorage/sessionStorage):
//   1. Capacitor Preferences (native, backed by SharedPreferences/UserDefaults)
//   2. A long-lived cookie (web fallback, untouched by localStorage.clear())
//   3. localStorage (fast synchronous cache)
// On native we additionally re-query Google Play ownership on every launch, so
// the entitlement is always recoverable from the user's Play account.

import { storage } from "./storage";

export const UNLOCK_PRODUCT_ID = "lockin_full_unlock";
export const FREE_SESSION_LIMIT = 9;
const UNLOCK_KEY = "lockin.unlocked";
const COOKIE_KEY = "lockin_entitlement";

type Listener = (unlocked: boolean) => void;
const listeners = new Set<Listener>();

// ---- persistence layers ---------------------------------------------------

const prefsPlugin = (): any => {
  try { return (window as any).Capacitor?.Plugins?.Preferences ?? null; } catch { return null; }
};

const readCookie = (): boolean => {
  try {
    return document.cookie.split("; ").some(c => c === `${COOKIE_KEY}=1`);
  } catch { return false; }
};

const writeCookie = (val: boolean) => {
  try {
    // 10 years; entitlement is permanent for a one-time purchase.
    const maxAge = val ? 60 * 60 * 24 * 3650 : 0;
    document.cookie = `${COOKIE_KEY}=${val ? "1" : "0"}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch { /* ignore */ }
};

const readLocal = (): boolean => {
  try { return localStorage.getItem(UNLOCK_KEY) === "1"; } catch { return false; }
};

const writeLocal = (val: boolean) => {
  try { localStorage.setItem(UNLOCK_KEY, val ? "1" : "0"); } catch { /* ignore */ }
};

/** Synchronous best-effort read (localStorage cache or cookie). */
export const isUnlocked = (): boolean => readLocal() || readCookie();

const setUnlocked = (val: boolean) => {
  const changed = isUnlocked() !== val;
  writeLocal(val);
  writeCookie(val);
  const prefs = prefsPlugin();
  if (prefs) {
    try { void prefs.set({ key: UNLOCK_KEY, value: val ? "1" : "0" }); } catch { /* ignore */ }
  }
  if (changed || val) listeners.forEach(l => l(val));
};

/**
 * Rehydrate entitlement from the durable stores. Safe to call any time
 * (e.g. app boot, or right after an app reset wiped localStorage).
 */
export const hydrateEntitlement = async (): Promise<boolean> => {
  let unlocked = readLocal() || readCookie();
  const prefs = prefsPlugin();
  if (prefs) {
    try {
      const { value } = await prefs.get({ key: UNLOCK_KEY });
      if (value === "1") unlocked = true;
    } catch { /* ignore */ }
  }
  if (unlocked) setUnlocked(true);
  return unlocked;
};

export const onUnlockChange = (l: Listener) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const completedSessionCount = (): number => {
  try {
    return storage.getSessions().filter(s => s.endedAt != null).length;
  } catch { return 0; }
};

export const shouldLock = (): boolean =>
  !isUnlocked() && completedSessionCount() >= FREE_SESSION_LIMIT;

// ---- Google Play / IAP wiring --------------------------------------------

let storeReady: Promise<any> | null = null;
let cachedPrice = "";

const isNative = (): boolean => {
  try {
    // Capacitor sets this when running in the WebView on device.
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch { return false; }
};

const initStore = async (): Promise<any | null> => {
  if (!isNative()) return null;
  if (storeReady) return storeReady;

  storeReady = (async () => {
    // cordova-plugin-purchase registers `CdvPurchase` on window when the
    // native side has attached (deviceready). Poll briefly for it.
    const CdvPurchase = await new Promise<any>((resolve) => {
      const start = Date.now();
      const tick = () => {
        const cp = (window as any).CdvPurchase;
        if (cp) return resolve(cp);
        if (Date.now() - start > 8000) return resolve(null);
        setTimeout(tick, 100);
      };
      tick();
    });
    if (!CdvPurchase) return null;

    const { store, ProductType, Platform } = CdvPurchase;

    store.register([{
      id: UNLOCK_PRODUCT_ID,
      type: ProductType.NON_CONSUMABLE,
      platform: Platform.GOOGLE_PLAY,
    }]);

    store.when()
      .approved((tx: any) => tx.verify())
      .verified((receipt: any) => {
        receipt.finish();
        const owned = store.get(UNLOCK_PRODUCT_ID, Platform.GOOGLE_PLAY)?.owned;
        if (owned) setUnlocked(true);
      })
      .productUpdated((p: any) => {
        if (p.id === UNLOCK_PRODUCT_ID) {
          cachedPrice = p.pricing?.price || cachedPrice;
          if (p.owned) setUnlocked(true);
        }
      });

    await store.initialize([Platform.GOOGLE_PLAY]);
    return store;
  })();

  return storeReady;
};

export const getUnlockPrice = (): string => cachedPrice;

export const purchaseUnlock = async (): Promise<{ ok: boolean; error?: string }> => {
  if (!isNative()) {
    // Dev / web fallback: unlock directly so the flow is testable in preview.
    setUnlocked(true);
    return { ok: true };
  }
  const store = await initStore();
  if (!store) return { ok: false, error: "Store unavailable" };
  try {
    const { Platform } = (window as any).CdvPurchase;
    const product = store.get(UNLOCK_PRODUCT_ID, Platform.GOOGLE_PLAY);
    if (!product) return { ok: false, error: "Product not found" };
    const offer = product.getOffer();
    if (!offer) return { ok: false, error: "No offer available" };
    await store.order(offer);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Purchase failed" };
  }
};

export const restorePurchases = async (): Promise<void> => {
  if (!isNative()) return;
  const store = await initStore();
  if (!store) return;
  try { await store.restorePurchases(); } catch { /* ignore */ }
};

// Kick off store init on app load so `owned` state is detected early, and
// rehydrate the entitlement from durable storage / the Play account.
export const initPurchases = () => {
  void (async () => {
    await hydrateEntitlement();
    const store = await initStore();
    if (!store) return;
    try {
      // Re-derive ownership from Google Play so a wiped device/app storage
      // still recognises a previous purchase without user action.
      await store.restorePurchases();
      const { Platform } = (window as any).CdvPurchase;
      if (store.get(UNLOCK_PRODUCT_ID, Platform.GOOGLE_PLAY)?.owned) setUnlocked(true);
    } catch { /* ignore */ }
  })();
};

// One-time unlock via Google Play Billing (Capacitor).
// Uses cordova-plugin-purchase (works with Capacitor Android/iOS).
// On web, falls back to a no-op mock so the app keeps working in the browser.

import { storage } from "./storage";

export const UNLOCK_PRODUCT_ID = "lockin_full_unlock";
export const FREE_SESSION_LIMIT = 9;
const UNLOCK_KEY = "lockin.unlocked";

type Listener = (unlocked: boolean) => void;
const listeners = new Set<Listener>();

export const isUnlocked = (): boolean => {
  try { return localStorage.getItem(UNLOCK_KEY) === "1"; } catch { return false; }
};

const setUnlocked = (val: boolean) => {
  try { localStorage.setItem(UNLOCK_KEY, val ? "1" : "0"); } catch { /* ignore */ }
  listeners.forEach(l => l(val));
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

// Kick off store init on app load so `owned` state is detected early.
export const initPurchases = () => { void initStore(); };

import { beforeEach, describe, expect, it } from "vitest";
import { isUnlocked } from "@/lib/purchase";
import { storage } from "@/lib/storage";

describe("Reset app", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "lockin_entitlement=0; path=/; max-age=0";
  });

  it("preserves a purchased unlock while clearing workout data", () => {
    localStorage.setItem("lockin.unlocked", "1");
    localStorage.setItem("lockin.workouts", "[]");
    localStorage.setItem("lockin.sessions", "[]");
    localStorage.setItem("lockin.settings", "{}");
    localStorage.setItem("lockin.lastWeights", "{}");
    sessionStorage.setItem("workout-in-progress", "active");

    storage.clearAppData();

    expect(localStorage.getItem("lockin.unlocked")).toBe("1");
    expect(isUnlocked()).toBe(true);
    expect(localStorage.getItem("lockin.workouts")).toBeNull();
    expect(localStorage.getItem("lockin.sessions")).toBeNull();
    expect(localStorage.getItem("lockin.settings")).toBeNull();
    expect(localStorage.getItem("lockin.lastWeights")).toBeNull();
    expect(sessionStorage.getItem("workout-in-progress")).toBeNull();
  });

  it("does not grant an unlock to a user who did not purchase one", () => {
    localStorage.setItem("lockin.sessions", "[]");

    storage.clearAppData();

    expect(localStorage.getItem("lockin.unlocked")).toBeNull();
    expect(isUnlocked()).toBe(false);
  });
});

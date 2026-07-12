// lib/droneProfile.ts — save/manage multiple drone specs, client-side only
// (localStorage — no backend/database in this app, matches how the rest of
// OBIXCORE works). Profiles are the canonical "physical spec" shape, close
// to lib/droneSpec.ts's DroneSpec, with small converters into whichever
// shape each tool's input state expects (Wizard and Visualizer use two
// slightly different field names/units for historical reasons).

import type { FrameSize, FlightStyle, DroneSpec } from "./droneSpec";
import type { WizardInput } from "@/types";

export interface DroneProfile {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  frameSize: FrameSize;
  frameMm: number;
  propIn: number;
  propBlades: 2 | 3 | 4;
  motorKV: number;
  batteryS: 2 | 3 | 4 | 5 | 6;
  batteryMah?: number;
  weightG: number;
  style: FlightStyle;
  escCurrentA?: number;
  notes?: string;
}

const STORAGE_KEY = "obixcore:drone-profiles";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): DroneProfile[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(profiles: DroneProfile[]): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return true;
  } catch {
    return false;
  }
}

export function listProfiles(): DroneProfile[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getProfile(id: string): DroneProfile | null {
  return readAll().find((p) => p.id === id) ?? null;
}

export function saveProfile(input: Omit<DroneProfile, "id" | "createdAt" | "updatedAt">, id?: string): DroneProfile {
  const all = readAll();
  const now = Date.now();

  if (id) {
    const idx = all.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const updated: DroneProfile = { ...all[idx], ...input, id, updatedAt: now };
      all[idx] = updated;
      writeAll(all);
      return updated;
    }
  }

  const created: DroneProfile = {
    ...input,
    id: `profile_${now}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  all.push(created);
  writeAll(all);
  return created;
}

export function deleteProfile(id: string): void {
  writeAll(readAll().filter((p) => p.id !== id));
}

// ---- Conversion helpers ----

export function profileToDroneSpec(p: DroneProfile): DroneSpec {
  return {
    frameSize: p.frameSize,
    frameMm: p.frameMm,
    propIn: p.propIn,
    propBlades: p.propBlades,
    motorKV: p.motorKV,
    batteryS: p.batteryS,
    batteryMah: p.batteryMah,
    weightG: p.weightG,
    style: p.style,
    escCurrentA: p.escCurrentA,
  };
}

export function profileToWizardInput(p: DroneProfile): WizardInput {
  return {
    frameSize: p.frameMm,
    motorKV: p.motorKV,
    batteryS: p.batteryS,
    propSize: Math.round(p.propIn * 10),
    weight: p.weightG,
    style: p.style,
    propBlades: p.propBlades,
    batteryMah: p.batteryMah,
    escCurrentRatingA: p.escCurrentA,
  };
}

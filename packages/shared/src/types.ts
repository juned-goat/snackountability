/**
 * Core domain types shared between the mobile app and the Supabase edge
 * functions. Keeping these in one place is the whole point of the monorepo:
 * app and backend import the SAME shape, so they can't drift apart.
 */

export type Goal = "lose" | "maintain" | "gain";

export interface UserProfile {
  id: string;
  goal: Goal;
  /** kg */
  weightKg: number;
  /** cm */
  heightCm: number;
  age: number;
  sex: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  /** target rate of change in kg/week, negative for "lose" */
  targetRateKgPerWeek: number;
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sugarG: number;
}

export interface ParsedFoodItem {
  /** raw name as parsed from text/OCR, e.g. "2 rotis" */
  rawText: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface MacroData {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sugarG: number;
  /** true if this came from an LLM guess rather than a real DB match */
  isEstimate: boolean;
}

export interface FoodLogEntry {
  id: string;
  userId: string;
  loggedAt: string; // ISO timestamp
  source: "manual_text" | "photo_note" | "photo_food";
  item: ParsedFoodItem;
  macros: MacroData;
}

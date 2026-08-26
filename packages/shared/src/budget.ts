import type { MacroTargets, UserProfile } from "./types";

const ACTIVITY_MULTIPLIER: Record<UserProfile["activityLevel"], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/** Mifflin-St Jeor — the formula with the best accuracy-to-simplicity ratio. */
function bmr(profile: UserProfile): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return profile.sex === "male" ? base + 5 : base - 161;
}

function tdee(profile: UserProfile): number {
  return bmr(profile) * ACTIVITY_MULTIPLIER[profile.activityLevel];
}

const KCAL_PER_KG_BODY_MASS = 7700;

/** Daily calorie + macro budget derived from goal and target rate of change. */
export function dailyBudget(profile: UserProfile): MacroTargets {
  const maintenance = tdee(profile);
  const dailyDeltaKcal = (profile.targetRateKgPerWeek * KCAL_PER_KG_BODY_MASS) / 7;
  const calories = Math.round(maintenance + dailyDeltaKcal);

  // Simple, sane macro split — protein anchored to body weight, rest split
  // between carbs/fat. Fine as a v1 default; can become goal/preference-driven later.
  const proteinG = Math.round(profile.weightKg * 1.8);
  const proteinKcal = proteinG * 4;
  const remaining = Math.max(calories - proteinKcal, 0);
  const carbsG = Math.round((remaining * 0.55) / 4);
  const fatG = Math.round((remaining * 0.45) / 9);

  return {
    calories,
    proteinG,
    carbsG,
    fatG,
    sugarG: Math.round((calories * 0.10) / 4), // WHO guidance: <10% of calories from free sugar
  };
}

export function weeklyBudget(profile: UserProfile): MacroTargets {
  const daily = dailyBudget(profile);
  return {
    calories: daily.calories * 7,
    proteinG: daily.proteinG * 7,
    carbsG: daily.carbsG * 7,
    fatG: daily.fatG * 7,
    sugarG: daily.sugarG * 7,
  };
}

export function monthlyDeficitTargetKg(profile: UserProfile): number {
  return profile.targetRateKgPerWeek * 4.345; // avg weeks/month
}

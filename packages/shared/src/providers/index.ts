/**
 * Provider interfaces — the vendor boundaries.
 *
 * Nothing in the app or edge functions should call OpenRouter, USDA, Expo
 * Push, etc. directly. They call these interfaces. Swapping a vendor later
 * means writing one new class that implements the interface and flipping
 * a config value — not hunting through call sites.
 *
 * See /README.md "Swappable pieces" for the current implementation of each.
 */
import type { MacroData, ParsedFoodItem } from "../types";

/** image -> raw transcribed text (handwritten notes or printed text) */
export interface OCRProvider {
  extractText(imageUrl: string): Promise<string>;
}

/** free-form text -> structured food items ("2 rotis and dal" -> [...]) */
export interface FoodParser {
  parseText(text: string): Promise<ParsedFoodItem[]>;
}

/** structured food item -> real macro numbers, or a flagged estimate */
export interface NutritionLookup {
  find(item: ParsedFoodItem): Promise<MacroData | null>;
}

/** push notifications for daily/weekly/monthly nudges */
export interface NotificationSender {
  send(userId: string, title: string, body: string): Promise<void>;
}

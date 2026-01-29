import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

// Fraction maps
const FRAC_MAP: Record<string, number> = {
  "½": 0.5, "⅓": 0.333, "⅔": 0.667, "¼": 0.25, "¾": 0.75,
  "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8, "⅙": 0.167,
  "⅚": 0.833, "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
};

function parseNum(s: string): number {
  s = s.trim();
  for (const [ch, v] of Object.entries(FRAC_MAP)) {
    if (s.includes(ch)) {
      const before = s.replace(ch, "").trim();
      return (before ? parseFloat(before) : 0) + v;
    }
  }
  return parseFloat(s);
}

function formatNum(n: number): string {
  const whole = Math.floor(n);
  const frac = n - whole;
  const niceFrags: [number, string][] = [
    [0.5, "½"], [0.333, "⅓"], [0.667, "⅔"], [0.25, "¼"], [0.75, "¾"], [0.125, "⅛"],
  ];
  for (const [v, ch] of niceFrags) {
    if (Math.abs(frac - v) < 0.02) return whole ? `${whole}${ch}` : ch;
  }
  if (frac < 0.02) return String(whole);
  const r = Math.round(n * 10) / 10;
  return r % 1 === 0 ? String(r) : r.toFixed(1);
}

const NUM_RE = /(\d+\s*[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]|\d+\.?\d*)/g;

export interface Ingredient {
  text: string;
}

export interface IngredientGroup {
  heading?: string;
  items: Ingredient[];
}

interface Props {
  originalServings: number;
  ingredientGroups: IngredientGroup[];
}

interface ParsedPart {
  before: string;
  num: number;
  after: string;
}

interface ParsedIngredient {
  original: string;
  parts: ParsedPart[];
}

function parseIngredient(text: string): ParsedIngredient {
  const parts: ParsedPart[] = [];
  let match;
  let lastIdx = 0;
  const re = new RegExp(NUM_RE.source, "g");
  while ((match = re.exec(text)) !== null) {
    parts.push({ before: text.slice(lastIdx, match.index), num: parseNum(match[0]), after: "" });
    lastIdx = re.lastIndex;
  }
  if (parts.length > 0) {
    parts[parts.length - 1].after = text.slice(lastIdx);
  }
  return { original: text, parts };
}

function scaleText(parsed: ParsedIngredient, ratio: number): { text: string; isScaled: boolean } {
  if (ratio === 1 || parsed.parts.length === 0) {
    return { text: parsed.original, isScaled: false };
  }
  let rebuilt = "";
  parsed.parts.forEach((p) => {
    rebuilt += p.before + formatNum(p.num * ratio) + p.after;
  });
  return { text: rebuilt, isScaled: true };
}

export function getScaledIngredients(groups: IngredientGroup[], originalServings: number, currentServings: number): { heading?: string; items: { text: string; original: string }[] }[] {
  const ratio = currentServings / originalServings;
  return groups.map((group) => ({
    heading: group.heading,
    items: group.items.map((item) => {
      const parsed = parseIngredient(item.text);
      const { text } = scaleText(parsed, ratio);
      return { text, original: item.text };
    }),
  }));
}

export default function RecipeScaler({ originalServings, ingredientGroups }: Props) {
  const [servings, setServings] = useState(originalServings);
  const ratio = servings / originalServings;

  const decrement = useCallback(() => setServings((s) => Math.max(1, s - 1)), []);
  const increment = useCallback(() => setServings((s) => Math.min(99, s + 1)), []);

  return (
    <div>
      {/* Servings control */}
      <span className="inline-flex items-center gap-1.5">
        🍽
        <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full text-sm font-bold" onClick={decrement}>
          −
        </Button>
        <span className="font-medium text-stone-700 min-w-[1.5ch] text-center">{servings}</span>
        <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full text-sm font-bold" onClick={increment}>
          +
        </Button>
      </span>

      {/* Scaled ingredients list */}
      {ingredientGroups.map((group, gi) => (
        <div key={gi} className="mt-6">
          {group.heading && (
            <h3 className="font-serif text-lg font-semibold text-stone-800 mb-2">{group.heading}</h3>
          )}
          <ul className="list-disc list-inside space-y-1 text-stone-700">
            {group.items.map((item, ii) => {
              const parsed = parseIngredient(item.text);
              const { text, isScaled } = scaleText(parsed, ratio);
              return (
                <li key={ii}>
                  {isScaled ? (
                    <span dangerouslySetInnerHTML={{
                      __html: (() => {
                        let result = "";
                        parsed.parts.forEach((p) => {
                          result += escapeHtml(p.before) + `<strong class="text-spice">${escapeHtml(formatNum(p.num * ratio))}</strong>` + escapeHtml(p.after);
                        });
                        return result;
                      })(),
                    }} />
                  ) : (
                    text
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export { parseIngredient, scaleText, formatNum, parseNum, escapeHtml };

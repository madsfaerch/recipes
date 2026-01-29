import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import ShoppingListModal from "./ShoppingListModal";
import type { IngredientGroup } from "./RecipeScaler";
import { parseIngredient, scaleText, formatNum, escapeHtml } from "./RecipeScaler";

interface Props {
  originalServings: number;
  ingredientGroups: IngredientGroup[];
}

export default function RecipeInteractive({ originalServings, ingredientGroups }: Props) {
  const [servings, setServings] = useState(originalServings);
  const ratio = servings / originalServings;

  const decrement = useCallback(() => setServings((s) => Math.max(1, s - 1)), []);
  const increment = useCallback(() => setServings((s) => Math.min(99, s + 1)), []);

  return (
    <div id="react-ingredients" className="not-prose">
      <Toaster position="bottom-center" toastOptions={{ className: "!bg-cream !text-stone-800 !border-stone-200" }} />

      {/* Ingredients heading with servings control */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-stone-900">Ingredients</h2>
        <span className="inline-flex items-center gap-1.5 text-sm text-stone-500">
          🍽
          <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full text-sm font-bold" onClick={decrement}>−</Button>
          <span className="font-medium text-stone-700 min-w-[1.5ch] text-center">{servings}</span>
          <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full text-sm font-bold" onClick={increment}>+</Button>
          <span className="text-stone-400 ml-0.5">servings</span>
        </span>
      </div>

      {/* Scaled ingredients */}
      {ingredientGroups.map((group, gi) => (
        <div key={gi} className={gi > 0 ? "mt-4" : ""}>
          {group.heading && (
            <h3 className="font-serif text-base font-semibold text-stone-700 mb-2">{group.heading}</h3>
          )}
          <ul className="list-disc list-inside space-y-1 text-stone-700">
            {group.items.map((item, ii) => {
              const parsed = parseIngredient(item.text);
              const { text, isScaled } = scaleText(parsed, ratio);
              return (
                <li key={ii} className="my-0.5">
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

      {/* Shopping list button + modal */}
      <div className="mt-4">
        <ShoppingListModal
          ingredientGroups={ingredientGroups}
          originalServings={originalServings}
          currentServings={servings}
        />
      </div>
    </div>
  );
}

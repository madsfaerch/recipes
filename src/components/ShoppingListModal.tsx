import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { IngredientGroup } from "./RecipeScaler";
import { getScaledIngredients } from "./RecipeScaler";

interface Props {
  ingredientGroups: IngredientGroup[];
  originalServings: number;
  currentServings: number;
}

export default function ShoppingListModal({ ingredientGroups, originalServings, currentServings }: Props) {
  const scaledGroups = getScaledIngredients(ingredientGroups, originalServings, currentServings);
  const allItems = scaledGroups.flatMap((g) => g.items.map((i) => i.text));

  const [checked, setChecked] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    allItems.forEach((_, i) => (init[i] = true));
    return init;
  });

  const allSelected = allItems.every((_, i) => checked[i]);

  function toggleAll() {
    const newVal = !allSelected;
    const next: Record<number, boolean> = {};
    allItems.forEach((_, i) => (next[i] = newVal));
    setChecked(next);
  }

  function toggle(idx: number) {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function getSelectedTexts(): string[] {
    return allItems.filter((_, i) => checked[i]);
  }

  async function handleCopy() {
    const text = getSelectedTexts().join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  function handleReminders() {
    const text = getSelectedTexts().join("\n");
    const encoded = encodeURIComponent(text);
    window.location.href = `shortcuts://run-shortcut?name=Add%20To%20Reminders&input=text&text=${encoded}`;
  }

  // Reset checked state when dialog opens
  function handleOpenChange(open: boolean) {
    if (open) {
      const init: Record<number, boolean> = {};
      allItems.forEach((_, i) => (init[i] = true));
      setChecked(init);
    }
  }

  let idx = 0;

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="mt-8">🛒 Add to Shopping List</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shopping List</DialogTitle>
          <DialogClose className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</DialogClose>
        </DialogHeader>
        <div className="px-6 py-4 overflow-y-auto flex-1 space-y-2">
          {scaledGroups.map((group, gi) => (
            <div key={gi}>
              {group.heading && (
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mt-3 mb-1">{group.heading}</p>
              )}
              {group.items.map((item) => {
                const currentIdx = idx++;
                return (
                  <label key={currentIdx} className="flex items-start gap-3 cursor-pointer group py-0.5">
                    <Checkbox
                      checked={checked[currentIdx] ?? true}
                      onCheckedChange={() => toggle(currentIdx)}
                      className="mt-0.5"
                    />
                    <span className="text-sm text-stone-700 group-hover:text-stone-900">{item.text}</span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-stone-200 flex gap-3">
          <Button variant="ghost" size="sm" className="mr-auto" onClick={toggleAll}>
            {allSelected ? "Deselect all" : "Select all"}
          </Button>
          <Button size="sm" onClick={handleCopy}>📋 Copy</Button>
          <Button variant="spice" size="sm" onClick={handleReminders}>🍎 Reminders</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

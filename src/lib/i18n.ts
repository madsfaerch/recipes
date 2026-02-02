export type Locale = 'en' | 'da';

const translations = {
  en: {
    recipes: 'Recipes',
    searchPlaceholder: 'Search recipes…',
    noRecipesFound: 'No recipes found for',
    ingredients: 'Ingredients',
    servings: 'servings',
    backToRecipes: '← Back to recipes',
    prep: 'Prep:',
    cook: 'Cook:',
    by: 'By',
    source: 'Source:',
    shoppingList: 'Shopping List',
    addToShoppingList: '🛒 Add to Shopping List',
    madeWithGoodTaste: 'Made with good taste',
    copy: '📋 Copy',
    copied: 'Copied to clipboard!',
    reminders: '🍎 Reminders',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
  },
  da: {
    recipes: 'Opskrifter',
    searchPlaceholder: 'Søg opskrifter…',
    noRecipesFound: 'Ingen opskrifter fundet for',
    ingredients: 'Ingredienser',
    servings: 'portioner',
    backToRecipes: '← Tilbage til opskrifter',
    prep: 'Forberedelse:',
    cook: 'Tilberedning:',
    by: 'Af',
    source: 'Kilde:',
    shoppingList: 'Indkøbsliste',
    addToShoppingList: '🛒 Tilføj til indkøbsliste',
    madeWithGoodTaste: 'Lavet med god smag',
    copy: '📋 Kopiér',
    copied: 'Kopieret!',
    reminders: '🍎 Påmindelser',
    selectAll: 'Vælg alle',
    deselectAll: 'Fravælg alle',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, locale: Locale = 'en'): string {
  return translations[locale]?.[key] ?? translations.en[key];
}

export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('locale') as Locale) || 'en';
}

export function setLocale(locale: Locale): void {
  localStorage.setItem('locale', locale);
  window.dispatchEvent(new CustomEvent('locale-changed', { detail: locale }));
}

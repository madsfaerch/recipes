import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useLocale } from '@/lib/useLocale';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  cuisine?: string;
  ingredients?: string[];
  shoppingIngredients?: string[];
  author?: string;
  image?: string;
  cookTime?: string;
  prepTime?: string;
}

interface Props {
  recipes: Recipe[];
}

export default function RecipeSearch({ recipes }: Props) {
  const [query, setQuery] = useState('');
  const { t } = useLocale();

  const fuse = useMemo(
    () =>
      new Fuse(recipes, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'description', weight: 1 },
          { name: 'tags', weight: 1.5 },
          { name: 'cuisine', weight: 1 },
          { name: 'ingredients', weight: 0.8 },
          { name: 'shoppingIngredients', weight: 0.8 },
          { name: 'author', weight: 1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [recipes]
  );

  const results = query.trim()
    ? fuse.search(query).map((r) => r.item)
    : recipes;

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-spice/30 focus:border-spice/40 shadow-sm transition-all"
        />
      </div>

      {results.length === 0 && query.trim() && (
        <p className="text-stone-400 text-center py-8">{t('noRecipesFound')} "{query}"</p>
      )}

      <div className="grid gap-6">
        {results.map((recipe) => (
          <a
            key={recipe.id}
            href={`/${recipe.id}/`}
            className="group block bg-white rounded-xl shadow-sm border border-stone-100 hover:shadow-md hover:border-spice/20 transition-all overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              {recipe.image && (
                <div className="sm:w-48 sm:min-w-[12rem] min-h-48 flex-shrink-0">
                  <img
                    src={`/.netlify/images?url=${encodeURIComponent(recipe.image)}&w=384&h=384&fit=cover&fm=webp&q=75`}
                    alt={recipe.title}
                    width={384}
                    height={384}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900 group-hover:text-spice transition-colors">
                    {recipe.title}
                  </h2>
                  {recipe.description && (
                    <p className="text-stone-500 mt-1">{recipe.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-stone-400">
                    {recipe.author && <span>{t('by')} {recipe.author}</span>}
                    {recipe.cookTime && <span>🔥 {recipe.cookTime}</span>}
                    {recipe.prepTime && <span>⏱ {recipe.prepTime}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {recipe.cuisine && (
                      <span className="text-xs px-2.5 py-1 bg-warm rounded-full text-stone-600">
                        {recipe.cuisine}
                      </span>
                    )}
                    {recipe.tags?.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-1 bg-stone-100 rounded-full text-stone-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-stone-300 group-hover:text-spice transition-colors text-xl mt-1">→</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

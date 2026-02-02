import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    type: z.string().optional(),
    cuisine: z.string().optional(),
    servings: z.string().optional(),
    prepTime: z.string().optional(),
    cookTime: z.string().optional(),
    author: z.string().optional(),
    shoppingIngredients: z.array(z.string()).optional(),
    source: z.string().optional(),
    image: z.string().optional(),
    added: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    locale: z.string().optional().default('en'),
    ref: z.string().optional(),
  }),
});

export const collections = { recipes };

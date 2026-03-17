/** Recipe photos bundled by Vite so they always load. */
const modules = import.meta.glob<{ default: string }>("./recipes/*.png", { eager: true });
const recipeImages: Record<string, string> = {};
for (const [path, mod] of Object.entries(modules)) {
  const match = path.match(/\/(\d+)\.png$/);
  if (match) recipeImages[match[1]] = mod.default;
}
export function getRecipeImageUrl(id: string): string {
  return recipeImages[id] ?? "";
}

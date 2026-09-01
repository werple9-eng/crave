/**
 * Photographs of the dishes.
 *
 * GENERATED FILE - do not hand-edit.
 *
 * Tier 1: 97 dishes have a vendored CC0 studio photograph in
 * src/assets/food/. These come from StockSnap and Rawpixel, where every image
 * is already a food photograph, so the failure mode below cannot happen.
 *
 * Tier 2: 0 dishes keep a Wikimedia Commons photo, hotlinked.
 *
 * Tier 3: everything else is drawn by FoodArt, which is also the fallback if
 * an image fails to load, so a card is never empty.
 *
 * 19 Commons photos were removed outright. Every one of them passed a
 * word-overlap check and was still wrong:
 *   Khao Soi - Vogel's pit viper, photographed at the Khao Soi Dao Wildlife Sanctuary.
 *   Apple Pie - an album cover - a portrait of the musician Kelly Lee Owens.
 *   Kofta Kebab - a lamb standing in a field, from the geograph.org.uk survey.
 *   Korean BBQ - a restaurant building and its car park.
 *   Smashburger - a Smashburger storefront.
 *   Hot Chocolate - people at a party, indoors.
 *   Bibimbap - a table of beer bottles.
 *   Arepas - a supermarket aisle.
 *   Cold Brew - the Oji brewing apparatus, not a drink.
 *   Beignets - a beignet-making machine.
 *   Carrot Cake - a slice sealed in a display case.
 *   Breakfast Hash - hash browns photographed among houseplants.
 *   Butter Chicken - a plastic takeout container.
 *   Clam Chowder - Manhattan style - tomato red, reads as tomato soup.
 *   Enchiladas - pale blobs under dark mole.
 *   Gnocchi - raw dough, uncooked.
 *   Banana Pudding - beige mush.
 *   Milkshake - a murky glass, unidentifiable.
 *   Chip Butty - flat pale bread, no contrast.
 *
 * That is why the source matters more than the filter.
 */

const LOCAL = import.meta.glob('../assets/food/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** Wikimedia Commons, hotlinked. */
const REMOTE: Record<string, string> = {
}

/** Vendored photos win over the remote ones. */
const vendored: Record<string, string> = {}
for (const [file, url] of Object.entries(LOCAL)) {
  const id = file.slice(file.lastIndexOf('/') + 1).replace(/.webp$/, '')
  vendored[id] = url
}

export const PHOTOS: Record<string, string> = { ...REMOTE, ...vendored }

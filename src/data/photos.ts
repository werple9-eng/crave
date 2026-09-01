/**
 * Photographs of the dishes.
 *
 * GENERATED FILE - do not hand-edit.
 *
 * Tier 1: 89 dishes have a vendored CC0 studio photograph in
 * src/assets/food/. These come from StockSnap and Rawpixel, where every image
 * is already a food photograph, so the failure mode below cannot happen.
 *
 * Tier 2: 191 dishes keep a Wikimedia Commons photo, hotlinked.
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
  'affogato': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Affogato.JPG/960px-Affogato.JPG",
  'aloo-gobi': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Aloo_gobi.jpg/960px-Aloo_gobi.jpg",
  'arancini': "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Arancini_002.jpg/960px-Arancini_002.jpg",
  'avocado-toast-eggs': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Fresh_Avocado_Toast_with_Egg.jpg/960px-Fresh_Avocado_Toast_with_Egg.jpg",
  'bacon-egg-cheese': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/McD-Bacon-Egg-Cheese-McGriddle.jpg/960px-McD-Bacon-Egg-Cheese-McGriddle.jpg",
  'bagel-lox': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Lox_Bagel_Sandwich_with_Cream_Cheese_Schmear_Onion_Tomato.jpg/960px-Lox_Bagel_Sandwich_with_Cream_Cheese_Schmear_Onion_Tomato.jpg",
  'baklava': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Baklava_-_Turkish_special%2C_80-ply.JPEG/960px-Baklava_-_Turkish_special%2C_80-ply.JPEG",
  'bangers-and-mash': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Bangers_and_mash_-_The_Perkin_Warbeck_2025-07-26.jpg/960px-Bangers_and_mash_-_The_Perkin_Warbeck_2025-07-26.jpg",
  'bao-buns': "https://upload.wikimedia.org/wikipedia/commons/9/99/07_Char_Siu_Bao_-_Steamed_Pork_Buns_-_East_Harbor_Seafood_Palace.jpg",
  'bbq-brisket': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Plate_of_brisket%2C_BBQ_ribs%2C_pulled_pork%2C_South_Texas_beans_and_pickled_jalape%C3%B1os_from_the_Pinkerton%27s_BBQ_San_Antonio_location.jpg/960px-Plate_of_brisket%2C_BBQ_ribs%2C_pulled_pork%2C_South_Texas_beans_and_pickled_jalape%C3%B1os_from_the_Pinkerton%27s_BBQ_San_Antonio_location.jpg",
  'beef-rendang': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Beef_Rendang..JPG/960px-Beef_Rendang..JPG",
  'beef-stroganoff': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Beef_stroganoff_with_pasta.jpg/960px-Beef_stroganoff_with_pasta.jpg",
  'birria-tacos': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Birria_tacos_at_Teddy%27s_Red_Tacos_in_Venice%2C_California.jpg/960px-Birria_tacos_at_Teddy%27s_Red_Tacos_in_Venice%2C_California.jpg",
  'biryani': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Chicken_biriyani-_My_cafe_restaurant_-_Meghalaya_DSC_009.jpg/960px-Chicken_biriyani-_My_cafe_restaurant_-_Meghalaya_DSC_009.jpg",
  'biscuits-gravy': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Biscuits_and_sausage_gravy_%288006401964%29.jpg/960px-Biscuits_and_sausage_gravy_%288006401964%29.jpg",
  'bolognese': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Tagliatelle_rag%C3%B9_bolognese_01.jpg/960px-Tagliatelle_rag%C3%B9_bolognese_01.jpg",
  'bouillabaisse': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/20250903_Bouillabaisse_in_Khimki.jpg/960px-20250903_Bouillabaisse_in_Khimki.jpg",
  'breakfast-ramen': "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Breakfast_ramen_%285950345565%29.jpg/960px-Breakfast_ramen_%285950345565%29.jpg",
  'breakfast-sandwich-bagel': "https://upload.wikimedia.org/wikipedia/commons/8/8b/Sausage_Taylor_Ham_Egg_Cheese_on_Pumpernickel_Bagel%2Cjpg.jpg",
  'breakfast-tacos': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Breakfast_tacos_2018.jpg/960px-Breakfast_tacos_2018.jpg",
  'brownie-sundae': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BROWNIE_SUNDAE.jpg/960px-BROWNIE_SUNDAE.jpg",
  'bubble-tea': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pearl_Milk_Tea_in_Chun_Shui_Tang.jpg/960px-Pearl_Milk_Tea_in_Chun_Shui_Tang.jpg",
  'budae-jjigae': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Korean_stew-Budae_jjigae-01.jpg/960px-Korean_stew-Budae_jjigae-01.jpg",
  'buddha-bowl': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/BuddhaBowlLot.jpg/960px-BuddhaBowlLot.jpg",
  'bulgogi-bowl': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Korean_Beef_Bulgogi_Rice_Bowl_%2834817154336%29.jpg/960px-Korean_Beef_Bulgogi_Rice_Bowl_%2834817154336%29.jpg",
  'burnt-ends': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Brisket_Burnt_Ends_-_52598851404.jpg/960px-Brisket_Burnt_Ends_-_52598851404.jpg",
  'burrito-bowl': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Steak_burrito_bowl_at_La_Casa_Restaurant_in_Sonoma%2C_California_-_Sarah_Stierch_03.jpg/960px-Steak_burrito_bowl_at_La_Casa_Restaurant_in_Sonoma%2C_California_-_Sarah_Stierch_03.jpg",
  'cacio-e-pepe': "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Spaghetti%2C_cacio_e_pepe_%26_bitter_leaf_salad_-_Tutto_2024-04-04.jpg/960px-Spaghetti%2C_cacio_e_pepe_%26_bitter_leaf_salad_-_Tutto_2024-04-04.jpg",
  'caesar-salad': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Caesar_salad_with_chicken%2C_homemade_-_Massachusetts.jpg/960px-Caesar_salad_with_chicken%2C_homemade_-_Massachusetts.jpg",
  'cao-lau': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Cao_Lau_Hoi_An.JPG/960px-Cao_Lau_Hoi_An.JPG",
  'carne-asada-tacos': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/960px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg",
  'cassoulet': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Bowl_of_cassoulet.JPG/960px-Bowl_of_cassoulet.JPG",
  'ceviche': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Ceviche_del_Per%C3%BA.jpg/960px-Ceviche_del_Per%C3%BA.jpg",
  'chana-masala': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chana_Masala_-_Mohammed_-_Spice_Of_Life_2024-05-27.jpg/960px-Chana_Masala_-_Mohammed_-_Spice_Of_Life_2024-05-27.jpg",
  'char-kway-teow': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Char_kway_teow_%28kuetiau_goreng%29_of_Dann_Char_Kuey_Teow_at_Permatang_Tok_Jaya%2C_SPU_20240915_183329.jpg/960px-Char_kway_teow_%28kuetiau_goreng%29_of_Dann_Char_Kuey_Teow_at_Permatang_Tok_Jaya%2C_SPU_20240915_183329.jpg",
  'char-siu': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Char_Siu_%26_Fried_Egg_with_Rice.jpg/960px-Char_Siu_%26_Fried_Egg_with_Rice.jpg",
  'cheese-toastie': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/-2022-02-16_Cheese_and_onion_toastie_sandwich%2C_Trimingham%2C_Norfolk.JPG/960px--2022-02-16_Cheese_and_onion_toastie_sandwich%2C_Trimingham%2C_Norfolk.JPG",
  'chicken-and-waffles': "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Chicken_and_waffles_with_peaches_and_cream.jpg/960px-Chicken_and_waffles_with_peaches_and_cream.jpg",
  'chicken-parm': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Chicken_parmesan_mise_en_place.jpg/960px-Chicken_parmesan_mise_en_place.jpg",
  'chicken-pot-pie': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chicken_Pot_Pie%2C_cut_open.jpg/960px-Chicken_Pot_Pie%2C_cut_open.jpg",
  'chicken-shawarma-plate': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Chicken_Shawarma_%2894298%29.jpg/960px-Chicken_Shawarma_%2894298%29.jpg",
  'chicken-tenders': "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Chicken_tenders_and_french_fries_-_June_2023_-_Sarah_Stierch.jpg/960px-Chicken_tenders_and_french_fries_-_June_2023_-_Sarah_Stierch.jpg",
  'chicken-tikka-masala': "https://upload.wikimedia.org/wikipedia/commons/4/44/Chicken_Tikka_Masala_KellySue.JPG",
  'chicken-tortilla-soup': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Chicken_Tortilla_Soup.jpg/960px-Chicken_Tortilla_Soup.jpg",
  'chicken-wrap': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Grilled_Chicken_Wrap%2C_Steel_Magnolias%2C_Valdosta.JPG/960px-Grilled_Chicken_Wrap%2C_Steel_Magnolias%2C_Valdosta.JPG",
  'chili': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Chili_with_fried_ground_beef_and_roasted_cherry_tomatoes_-_Massachusetts.jpg/960px-Chili_with_fried_ground_beef_and_roasted_cherry_tomatoes_-_Massachusetts.jpg",
  'chimichurri-steak': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Steak_with_Chimichurri_Sauce_%2813316528445%29.jpg/960px-Steak_with_Chimichurri_Sauce_%2813316528445%29.jpg",
  'clam-bake': "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/New_England_clam_bake.jpg/960px-New_England_clam_bake.jpg",
  'clam-linguine': "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Linguine-alle-vongole.jpg/960px-Linguine-alle-vongole.jpg",
  'cobb-salad': "https://upload.wikimedia.org/wikipedia/commons/a/a6/Brown_Derby_Cobb_Salad_%282440195933%29.jpg",
  'com-tam': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Com-Tam-2008.jpg/960px-Com-Tam-2008.jpg",
  'congee': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Chinese_rice_congee.jpg/960px-Chinese_rice_congee.jpg",
  'congee-breakfast': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/GD_%E5%BB%A3%E6%9D%B1_Guangdong_%E6%B2%B3%E6%BA%90%E5%B8%82_HeYuan_%E8%B6%8A%E7%8E%8B%E5%A4%A7%E9%81%93_YueWang_Avenue_Double_Tree_by_Hilton_Hotel_Open_Cafe_n_Restaurant_%E6%97%A9%E9%A4%90_breakfast_food_%E4%B8%AD%E5%BC%8F%E6%97%A9%E9%A4%90_Chinese_style_congee_egg_n_noodle_April_2026_N13P_12.jpg/960px-thumbnail.jpg",
  'congee-egg': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Toast_soldiers.JPG/960px-Toast_soldiers.JPG",
  'coq-au-vin': "https://upload.wikimedia.org/wikipedia/commons/7/75/Coq_au_Vin_6of7_%288735164745%29.jpg",
  'corn-dog': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Corn_dog_001.jpg/960px-Corn_dog_001.jpg",
  'cornish-pasty': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Cornish_pasty.jpeg/960px-Cornish_pasty.jpeg",
  'crab-legs': "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Snow_crab_legs_%2831760229455%29.jpg/960px-Snow_crab_legs_%2831760229455%29.jpg",
  'crab-rangoon': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Crab_Rangoon_IMG_4105.jpg/960px-Crab_Rangoon_IMG_4105.jpg",
  'crawfish-boil': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Crawfish_Boil_-_July_2017.jpg/960px-Crawfish_Boil_-_July_2017.jpg",
  'crispy-chicken-sandwich': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Crispy_chicken_sandwich_with_waffle_fries_and_cheese_sticks_served_undefined.jpg/960px-Crispy_chicken_sandwich_with_waffle_fries_and_cheese_sticks_served_undefined.jpg",
  'croissant': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Croissant_with_jam_and_butter_-_Little_Miss_Piggies.jpg/960px-Croissant_with_jam_and_butter_-_Little_Miss_Piggies.jpg",
  'croque-madame': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Croque_Monsieur_and_Croque_Madame_-_Milfey_Patisserie_2026-01-03.jpg/960px-Croque_Monsieur_and_Croque_Madame_-_Milfey_Patisserie_2026-01-03.jpg",
  'cuban-sandwich': "https://upload.wikimedia.org/wikipedia/commons/5/5f/Cuban_sandwiches.jpg",
  'dal-makhani': "https://upload.wikimedia.org/wikipedia/commons/f/f8/Dal_Makhani.jpg",
  'dan-dan-noodles': "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Dan-dan_noodles%2C_Shanghai.jpg/960px-Dan-dan_noodles%2C_Shanghai.jpg",
  'drunken-noodles': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Drunken_noodles_%28pad_kee_mao%29.jpg/960px-Drunken_noodles_%28pad_kee_mao%29.jpg",
  'eclair': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Giant_chocolate-glazed_%C3%A9clairs.jpg/960px-Giant_chocolate-glazed_%C3%A9clairs.jpg",
  'elote': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Elote_as%C3%A1ndose.jpg/960px-Elote_as%C3%A1ndose.jpg",
  'empanadas': "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Empanada_-_Stu_Spivack.jpg/960px-Empanada_-_Stu_Spivack.jpg",
  'etouffee': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Crawfish_%C3%A9touff%C3%A9e_at_the_Gumbo_Shop%2C_New_Orleans_January_2025.jpg/960px-Crawfish_%C3%A9touff%C3%A9e_at_the_Gumbo_Shop%2C_New_Orleans_January_2025.jpg",
  'falafel-plate': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Meatballs_and_falafel_balls_on_a_plate.jpg/960px-Meatballs_and_falafel_balls_on_a_plate.jpg",
  'fattoush': "https://upload.wikimedia.org/wikipedia/commons/9/93/Fattoush_mixed-salad.jpg",
  'feijoada': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Feijoada_%C3%A0_brasileira_-02.jpg/960px-Feijoada_%C3%A0_brasileira_-02.jpg",
  'fish-and-chips': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Fish_and_chips_plate_with_peas.jpg/960px-Fish_and_chips_plate_with_peas.jpg",
  'fish-pie': "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Bill%27s_Fish_Pie_-_Bill%27s%2C_Lewes_2026-07-03.jpg/960px-Bill%27s_Fish_Pie_-_Bill%27s%2C_Lewes_2026-07-03.jpg",
  'fish-tacos': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Fish_tacos_in_Pittsburg.jpg/960px-Fish_tacos_in_Pittsburg.jpg",
  'french-onion-soup': "https://upload.wikimedia.org/wikipedia/commons/b/be/French_Onion_Soup%2C_Applebee%27s.jpg",
  'fried-catfish': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Deep_fried_catfish.jpg/960px-Deep_fried_catfish.jpg",
  'gambas-al-ajillo': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gambas_al_ajillo%2C_2024.jpg/960px-Gambas_al_ajillo%2C_2024.jpg",
  'gelato': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Korean_aromatic_rice_%26_pistachio_gelato.jpg/960px-Korean_aromatic_rice_%26_pistachio_gelato.jpg",
  'grilled-cheese-soup': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Tomato_soup_and_grilled_cheese.JPG/960px-Tomato_soup_and_grilled_cheese.JPG",
  'grilled-octopus': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Grilled_octopus_at_Other_Mama.jpg/960px-Grilled_octopus_at_Other_Mama.jpg",
  'gumbo': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Gumbo-_Stu_Spivak.jpg/960px-Gumbo-_Stu_Spivak.jpg",
  'gyoza': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Gyoza_no_Antei_-_3.jpg/960px-Gyoza_no_Antei_-_3.jpg",
  'gyudon': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Gyudon_curry_by_motomachi24_in_Sapporo%2C_Hokkaido.jpg/960px-Gyudon_curry_by_motomachi24_in_Sapporo%2C_Hokkaido.jpg",
  'har-gow': "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Har_Gow_at_Canal_Luna_restaurant%2C_InterContinental_Guangzhou_Exhibition_Center_%2820180923125523%29.jpg/960px-Har_Gow_at_Canal_Luna_restaurant%2C_InterContinental_Guangzhou_Exhibition_Center_%2820180923125523%29.jpg",
  'horchata': "https://upload.wikimedia.org/wikipedia/commons/5/5b/ManekiNeko_horchata_jar.jpg",
  'hot-dog': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Hot_dogs_with_relish_and_mustard.jpg/960px-Hot_dogs_with_relish_and_mustard.jpg",
  'hot-wings': "https://upload.wikimedia.org/wikipedia/commons/8/81/Homemade_buffalo_wings.jpg",
  'huevos-divorciados': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Huevos_divorciados.jpg/960px-Huevos_divorciados.jpg",
  'huevos-rancheros': "https://upload.wikimedia.org/wikipedia/commons/6/63/Huevos_rancheros_Amor_y_Tacos_2015.jpg",
  'hummus-bowl': "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Homemade_hummus_and_pita_03.jpg/960px-Homemade_hummus_and_pita_03.jpg",
  'jalapeno-poppers': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Jalape%C3%B1o_poppers.jpg/960px-Jalape%C3%B1o_poppers.jpg",
  'japchae': "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Homemade_Japchae%2C_Dhaka_03.jpg/960px-Homemade_Japchae%2C_Dhaka_03.jpg",
  'jerk-chicken': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Jerk_chicken_july_05.jpg/960px-Jerk_chicken_july_05.jpg",
  'jjajangmyeon': "https://upload.wikimedia.org/wikipedia/commons/2/23/Jjajangmyeon_%EC%A7%9C%EC%9E%A5%EB%A9%B4_%E7%82%B8%E9%86%AC%E9%BA%B5.jpg",
  'katsu-curry': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Pumpkin_Katsu_Curry_and_Chicken_Katsu_Curry_-_Sunoso.jpg/960px-Pumpkin_Katsu_Curry_and_Chicken_Katsu_Curry_-_Sunoso.jpg",
  'katsu-sando': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Katsu_sando_%2837686169334%29.jpg/960px-Katsu_sando_%2837686169334%29.jpg",
  'kebab-shop-wrap': "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Doner_Kebab%2C_sols_carn_i_lletuga..jpg/960px-Doner_Kebab%2C_sols_carn_i_lletuga..jpg",
  'key-lime-pie': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Key_lime_pie_%288156981503%29.jpg/960px-Key_lime_pie_%288156981503%29.jpg",
  'kimbap': "https://upload.wikimedia.org/wikipedia/commons/0/03/Fishcake_Kimbap_-koreanfood_%2816827948540%29.jpg",
  'kimchi-stew': "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Korean_stew_dish_-_Kimchi-jjigae_Kimchi_Stew_2019_%2801%29.jpg/960px-Korean_stew_dish_-_Kimchi-jjigae_Kimchi_Stew_2019_%2801%29.jpg",
  'korean-corn-dog': "https://upload.wikimedia.org/wikipedia/commons/a/ac/Korean_potato_corn_dog.jpg",
  'korean-fried-chicken': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Korean_fried_chicken_240206.jpg/960px-Korean_fried_chicken_240206.jpg",
  'korma': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Chicken_Korma.JPG/960px-Chicken_Korma.JPG",
  'kung-pao-chicken': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Kung_Pao_chicken_%28western_version%29_-1.jpg/960px-Kung_Pao_chicken_%28western_version%29_-1.jpg",
  'lo-mein': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Braised_Mushroom_Lo_Mein_with_Soup_-_CK_Bistro.jpg/960px-Braised_Mushroom_Lo_Mein_with_Soup_-_CK_Bistro.jpg",
  'loaded-baked-potato': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Loaded_Potato_Cake_with_Mushrooms_%26_baked_beans_-_No.16_2024-03-04.jpg/960px-Loaded_Potato_Cake_with_Mushrooms_%26_baked_beans_-_No.16_2024-03-04.jpg",
  'lobster-bisque': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Lobster_bisque.jpg/960px-Lobster_bisque.jpg",
  'lobster-mac': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Jamaican_lobster_mac_%26_cheese.jpg/960px-Jamaican_lobster_mac_%26_cheese.jpg",
  'lobster-roll': "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Lobster_Roll_at_the_Lobster_Claw%2C_Bar_Harbor.jpg/960px-Lobster_Roll_at_the_Lobster_Claw%2C_Bar_Harbor.jpg",
  'mac-and-cheese': "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Pulled_pork%2C_baked_beans_and_mac_%26_cheese_from_Peg_Leg_Porker_in_Nashville%2C_TN.jpg/960px-Pulled_pork%2C_baked_beans_and_mac_%26_cheese_from_Peg_Leg_Porker_in_Nashville%2C_TN.jpg",
  'manakish': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Manakish_Za%27atar.jpg/960px-Manakish_Za%27atar.jpg",
  'mapo-tofu': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Authentic_Mapo_Tofu.jpg/960px-Authentic_Mapo_Tofu.jpg",
  'massaman-curry': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Beef_Massaman_curry_with_brown_rice.jpg/960px-Beef_Massaman_curry_with_brown_rice.jpg",
  'matzo-ball-soup': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Matzo_ball_soup_2.jpg/960px-Matzo_ball_soup_2.jpg",
  'meatball-sub': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Pizza_Meatball_sub%2C_Firehouse_Subs.jpg/960px-Pizza_Meatball_sub%2C_Firehouse_Subs.jpg",
  'meatloaf': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Meatloaf_With_Cauliflower_Pumpkin_Mash_And_Avocado_%2867915371%29.jpeg/960px-Meatloaf_With_Cauliflower_Pumpkin_Mash_And_Avocado_%2867915371%29.jpeg",
  'minestrone': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Minestrone_soup.jpg/960px-Minestrone_soup.jpg",
  'miso-soup': "https://upload.wikimedia.org/wikipedia/commons/5/55/Miso_soup_and_Rice_20141027.jpg",
  'moussaka': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Meat_Moussaka_-_Kouzina%2C_Brighton_2023-11-24.jpg/960px-Meat_Moussaka_-_Kouzina%2C_Brighton_2023-11-24.jpg",
  'mozzarella-sticks': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mozzarella_Sticks_at_Mobtown_Ballroom.jpg/960px-Mozzarella_Sticks_at_Mobtown_Ballroom.jpg",
  'mujadara': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Baba_ghannouj%2C_mujadara%2C_hoummos%2C_and_tabbouleh_-_Cambridge%2C_MA.jpg/960px-Baba_ghannouj%2C_mujadara%2C_hoummos%2C_and_tabbouleh_-_Cambridge%2C_MA.jpg",
  'mushroom-risotto': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Mushroom_Risotto_%284789415965%29.jpg/960px-Mushroom_Risotto_%284789415965%29.jpg",
  'nachos': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Veg_loaded_nachos_made_by_me.jpg/960px-Veg_loaded_nachos_made_by_me.jpg",
  'nashville-hot-chicken': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nashville_Hot_Chicken_Drumsticks.jpg/960px-Nashville_Hot_Chicken_Drumsticks.jpg",
  'nasi-lemak': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nasi_lemak_joh.jpg/960px-Nasi_lemak_joh.jpg",
  'nicoise-salad': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Salade_ni%C3%A7oise_%287545098258%29.jpg/960px-Salade_ni%C3%A7oise_%287545098258%29.jpg",
  'okonomiyaki': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Okonomiyaki_001.jpg/960px-Okonomiyaki_001.jpg",
  'omelette': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cheese_%26_Mushroom_Omelette_-_The_Bystander_Cafe_2023-08-07.jpg/960px-Cheese_%26_Mushroom_Omelette_-_The_Bystander_Cafe_2023-08-07.jpg",
  'onigiri': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Japanese_rice_balls_%28onigiri%29.jpg/960px-Japanese_rice_balls_%28onigiri%29.jpg",
  'onion-rings': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Onion_rings_served_in_Fort_William.jpg/960px-Onion_rings_served_in_Fort_William.jpg",
  'osso-buco': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Osso_buco%2C_Breckenheim.jpg/960px-Osso_buco%2C_Breckenheim.jpg",
  'oyakodon': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Oyakodon_003.jpg/960px-Oyakodon_003.jpg",
  'oysters': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Raw_Oysters_%286639229789%29.jpg/960px-Raw_Oysters_%286639229789%29.jpg",
  'patatas-bravas': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Patatas_bravas._Tapa_de_bar_%28Espa%C3%B1a%29.jpg/960px-Patatas_bravas._Tapa_de_bar_%28Espa%C3%B1a%29.jpg",
  'patty-melt': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Patty_melt_layers.jpg/960px-Patty_melt_layers.jpg",
  'pav-bhaji': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Pav_bhaji_SWW.jpg/960px-Pav_bhaji_SWW.jpg",
  'pecan-pie': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Pecan_pie%2C_November_2010.jpg/960px-Pecan_pie%2C_November_2010.jpg",
  'peking-duck': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Peking_duck_pancake.jpg/960px-Peking_duck_pancake.jpg",
  'peking-duck-pancakes': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Braised_Lamb_Neck_%E2%80%93_Scallion_Pancakes%2C_Pickled_Vegetables.jpg/960px-Braised_Lamb_Neck_%E2%80%93_Scallion_Pancakes%2C_Pickled_Vegetables.jpg",
  'philly-cheesesteak': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Philly_Cheesesteak_-_5449870218.jpg/960px-Philly_Cheesesteak_-_5449870218.jpg",
  'pierogi': "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pierogi%2C_Gniezno%2C_Polonia3.jpg/960px-Pierogi%2C_Gniezno%2C_Polonia3.jpg",
  'poke-bowl': "https://upload.wikimedia.org/wikipedia/commons/8/87/Uwajimaya_Poke_Bowl_with_salmon%2C_tuna%2C_ginger%2C_and_2_scoops_of_rice.jpg",
  'poke-burrito': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Poke_Burrito_-_33348273325.jpg/960px-Poke_Burrito_-_33348273325.jpg",
  'pot-roast': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Pot_roast_2.jpg/960px-Pot_roast_2.jpg",
  'potstickers': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Sizzling_Pork_Potstickers%2C_Pachamama_Pork%2C_Fennel.jpg/960px-Sizzling_Pork_Potstickers%2C_Pachamama_Pork%2C_Fennel.jpg",
  'profiteroles': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Postre_de_profiteroles.jpg/960px-Postre_de_profiteroles.jpg",
  'quiche-lorraine': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Quiche_lorraine_01.JPG/960px-Quiche_lorraine_01.JPG",
  'ramen-tsukemen': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Tsukemen_%28Dipping_Ramen%29_-_Goemon_Ramen_Bar_2023-07-16.jpg/960px-Tsukemen_%28Dipping_Ramen%29_-_Goemon_Ramen_Bar_2023-07-16.jpg",
  'red-beans-rice': "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Red_Beans_and_Rice.jpg/960px-Red_Beans_and_Rice.jpg",
  'reuben': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Reuben_%28Francisco_de_Zurbar%C3%A1n%29.jpg/960px-Reuben_%28Francisco_de_Zurbar%C3%A1n%29.jpg",
  'rice-pudding': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/02023_1271_Rice_puddings.jpg/960px-02023_1271_Rice_puddings.jpg",
  'rogan-josh': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Rogan_josh02.jpg/960px-Rogan_josh02.jpg",
  'saag-paneer': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Saag_paneer.jpg/960px-Saag_paneer.jpg",
  'salmon-nigiri': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Salmon_nigiri_sushi.jpg/960px-Salmon_nigiri_sushi.jpg",
  'sashimi-plate': "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Sashimi_plate_-_Massachusetts.jpg/960px-Sashimi_plate_-_Massachusetts.jpg",
  'scrambled-eggs-toast': "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Scrambled_eggs_on_toast_-_Joe%27s_Cafe_2024-04-14.jpg/960px-Scrambled_eggs_on_toast_-_Joe%27s_Cafe_2024-04-14.jpg",
  'shakshuka-green': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Green_shakshuka_from_Oren%27s_Hummus.jpg/960px-Green_shakshuka_from_Oren%27s_Hummus.jpg",
  'shrimp-and-grits': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Shrimp_and_grits_at_the_Green_Goddess.jpg/960px-Shrimp_and_grits_at_the_Green_Goddess.jpg",
  'shrimp-scampi': "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Spicy_shrimp_scampi_%283280336102%29.jpg/960px-Spicy_shrimp_scampi_%283280336102%29.jpg",
  'siu-mai': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Salt_and_Pepper_Siu_Mai_%288_pcs%29_-_CK_Bistro_2025-03-04.jpg/960px-Salt_and_Pepper_Siu_Mai_%288_pcs%29_-_CK_Bistro_2025-03-04.jpg",
  'smoked-sausage': "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Sauerkraut_with_smoked_pork_sausage_and_mustard_-_Massachusetts.jpg/960px-Sauerkraut_with_smoked_pork_sausage_and_mustard_-_Massachusetts.jpg",
  'soft-pretzel': "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Auntie_Anne%27s_Classic_Soft_Frozen_Pretzels_-_Sarah_Stierch.jpg/960px-Auntie_Anne%27s_Classic_Soft_Frozen_Pretzels_-_Sarah_Stierch.jpg",
  'soup-dumplings': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Truffle_Soup_Dumplings_at_Din_Tai_Fung.jpg/960px-Truffle_Soup_Dumplings_at_Din_Tai_Fung.jpg",
  'souvlaki': "https://upload.wikimedia.org/wikipedia/commons/6/6e/Souvlaki_457.jpg",
  'spanakopita': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Spanakopita.jpg/960px-Spanakopita.jpg",
  'spicy-miso-ramen': "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Takeout_spicy_miso_ramen.jpg/960px-Takeout_spicy_miso_ramen.jpg",
  'spicy-tuna-crispy-rice': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Spicy_Tuna_on_Crispy_Rice_%2816231286314%29.jpg/960px-Spicy_Tuna_on_Crispy_Rice_%2816231286314%29.jpg",
  'split-pea-soup': "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Amy%27s_split_pea_soup.jpg/960px-Amy%27s_split_pea_soup.jpg",
  'spring-rolls': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Golden_Vegetable_Spring_Rolls_Served_with_Dipping_Sauce.jpg/960px-Golden_Vegetable_Spring_Rolls_Served_with_Dipping_Sauce.jpg",
  'steak-frites': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Steak_frites_at_The_Bar_at_MacArthur_Place_in_Sonoma_-_Sarah_Stierch.jpg/960px-Steak_frites_at_The_Bar_at_MacArthur_Place_in_Sonoma_-_Sarah_Stierch.jpg",
  'summer-rolls': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Summer_rolls%2C_chicken%2C_etc_%2C_on_salad_-_Cambridge%2C_MA.jpg/960px-Summer_rolls%2C_chicken%2C_etc_%2C_on_salad_-_Cambridge%2C_MA.jpg",
  'sundubu': "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Korean_food-Gyeongju-Sundubu_jjigae-02.jpg/960px-Korean_food-Gyeongju-Sundubu_jjigae-02.jpg",
  'sushi-lunch-set': "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Sushi_lunch_%EF%BF%A5980%2C_Nadeshico-Sushi%2C_Sotokanda_3_%28%E3%81%AA%E3%81%A7%E3%81%97%E3%81%93%E5%AF%BF%E5%8F%B8%E3%83%A9%E3%83%B3%E3%83%81980%E5%86%86%29_%282011-04-06_13.34.21_by_yuiseki_aoba%29.jpg/960px-Sushi_lunch_%EF%BF%A5980%2C_Nadeshico-Sushi%2C_Sotokanda_3_%28%E3%81%AA%E3%81%A7%E3%81%97%E3%81%93%E5%AF%BF%E5%8F%B8%E3%83%A9%E3%83%B3%E3%83%81980%E5%86%86%29_%282011-04-06_13.34.21_by_yuiseki_aoba%29.jpg",
  'tabbouleh': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flickr_-_cyclonebill_-_Tabbouleh.jpg/960px-Flickr_-_cyclonebill_-_Tabbouleh.jpg",
  'taiyaki': "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Taiyaki_005.jpg/960px-Taiyaki_005.jpg",
  'tamales': "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Tamales_Mexicanos_sweet_corn_tamales_01.jpg/960px-Tamales_Mexicanos_sweet_corn_tamales_01.jpg",
  'tandoori-prawns': "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Tandoori_prawns_-_Napier%2C_New_Zealand.jpg/960px-Tandoori_prawns_-_Napier%2C_New_Zealand.jpg",
  'tempura-udon': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tempura-Udon-Nudeln.JPG/960px-Tempura-Udon-Nudeln.JPG",
  'thai-iced-tea': "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Thai_iced_milk_tea.jpg/960px-Thai_iced_milk_tea.jpg",
  'tonkotsu-ramen': "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Tonkotsu_Ramen_-_Goemon_Ramen_Bar_2023-06-06.jpg/960px-Tonkotsu_Ramen_-_Goemon_Ramen_Bar_2023-06-06.jpg",
  'tres-leches': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Tres_leches_cake.jpg/960px-Tres_leches_cake.jpg",
  'tteokbokki': "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Korean.snacks-Tteokbokki-08.jpg/960px-Korean.snacks-Tteokbokki-08.jpg",
  'tuna-melt': "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tuna_melt_-_Massachusetts.jpg/960px-Tuna_melt_-_Massachusetts.jpg",
  'turkey-dinner': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Sunday_Roast_Turkey_Dinner_Great_Easton_Essex_darker.jpg/960px-Sunday_Roast_Turkey_Dinner_Great_Easton_Essex_darker.jpg",
  'vermicelli-bowl': "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Bowl_of_Oyster_vermicelli_at_Taipei_19970330.jpg/960px-Bowl_of_Oyster_vermicelli_at_Taipei_19970330.jpg",
  'vindaloo': "https://upload.wikimedia.org/wikipedia/commons/f/fd/Pork_Vindaloo.jpg",
  'waffles': "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Belgian_Waffle_Co_%282024%29_02.jpg/960px-Belgian_Waffle_Co_%282024%29_02.jpg",
  'yakitori': "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cooking_yakitori.jpg/960px-Cooking_yakitori.jpg",
}

/** Vendored photos win over the remote ones. */
const vendored: Record<string, string> = {}
for (const [file, url] of Object.entries(LOCAL)) {
  const id = file.slice(file.lastIndexOf('/') + 1).replace(/.webp$/, '')
  vendored[id] = url
}

export const PHOTOS: Record<string, string> = { ...REMOTE, ...vendored }

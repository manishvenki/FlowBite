/**
 * BiteFlow Food Image System
 * 
 * Provides deterministic, curated, high-resolution food photography for BiteFlow dishes.
 * Ensures different food items receive distinct, dish-appropriate images instead of sharing
 * the same category placeholder.
 */

// Global BiteFlow fallback image for unexpected edge cases
export const DEFAULT_FOOD_FALLBACK =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

// Known shared category placeholders in seed/database that caused duplicate food images
const SHARED_CATEGORY_PHOTO_IDS = [
  'photo-1563379091339-03b21ab4a4f8',
  'photo-1589301760014-d929f3979dbc',
  'photo-1585937421612-70a008356fbe',
  'photo-1601050690597-df0568f70950',
  'photo-1599488615731-7e5c2823ff28',
  'photo-1525755662778-989d0524087e',
  'photo-1579954115545-a95591f28bfc',
  'photo-1514432324607-a09d9b4aefdd',
  'photo-1513104890138-7c749659a591',
];

// Curated collections of verified, appetizing Unsplash food photography
const FOOD_IMAGE_CATALOG = {
  pizza: [
    'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80', // Margherita with basil
    'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80', // Pepperoni slice
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80', // Farmhouse veggie
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', // Woodfired crust
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', // Cheese pull
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80', // Gourmet artisan
    'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=80', // Mushroom & herbs
    'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80', // Mediterranean
  ],
  burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', // Classic cheeseburger
    'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80', // Crispy chicken burger
    'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=600&q=80', // Veggie craft burger
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80', // Double smash burger
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', // Loaded bistro burger
    'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?auto=format&fit=crop&w=600&q=80', // Brioche bun burger
    'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80', // Spicy crunch burger
  ],
  pasta: [
    'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80', // Fettuccine Alfredo
    'https://images.unsplash.com/photo-1621996346565-e3d5d6281220?auto=format&fit=crop&w=600&q=80', // Penne Arrabiata
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', // Spaghetti Bolognese
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80', // Creamy herb pasta
    'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80', // Rigatoni pesto
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80', // Gourmet tagliatelle
  ],
  biryani: [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', // Royal Dum Biryani
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', // Mutton Dum Biryani
    'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=600&q=80', // Veg Paneer Biryani
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80', // Saffron Basmati Pulao
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', // Veg Fried Rice
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', // Chicken Fried Rice
  ],
  dosa: [
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', // Crispy Ghee Roast Dosa
    'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80', // Masala Dosa with chutneys
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', // Steamed Idli & Vada
    'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', // South Indian Thali
  ],
  friedChicken: [
    'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80', // Crispy Fried Chicken
    'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80', // Spicy Chicken 65
    'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80', // Golden Chicken Tenders
    'https://images.unsplash.com/photo-1527477378426-ff065d6666ba?auto=format&fit=crop&w=600&q=80', // Fiery Hot Wings
  ],
  tacos: [
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80', // Street Corn Tacos
    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80', // Mission Burrito
    'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80', // Loaded Nachos
    'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=600&q=80', // Crispy Tacos
  ],
  tandoor: [
    'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80', // Tandoori Chicken Tikka
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80', // Charred Paneer Tikka
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', // Grilled Seekh Kebab
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80', // Masala Peri Peri Fries
  ],
  northIndian: [
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', // Paneer Butter Masala
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80', // Butter Chicken Handi
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', // Rich Dal Makhani
    'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80', // Blistered Butter Naan
    'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80', // Chole Bhature
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', // Shahi Mughlai Curry
  ],
  chinese: [
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', // Hakka Noodles
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80', // Gobi Manchurian
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', // Steamed Dumplings / Momos
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', // Asian Noodle Bowl
    'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80', // Spring Rolls
  ],
  dessert: [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', // Dark Chocolate Cake
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80', // Sundae Ice Cream
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', // Fudgy Brownie
    'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80', // Gulab Jamun / Indian Sweets
    'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80', // Waffles with berries
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80', // Cheesecake
  ],
  coffee: [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', // Davarah Filter Coffee
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', // Iced Frappe Latte
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', // Spiced Masala Chai
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', // Sparkling Fresh Lime Soda
    'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80', // Milkshake & Smoothie
  ],
  sandwich: [
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', // Club Sandwich
    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80', // Kathi Roll Wrap
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', // Grilled Panini
  ],
  salad: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', // Garden Harvest Salad
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', // Green Protein Bowl
  ],
};

/**
 * Deterministic integer hash from string.
 * Always returns the exact same number for the same string across renders.
 */
export const stringHash = (str: string): number => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
};

export interface FoodImageInput {
  _id?: string;
  name?: string;
  image?: string;
  description?: string;
  categoryId?: any;
  categoryName?: string;
  cuisine?: string;
}

/**
 * Detects the culinary category from food title, category name, or description.
 */
const detectCategoryKey = (input: FoodImageInput): keyof typeof FOOD_IMAGE_CATALOG => {
  const name = (input.name || '').toLowerCase();
  const desc = (input.description || '').toLowerCase();
  const cat = (
    typeof input.categoryId === 'object' && input.categoryId !== null
      ? (input.categoryId as any).name || ''
      : input.categoryName || ''
  ).toLowerCase();
  const cuisine = (input.cuisine || '').toLowerCase();

  const combined = `${name} ${desc} ${cat} ${cuisine}`;

  if (/pizza|margherita|pepperoni|calzone|crust/.test(combined)) return 'pizza';
  if (/burger|cheeseburger|patty|slider|whopper/.test(combined)) return 'burger';
  if (/pasta|spaghetti|penne|alfredo|arrabiata|carbonara|macaroni|lasagna|ravioli/.test(combined)) return 'pasta';
  if (/biryani|pulao|pulav|fried rice|jeera rice|khichdi|rice/.test(combined)) return 'biryani';
  if (/dosa|idli|vada|uttapam|sambar|rasam|thali|south indian/.test(combined)) return 'dosa';
  if (/fried chicken|chicken 65|nugget|tenders|wings|crispy chicken/.test(combined)) return 'friedChicken';
  if (/taco|burrito|nacho|quesadilla|fajita|mexican|enchilada/.test(combined)) return 'tacos';
  if (/tikka|kebab|tandoor|tandoori|paneer tikka|starter/.test(combined)) return 'tandoor';
  if (/butter chicken|paneer butter|dal makhani|chole|naan|roti|paratha|curry|masala|korma/.test(combined)) return 'northIndian';
  if (/noodle|manchurian|chow mein|momo|dumpling|ramen|chinese|schezwan|dim sum/.test(combined)) return 'chinese';
  if (/cake|ice cream|brownie|dessert|gulab jamun|sweet|waffle|pancake|cheesecake|tiramisu|pastry/.test(combined)) return 'dessert';
  if (/coffee|latte|chai|tea|espresso|frappe|soda|shake|smoothie|juice|lassi|beverage|drink/.test(combined)) return 'coffee';
  if (/sandwich|wrap|roll|shawarma|panini|sub/.test(combined)) return 'sandwich';
  if (/salad|quinoa|healthy|bowl/.test(combined)) return 'salad';

  return 'biryani';
};

/**
 * Resolves a unique, appropriate, deterministic image for any food item.
 *
 * Rules:
 * 1. If food has an uploaded base64 data-URL or a custom non-shared image, prioritize it.
 * 2. If food's image is missing, empty, or one of the shared category placeholders that caused
 *    Pizza A, B, C to share the same image, select a distinct curated photo for the dish.
 * 3. Uses a deterministic hash of (food.name + food._id) so Pizza A, B, C receive distinct
 *    images, and the same food item never changes its photo across renders.
 */
export const getFoodImage = (food?: FoodImageInput | null): string => {
  if (!food) return DEFAULT_FOOD_FALLBACK;

  const currentImg = (food.image || '').trim();

  // If the image is a custom data URL (uploaded locally in admin), use it directly
  if (currentImg.startsWith('data:image/')) {
    return currentImg;
  }

  // Check if current image is one of the generic category URLs that caused identical photos
  const isSharedPlaceholder =
    !currentImg ||
    SHARED_CATEGORY_PHOTO_IDS.some((id) => currentImg.includes(id));

  // If the food has an external custom URL that is NOT a duplicate placeholder, keep it
  if (currentImg.startsWith('http') && !isSharedPlaceholder) {
    return currentImg;
  }

  // Detect food category and pick a deterministic item image
  const categoryKey = detectCategoryKey(food);
  const images = FOOD_IMAGE_CATALOG[categoryKey] || FOOD_IMAGE_CATALOG.biryani;

  // Combine food name and ID for stable hashing
  const hashKey = `${food.name || 'food'}_${food._id || ''}`;
  const index = stringHash(hashKey) % images.length;

  return images[index] || DEFAULT_FOOD_FALLBACK;
};

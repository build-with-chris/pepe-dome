/**
 * Unsplash Placeholder Images
 *
 * Organized by category for easy access throughout the application
 * Format: https://images.unsplash.com/photo-[ID]?w=[width]&q=80&auto=format
 */

export const UNSPLASH_IMAGES = {
  /**
   * Performance & Shows - Zirkus, Artistik, Theater
   */
  shows: [
    'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80&auto=format', // Aerial silks performer
    'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1200&q=80&auto=format', // Circus tent
    'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1200&q=80&auto=format', // Concert crowd
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80&auto=format', // Stage performance
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80&auto=format', // Stage lights
  ],

  /**
   * Workshops & Training - Akrobatik, Fitness, Yoga
   */
  workshops: [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80&auto=format', // Yoga class
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80&auto=format', // Acrobatics training
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80&auto=format', // Gym training
    'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80&auto=format', // Dance workshop
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80&auto=format', // Group training
  ],

  /**
   * Events & Festivals - Outdoor, Community
   */
  events: [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80&auto=format', // Event crowd
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&q=80&auto=format', // Outdoor festival
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80&auto=format', // Summer festival
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80&auto=format', // Music festival
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&q=80&auto=format', // Night event
  ],

  /**
   * Dome & Venue - Architecture, Space
   */
  venue: [
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80&auto=format', // Geodesic dome
    'https://images.unsplash.com/photo-1519167758481-83f29da8c19f?w=1200&q=80&auto=format', // Modern architecture
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80&auto=format', // Interior space
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80&auto=format', // Concert venue
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80&auto=format', // Theater interior
  ],

  /**
   * News & Articles - General content
   */
  news: [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80&auto=format', // Theater
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80&auto=format', // People
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80&auto=format', // Creative space
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&q=80&auto=format', // Community
    'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=1200&q=80&auto=format', // Artistic
  ],

  /**
   * Artists & Performers - People, Portraits
   */
  artists: [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80&auto=format', // Performer
    'https://images.unsplash.com/photo-1520295187453-cd239786490c?w=1200&q=80&auto=format', // Artist portrait
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80&auto=format', // Person portrait
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format', // Person portrait
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80&auto=format', // Performer
  ],

  /**
   * Food & Drinks - Catering, Social
   */
  food: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format', // Restaurant
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format', // Food
    'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=1200&q=80&auto=format', // Cocktails
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80&auto=format', // Pancakes
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format', // Restaurant crowd
  ],
};

/**
 * Get a random image from a category
 */
export function getRandomImage(category: keyof typeof UNSPLASH_IMAGES): string {
  const images = UNSPLASH_IMAGES[category];
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Get image by category and index
 */
export function getImage(category: keyof typeof UNSPLASH_IMAGES, index: number = 0): string {
  const images = UNSPLASH_IMAGES[category];
  return images[index % images.length];
}

/**
 * Fallback image for errors
 */
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80&auto=format';

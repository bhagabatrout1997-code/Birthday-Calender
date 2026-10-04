export interface CuratedGiftIdea {
  title: string;
  category: string;
  estimatedPrice: string;
  whyTheyWillLoveIt: string;
  whereToFind: string;
  searchQuery: string;
}

export function generateCuratedGiftSuggestions(params: {
  name: string;
  relationship?: string;
  age?: number;
  interests?: string[];
  budget?: string;
  vibe?: string;
}): CuratedGiftIdea[] {
  const { name, relationship = 'Friend', interests = [], budget = '$25 - $50', vibe = 'thoughtful' } = params;
  const list: CuratedGiftIdea[] = [];
  const lowerInterests = (interests || []).map(i => i.toLowerCase());

  // Interest-based matching
  if (lowerInterests.some(i => i.includes('read') || i.includes('book'))) {
    list.push({
      title: 'Embossed Leather Book Embosser & Local Bookstore Card',
      category: 'Keepsake & Hobby',
      estimatedPrice: '$28 - $45',
      whyTheyWillLoveIt: `Customizes ${name}'s personal library with their name, paired with the joy of browsing a favorite bookshop.`,
      whereToFind: 'Etsy or Bookshop.org',
      searchQuery: 'personalized book embosser custom library stamp',
    });
    list.push({
      title: 'Rechargeable Amber Clip-On Reading Light & Magnetic Bookmark',
      category: 'Everyday Cozy',
      estimatedPrice: '$20 - $30',
      whyTheyWillLoveIt: 'Eye-friendly warm light perfect for late night reading without straining the eyes.',
      whereToFind: 'Amazon or Independent Bookstores',
      searchQuery: 'amber light rechargeable book reading lamp',
    });
  }

  if (lowerInterests.some(i => i.includes('coffee') || i.includes('tea') || i.includes('cafe'))) {
    list.push({
      title: 'Single-Origin Coffee Tasting Flight or Artisan Tea Sampler',
      category: 'Culinary Delight',
      estimatedPrice: '$25 - $40',
      whyTheyWillLoveIt: `Lets ${name} explore boutique micro-roasters and discover new flavor notes every morning.`,
      whereToFind: 'Trade Coffee, Fellow, or local roastery',
      searchQuery: 'artisan single origin coffee tasting flight sampler',
    });
    list.push({
      title: 'Fellow Carter Move Insulated Travel Mug with Splash Guard',
      category: 'Everyday Essential',
      estimatedPrice: '$35 - $45',
      whyTheyWillLoveIt: 'Ceramic interior preserves pure beverage taste without any metallic flavor.',
      whereToFind: 'Fellow Products or Specialty Kitchen Stores',
      searchQuery: 'Fellow Carter Move mug ceramic interior',
    });
  }

  if (lowerInterests.some(i => i.includes('cook') || i.includes('bake') || i.includes('food') || i.includes('wine'))) {
    list.push({
      title: 'Infused Finishing Salt Flight & Small-Batch Truffle Hot Honey',
      category: 'Gourmet Culinary',
      estimatedPrice: '$30 - $48',
      whyTheyWillLoveIt: `Elevates ${name}'s weeknight cooking into a restaurant-worthy gourmet experience instantly.`,
      whereToFind: 'Jacobsen Salt Co, Mike\'s Hot Honey, or Williams Sonoma',
      searchQuery: 'gourmet finishing salts infused gift set',
    });
    list.push({
      title: 'End-Grain Acacia Wood Prep Board with Juice Groove',
      category: 'Kitchen Keepsake',
      estimatedPrice: '$45 - $65',
      whyTheyWillLoveIt: 'Durable, knife-friendly surface that doubles as a gorgeous rustic charcuterie board.',
      whereToFind: 'Local Woodworker or Specialty Kitchen Goods',
      searchQuery: 'acacia end grain cutting board juice groove',
    });
  }

  if (lowerInterests.some(i => i.includes('plant') || i.includes('garden') || i.includes('nature') || i.includes('outdoor'))) {
    list.push({
      title: 'Hand-Glazed Ceramic Planter with Low-Maintenance Rare Succulent/Pothos',
      category: 'Green Living',
      estimatedPrice: '$28 - $42',
      whyTheyWillLoveIt: 'Brings vibrant living green into their sanctuary with a touch of handmade artisan pottery.',
      whereToFind: 'Local plant nursery or The Sill',
      searchQuery: 'hand glazed ceramic planter pot with drainage',
    });
    list.push({
      title: 'Solid Brass Plant Mister & Heirloom Pruning Shears',
      category: 'Hobby & Home',
      estimatedPrice: '$32 - $50',
      whyTheyWillLoveIt: 'Timeless gardening tools that feel satisfying to use and look sculptural on a shelf.',
      whereToFind: 'Haws or Botanical Boutiques',
      searchQuery: 'vintage solid brass plant mister',
    });
  }

  if (lowerInterests.some(i => i.includes('tech') || i.includes('gadget') || i.includes('gaming'))) {
    list.push({
      title: '3-in-1 Foldable MagSafe Wireless Charging Stand',
      category: 'Tech Convenience',
      estimatedPrice: '$35 - $60',
      whyTheyWillLoveIt: 'Cleans up desk clutter and folds completely flat for sleek travel or bedside use.',
      whereToFind: 'Anker, Satechi, or Apple Store',
      searchQuery: 'compact 3 in 1 foldable magnetic wireless travel charger',
    });
    list.push({
      title: 'Custom Wool Felt & Full-Grain Leather Desk Mat',
      category: 'Workspace Upgrade',
      estimatedPrice: '$35 - $55',
      whyTheyWillLoveIt: 'Soft acoustic damping, smooth mouse glide, and instantly warms up any workspace.',
      whereToFind: 'Orbitkey, Grovemade, or Etsy',
      searchQuery: 'wool felt desk mat with vegan leather accent',
    });
  }

  if (lowerInterests.some(i => i.includes('art') || i.includes('music') || i.includes('photo') || i.includes('vinyl'))) {
    list.push({
      title: 'Fujifilm Instax Mini Link 2 Smartphone Printer & Twin Film Pack',
      category: 'Memory Making',
      estimatedPrice: '$80 - $110',
      whyTheyWillLoveIt: `Turns photos trapped in ${name}'s phone into tangible, credit-card sized polaroids to gift or display.`,
      whereToFind: 'B&H Photo, Target, or Amazon',
      searchQuery: 'Fujifilm Instax Mini Link smartphone printer',
    });
    list.push({
      title: 'Custom City Map Coordinates Etched Glassware or Print',
      category: 'Sentimental Keepsake',
      estimatedPrice: '$25 - $45',
      whyTheyWillLoveIt: 'A subtle, meaningful nod to a hometown, favorite travel spot, or memorable anniversary city.',
      whereToFind: 'Uncommon Goods or Etsy',
      searchQuery: 'custom etched city map rocks glass',
    });
  }

  if (relationship.toLowerCase().includes('partner') || relationship.toLowerCase().includes('spouse')) {
    list.push({
      title: 'Date Night Adventure Scratch-Off Challenge Book',
      category: 'Experiential',
      estimatedPrice: '$35 - $45',
      whyTheyWillLoveIt: 'Sparks spontaneous, memorable dates together from cooking games to mini evening road trips.',
      whereToFind: 'The Adventure Challenge or Uncommon Goods',
      searchQuery: 'the adventure challenge couples edition scratch off book',
    });
  }

  // Universal fallback staples
  const universals: CuratedGiftIdea[] = [
    {
      title: 'Luxury Waffle-Weave Turkish Cotton Throw Blanket',
      category: 'Cozy Living',
      estimatedPrice: '$45 - $75',
      whyTheyWillLoveIt: 'Super breathable, incredibly soft, and draped beautifully over a couch or reading chair.',
      whereToFind: 'Quince, Brooklinen, or West Elm',
      searchQuery: 'turkish cotton waffle throw blanket lightweight',
    },
    {
      title: 'Maison Louis Marie No. 04 / Voluspa Scented Candle & Wick Trimmer',
      category: 'Atmosphere & Aromatics',
      estimatedPrice: '$32 - $44',
      whyTheyWillLoveIt: 'Subtle cedarwood and amber fragrance that makes any room feel like a boutique hotel.',
      whereToFind: 'Sephora, Nordstrom, or Local Apothecary',
      searchQuery: 'Maison Louis Marie candle Bois de Balincourt',
    },
    {
      title: 'Curated Artisan Snack Box or Gourmet Delicacy Basket',
      category: 'Treats & Experiences',
      estimatedPrice: '$30 - $60',
      whyTheyWillLoveIt: 'Zero clutter, pure indulgence with hand-crafted chocolates, nuts, and delicacies.',
      whereToFind: 'Mouth.com, Murray\'s Cheese, or local farm market',
      searchQuery: 'artisan small batch gourmet snack gift box',
    },
    {
      title: 'Stainless Steel Double-Wall French Press & Specialty Hot Cocoa',
      category: 'Comfort Ritual',
      estimatedPrice: '$35 - $50',
      whyTheyWillLoveIt: 'Virtually indestructible, keeps morning brew piping hot for hours without breaking glass.',
      whereToFind: 'Bodum, Mueller, or Target',
      searchQuery: 'double wall stainless steel insulated french press',
    },
  ];

  for (const u of universals) {
    if (!list.some(item => item.title === u.title)) {
      list.push(u);
    }
  }

  return list.slice(0, 6);
}

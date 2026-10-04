import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Built-in intelligent gift database for instantaneous fallback / offline support
interface GiftIdea {
  title: string;
  category: string;
  estimatedPrice: string;
  whyTheyWillLoveIt: string;
  whereToFind: string;
  searchQuery: string;
}

function getCuratedGifts(params: {
  name: string;
  relationship?: string;
  age?: number;
  interests?: string[];
  budget?: string;
  vibe?: string;
}): GiftIdea[] {
  const { name, relationship = 'Friend', age, interests = [], budget = '$25-$50', vibe = 'thoughtful' } = params;
  const list: GiftIdea[] = [];

  const lowerInterests = (interests || []).map(i => i.toLowerCase());

  // Interest-based matching
  if (lowerInterests.some(i => i.includes('read') || i.includes('book'))) {
    list.push({
      title: 'Embossed Leather Book Embosser & Local Bookstore Gift Card',
      category: 'Keepsake & Hobby',
      estimatedPrice: '$28 - $45',
      whyTheyWillLoveIt: `Customizes ${name}'s personal library with their name, paired with the joy of browsing their favorite bookshop.`,
      whereToFind: 'Etsy or Bookshop.org',
      searchQuery: 'personalized book embosser custom library stamp'
    });
    list.push({
      title: 'Rechargeable Amber Clip-On Reading Light & Magnetic Bookmark',
      category: 'Everyday Cozy',
      estimatedPrice: '$20 - $30',
      whyTheyWillLoveIt: 'Eye-friendly warm light perfect for late night reading without straining the eyes.',
      whereToFind: 'Amazon or Independent Bookstores',
      searchQuery: 'amber light rechargeable book reading lamp'
    });
  }

  if (lowerInterests.some(i => i.includes('coffee') || i.includes('tea') || i.includes('cafe'))) {
    list.push({
      title: 'Single-Origin Coffee Tasting Flight or Artisan Loose Leaf Sampler',
      category: 'Culinary Delight',
      estimatedPrice: '$25 - $40',
      whyTheyWillLoveIt: `Lets ${name} explore boutique micro-roasters and discover new flavor notes every morning.`,
      whereToFind: 'Trade Coffee, Fellow, or local roastery',
      searchQuery: 'artisan single origin coffee tasting flight sampler'
    });
    list.push({
      title: 'Fellow Carter Move Insulated Travel Mug with Splash Guard',
      category: 'Everyday Essential',
      estimatedPrice: '$35 - $45',
      whyTheyWillLoveIt: 'Ceramic interior preserves pure beverage taste without any metallic flavor.',
      whereToFind: 'Fellow Products or Specialty Kitchen Stores',
      searchQuery: 'Fellow Carter Move mug ceramic interior'
    });
  }

  if (lowerInterests.some(i => i.includes('cook') || i.includes('bake') || i.includes('food') || i.includes('wine'))) {
    list.push({
      title: 'Infused Finishing Salt Flight & Small-Batch Truffle Hot Honey',
      category: 'Gourmet Culinary',
      estimatedPrice: '$30 - $48',
      whyTheyWillLoveIt: `Elevates ${name}'s weeknight cooking into a restaurant-worthy gourmet experience instantly.`,
      whereToFind: 'Jacobsen Salt Co, Mike\'s Hot Honey, or Williams Sonoma',
      searchQuery: 'gourmet finishing salts infused gift set'
    });
    list.push({
      title: 'End-Grain Acacia Wood Prep Board with Juice Groove',
      category: 'Kitchen Keepsake',
      estimatedPrice: '$45 - $65',
      whyTheyWillLoveIt: 'Durable, knife-friendly surface that doubles as a gorgeous rustic charcuterie board.',
      whereToFind: 'Local Woodworker or Specialty Kitchen Goods',
      searchQuery: 'acacia end grain cutting board juice groove'
    });
  }

  if (lowerInterests.some(i => i.includes('plant') || i.includes('garden') || i.includes('nature') || i.includes('outdoor'))) {
    list.push({
      title: 'Hand-Glazed Ceramic Planter with Low-Maintenance Rare Succulent/Pothos',
      category: 'Green Living',
      estimatedPrice: '$28 - $42',
      whyTheyWillLoveIt: 'Brings vibrant living green into their sanctuary with a touch of handmade artisan pottery.',
      whereToFind: 'Local plant nursery or The Sill',
      searchQuery: 'hand glazed ceramic planter pot with drainage'
    });
    list.push({
      title: 'Solid Brass Plant Mister & Heirloom Pruning Shears',
      category: 'Hobby & Home',
      estimatedPrice: '$32 - $50',
      whyTheyWillLoveIt: 'Timeless gardening tools that feel satisfying to use and look sculptural on a shelf.',
      whereToFind: 'Haws or Botanical Boutiques',
      searchQuery: 'vintage solid brass plant mister'
    });
  }

  if (lowerInterests.some(i => i.includes('tech') || i.includes('gadget') || i.includes('gaming'))) {
    list.push({
      title: '3-in-1 Foldable MagSafe Wireless Charging Stand',
      category: 'Tech Convenience',
      estimatedPrice: '$35 - $60',
      whyTheyWillLoveIt: 'Cleans up desk clutter and folds completely flat for sleek travel or bedside use.',
      whereToFind: 'Anker, Satechi, or Apple Store',
      searchQuery: 'compact 3 in 1 foldable magnetic wireless travel charger'
    });
    list.push({
      title: 'Custom Wool Felt & Full-Grain Leather Desk Mat',
      category: 'Workspace Upgrade',
      estimatedPrice: '$35 - $55',
      whyTheyWillLoveIt: 'Soft acoustic damping, smooth mouse glide, and instantly warms up any workspace.',
      whereToFind: 'Orbitkey, Grovemade, or Etsy',
      searchQuery: 'wool felt desk mat with vegan leather accent'
    });
  }

  if (lowerInterests.some(i => i.includes('art') || i.includes('music') || i.includes('photo') || i.includes('travel'))) {
    list.push({
      title: 'Fujifilm Instax Mini Link 2 Smartphone Printer & Twin Film Pack',
      category: 'Memory Making',
      estimatedPrice: '$80 - $110',
      whyTheyWillLoveIt: `Turns photos trapped in ${name}'s phone into tangible, credit-card sized polaroids to gift or display.`,
      whereToFind: 'B&H Photo, Target, or Amazon',
      searchQuery: 'Fujifilm Instax Mini Link smartphone printer'
    });
    list.push({
      title: 'Custom City Map Coordinates Etched Glassware or Print',
      category: 'Sentimental Keepsake',
      estimatedPrice: '$25 - $45',
      whyTheyWillLoveIt: 'A subtle, meaningful nod to a hometown, favorite travel spot, or memorable anniversary city.',
      whereToFind: 'Uncommon Goods or Etsy',
      searchQuery: 'custom etched city map rocks glass'
    });
  }

  // Relationship and universal fallback delights
  if (relationship.toLowerCase().includes('partner') || relationship.toLowerCase().includes('spouse')) {
    list.push({
      title: 'Date Night Adventure Scratch-Off Challenge Book',
      category: 'Experiential',
      estimatedPrice: '$35 - $45',
      whyTheyWillLoveIt: 'Sparks spontaneous, memorable dates together from cooking games to mini evening road trips.',
      whereToFind: 'The Adventure Challenge or Uncommon Goods',
      searchQuery: 'the adventure challenge couples edition scratch off book'
    });
  }

  if (relationship.toLowerCase().includes('parent') || relationship.toLowerCase().includes('mom') || relationship.toLowerCase().includes('dad')) {
    list.push({
      title: 'Custom Handwritten Recipe Engraved Wood Board or Keepsake Box',
      category: 'Heirloom & Heartfelt',
      estimatedPrice: '$40 - $70',
      whyTheyWillLoveIt: 'Preserves a cherished family recipe or note in beloved handwriting permanently.',
      whereToFind: 'Etsy artisan shops',
      searchQuery: 'custom handwritten recipe engraved cutting board'
    });
  }

  // Universal fallback staples if few interests were matched
  const universals: GiftIdea[] = [
    {
      title: 'Luxury Waffle-Weave Turkish Cotton Throw Blanket',
      category: 'Cozy Living',
      estimatedPrice: '$45 - $75',
      whyTheyWillLoveIt: 'Super breathable, incredibly soft, and draped beautifully over a couch or reading chair.',
      whereToFind: 'Quince, Brooklinen, or West Elm',
      searchQuery: 'turkish cotton waffle throw blanket lightweight'
    },
    {
      title: 'Maison Louis Marie No. 04 / Voluspa Scented Candle & Wick Trimmer',
      category: 'Atmosphere & Aromatics',
      estimatedPrice: '$32 - $44',
      whyTheyWillLoveIt: 'Subtle cedarwood and amber fragrance that makes any room feel like a boutique hotel.',
      whereToFind: 'Sephora, Nordstrom, or Local Apothecary',
      searchQuery: 'Maison Louis Marie candle Bois de Balincourt'
    },
    {
      title: 'Curated Artisan Snack Box or Local Delicacy Basket',
      category: 'Treats & Experiences',
      estimatedPrice: '$30 - $60',
      whyTheyWillLoveIt: 'Zero clutter, pure indulgence with hand-crafted chocolates, nuts, and delicacies.',
      whereToFind: 'Mouth.com, Murray\'s Cheese, or local farm market',
      searchQuery: 'artisan small batch gourmet snack gift box'
    },
    {
      title: 'Stainless Steel Double-Wall French Press & Specialty Hot Cocoa',
      category: 'Comfort Ritual',
      estimatedPrice: '$35 - $50',
      whyTheyWillLoveIt: 'Virtually indestructible, keeps morning brew piping hot for hours without breaking glass.',
      whereToFind: 'Bodum, Mueller, or Target',
      searchQuery: 'double wall stainless steel insulated french press'
    }
  ];

  // Merge unique by title
  for (const u of universals) {
    if (!list.some(item => item.title === u.title)) {
      list.push(u);
    }
  }

  return list.slice(0, 6);
}

// API: Gift Suggestions
app.post('/api/gift-suggestions', async (req, res) => {
  try {
    const { name, relationship, age, interests, budget, vibe, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (ai) {
      try {
        const prompt = `You are a thoughtful, world-class gift curator.
Recommend 6 distinct, imaginative, and realistic gift ideas for:
- Recipient Name: ${name}
- Relationship to giver: ${relationship || 'Friend'}
- Age: ${age ? `${age} years old` : 'Not specified'}
- Interests / Hobbies: ${Array.isArray(interests) && interests.length > 0 ? interests.join(', ') : 'Not specified'}
- Target Budget range: ${budget || 'Flexible ($30-$75)'}
- Vibe / Personality: ${vibe || 'Thoughtful & Memorable'}
- Additional Notes: ${notes || 'None'}

Avoid lazy generic suggestions (like "a gift card" or "socks"). Choose specific, tasteful products, meaningful experiential gifts, or heirloom items people actually cherish.

Return a JSON array with 6 items matching this schema:
[
  {
    "title": "Clear, specific product or experience name",
    "category": "E.g. Keepsake, Tech, Culinary, Hobby, Cozy, Experience",
    "estimatedPrice": "$XX - $YY",
    "whyTheyWillLoveIt": "Personalized 1-2 sentence explanation relating directly to their traits",
    "whereToFind": "Store name, brand, or boutique (e.g. Etsy, Fellow, REI, Local indie bookstore)",
    "searchQuery": "Concise search keywords to find or buy it online"
  }
]`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  estimatedPrice: { type: Type.STRING },
                  whyTheyWillLoveIt: { type: Type.STRING },
                  whereToFind: { type: Type.STRING },
                  searchQuery: { type: Type.STRING }
                },
                required: ['title', 'category', 'estimatedPrice', 'whyTheyWillLoveIt', 'whereToFind', 'searchQuery']
              }
            }
          }
        });

        const rawText = response.text?.trim();
        if (rawText) {
          const suggestions = JSON.parse(rawText);
          return res.json({ suggestions, source: 'ai' });
        }
      } catch (aiErr) {
        console.warn('Gemini API call failed, falling back to curated gifts engine:', aiErr);
      }
    }

    // Fallback to high quality curated recommendations
    const curated = getCuratedGifts({ name, relationship, age, interests, budget, vibe });
    return res.json({ suggestions: curated, source: 'curated' });
  } catch (err: any) {
    console.error('Error generating gift suggestions:', err);
    res.status(500).json({ error: err.message || 'Failed to generate gift suggestions' });
  }
});

// API: Greeting Wishes & Card Messages
app.post('/api/greetings', async (req, res) => {
  try {
    const { name, relationship, ageTurning, tone = 'heartfelt', customNote } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (ai) {
      try {
        const prompt = `Write 4 distinct birthday card messages and wishes for:
- Recipient: ${name}
- Relationship: ${relationship || 'Friend'}
- Age turning: ${ageTurning ? `${ageTurning}` : 'Celebration'}
- Tone: ${tone} (e.g. heartfelt, funny, short & sweet, poetic, formal)
- Context / Memory: ${customNote || 'Celebrate their special day'}

Provide 4 unique greetings:
1. Warm & Memorable
2. Tone-focused (${tone})
3. Punchy / Text-message length
4. Creative sign-off & celebration punchline

Return a JSON array of strings:
["greeting 1", "greeting 2", "greeting 3", "greeting 4"]`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        });

        const text = response.text?.trim();
        if (text) {
          const greetings = JSON.parse(text);
          return res.json({ greetings, source: 'ai' });
        }
      } catch (aiErr) {
        console.warn('Gemini API call failed for greetings, falling back to templates:', aiErr);
      }
    }

    // Fallback template greetings
    const yearStr = ageTurning ? ` Happy ${ageTurning}th birthday!` : ' Happy Birthday!';
    const fallbackGreetings = [
      `Happy Birthday, ${name}! Wishing you a year filled with good health, joyful surprises, and all your favorite things.${yearStr}`,
      `To the wonderful ${name} — thank you for bringing so much brightness and laughter into my life. Here's to celebrating you today and all the adventures ahead!`,
      `Cheers to another trip around the sun, ${name}! May your day be as remarkable and generous as you are. Have the sweetest celebration! 🎂🎉`,
      `Sending the warmest birthday wishes your way, ${name}! Hope your day is spent with people you love and cake you didn't have to share.`
    ];

    return res.json({ greetings: fallbackGreetings, source: 'curated' });
  } catch (err: any) {
    console.error('Error generating greetings:', err);
    res.status(500).json({ error: err.message || 'Failed to generate greetings' });
  }
});

// Setup Vite or static serving
async function setupServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Celebrately server running on port ${PORT}`);
  });
}

setupServer();

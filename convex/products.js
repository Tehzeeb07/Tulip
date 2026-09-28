import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const INITIAL_PRODUCTS = [
  // --- BOUQUETS ---
  {
    id: "marchesa",
    type: "bouquet",
    name: "The Marchesa",
    desc: "Garden rose, ranunculus",
    price: 185,
    occasion: "Wedding",
    sizes: ["Petite", "Signature", "Grand"],
    image: "/images/products/marchesa.jpg",
    images: [
      "/images/products/marchesa.jpg",
      "/images/products/marchesa_2.jpg",
      "/images/products/marchesa_3.jpg",
    ],
    careTips: "Trim stems at an angle every 2 days and change water daily. Keep away from direct sunlight and heating vents to extend bloom life.",
    inStock: true,
  },
  {
    id: "amber-field",
    type: "bouquet",
    name: "Amber Field",
    desc: "Dahlia, dried grasses",
    price: 140,
    occasion: "Everyday",
    sizes: ["Petite", "Signature"],
    image: "/images/products/amber-field.jpg",
    images: [
      "/images/products/amber-field.jpg",
      "/images/products/amber-field_2.jpg",
      "/images/products/amber-field_3.jpg",
    ],
    careTips: "Dried elements need no water — display away from humidity. Fresh dahlias should have stems re-cut and water changed every other day.",
    inStock: true,
  },
  {
    id: "quiet-grove",
    type: "bouquet",
    name: "Quiet Grove",
    desc: "Eucalyptus, white anemone",
    price: 120,
    occasion: "Sympathy",
    sizes: ["Signature", "Grand"],
    image: "/images/products/quiet-grove.jpg",
    images: [
      "/images/products/quiet-grove.jpg",
      "/images/products/quiet-grove_2.jpg",
      "/images/products/quiet-grove_3.jpg",
    ],
    careTips: "Anemones are thirsty — check water levels daily. Eucalyptus dries beautifully, so stems can be left in the arrangement as it ages.",
    inStock: true,
  },
  {
    id: "vermeil",
    type: "bouquet",
    name: "Vermeil",
    desc: "Burgundy peony, thistle",
    price: 210,
    occasion: "Wedding",
    sizes: ["Signature", "Grand"],
    image: "/images/products/vermeil.jpg",
    images: [
      "/images/products/vermeil.jpg",
      "/images/products/vermeil_2.jpg",
      "/images/products/vermeil_3.jpg",
    ],
    careTips: "Peonies open over several days — keep cool at first to slow blooming. Re-cut stems every 2 days for the fullest bloom.",
    inStock: true,
  },
  {
    id: "wheatlight",
    type: "bouquet",
    name: "Wheatlight",
    desc: "Sunflower, wheat, cosmos",
    price: 115,
    occasion: "Everyday",
    sizes: ["Petite", "Signature"],
    image: "/images/products/wheatlight.jpg",
    images: [
      "/images/products/wheatlight.jpg",
      "/images/products/wheatlight_3.jpg",
    ],
    careTips: "Sunflowers drink heavily in the first two days — top off water often. Wheat can be air-dried once cosmos fade.",
    inStock: true,
  },
  {
    id: "moss-stem",
    type: "bouquet",
    name: "Moss & Stem",
    desc: "Orchid, moss, fern",
    price: 225,
    occasion: "Events",
    sizes: ["Signature", "Grand"],
    image: "/images/products/moss-stem.jpg",
    images: [
      "/images/products/moss-stem.jpg",
      "/images/products/moss-stem_2.jpg",
      "/images/products/moss-stem_3.jpg",
    ],
    careTips: "Mist the moss and fern lightly every few days. Orchid stems should be kept in shallow water only.",
    inStock: true,
  },
  {
    id: "isabella",
    type: "bouquet",
    name: "Isabella",
    desc: "French lavender, dried herbs",
    price: 165,
    occasion: "Everyday",
    sizes: ["Petite", "Signature"],
    image: "/images/products/isabella.jpg",
    images: [
      "/images/products/isabella.jpg",
      "/images/products/isabella_2.jpg",
      "/images/products/isabella_3.jpg",
    ],
    careTips: "Keep in a cool spot away from direct heat. Lavender naturally dries and will retain its calming scent for months.",
    inStock: true,
  },
  {
    id: "sienna-sun",
    type: "bouquet",
    name: "Sienna Sun",
    desc: "Terracotta ranunculus, marigold",
    price: 155,
    occasion: "Everyday",
    sizes: ["Petite", "Signature", "Grand"],
    image: "/images/products/sienna-sun.jpg",
    images: [
      "/images/products/sienna-sun.jpg",
      "/images/products/sienna-sun_2.jpg",
      "/images/products/sienna-sun_3.jpg",
    ],
    careTips: "Re-cut stems every two days at a 45-degree angle. Marigolds and ranunculus thrive in cool fresh tap water.",
    inStock: true,
  },
  {
    id: "nocturne",
    type: "bouquet",
    name: "Nocturne",
    desc: "White calla lily, dark plum accents",
    price: 235,
    occasion: "Events",
    sizes: ["Signature", "Grand"],
    image: "/images/products/nocturne.jpg",
    images: [
      "/images/products/nocturne.jpg",
      "/images/products/nocturne_2.jpg",
    ],
    careTips: "Calla lilies require only two to three inches of clean water to avoid stem softening. Display in indirect light.",
    inStock: true,
  },
  {
    id: "wild-heath",
    type: "bouquet",
    name: "Wild Heath",
    desc: "White heather, wild thistle",
    price: 135,
    occasion: "Sympathy",
    sizes: ["Signature", "Grand"],
    image: "/images/products/wild-heath.jpg",
    images: [
      "/images/products/wild-heath.jpg",
      "/images/products/wild-heath_2.jpg",
      "/images/products/wild-heath_3.jpg",
    ],
    careTips: "Heather and thistle are naturally resilient. Keep in cold water and trim stems every few days.",
    inStock: true,
  },
  {
    id: "petal-mist",
    type: "bouquet",
    name: "Petal Mist",
    desc: "White garden rose, ranunculus",
    price: 175,
    occasion: "Wedding",
    sizes: ["Petite", "Signature", "Grand"],
    image: "/images/products/petal-mist.jpg",
    images: [
      "/images/products/petal-mist.jpg",
      "/images/products/petal-mist_2.jpg",
      "/images/products/petal-mist_3.jpg",
    ],
    careTips: "Remove any lower guard petals if desired. Re-cut stems under running water for maximum bloom longevity.",
    inStock: true,
  },
  {
    id: "solstice",
    type: "bouquet",
    name: "Solstice",
    desc: "King protea, seeded eucalyptus",
    price: 215,
    occasion: "Events",
    sizes: ["Signature", "Grand"],
    image: "/images/products/solstice.jpg",
    images: [
      "/images/products/solstice.jpg",
      "/images/products/solstice_2.jpg",
      "/images/products/solstice_3.jpg",
    ],
    careTips: "King protea and eucalyptus are hardy natives that last weeks in water and dry exceptionally well.",
    inStock: true,
  },
  {
    id: "elysian-garden",
    type: "bouquet",
    name: "Elysian Garden",
    desc: "Pastel peonies, white ranunculus, lilac",
    price: 195,
    occasion: "Wedding",
    sizes: ["Petite", "Signature", "Grand"],
    image: "/images/products/elysian-garden.jpg",
    images: [
      "/images/products/elysian-garden.jpg",
      "/images/products/marchesa_2.jpg",
    ],
    careTips: "Keep peonies cool until desired opening. Refresh water daily to preserve the delicate lilac fragrance.",
    inStock: true,
  },
  {
    id: "golden-hour",
    type: "bouquet",
    name: "Golden Hour",
    desc: "Golden tulips, chamomile, eucalyptus",
    price: 145,
    occasion: "Everyday",
    sizes: ["Petite", "Signature"],
    image: "/images/products/golden-hour.jpg",
    images: [
      "/images/products/golden-hour.jpg",
      "/images/products/golden-hour_2.jpg",
    ],
    careTips: "Tulips continue to grow towards light — rotate vase daily and trim stems slightly every 3 days.",
    inStock: true,
  },
  {
    id: "midnight-velvet",
    type: "bouquet",
    name: "Midnight Velvet",
    desc: "Dark crimson roses, plum baccara, eucalyptus",
    price: 250,
    occasion: "Events",
    sizes: ["Signature", "Grand"],
    image: "/images/products/midnight-velvet.jpg",
    images: [
      "/images/products/midnight-velvet.jpg",
      "/images/products/midnight-velvet_2.jpg",
    ],
    careTips: "Keep in a cool ambient temperature. Dark roses open gorgeously under gentle warmth.",
    inStock: true,
  },
  {
    id: "white-sanctuary",
    type: "bouquet",
    name: "White Sanctuary",
    desc: "Pure white lilies, baby's breath, olive branch",
    price: 160,
    occasion: "Sympathy",
    sizes: ["Signature", "Grand"],
    image: "/images/products/white-sanctuary.jpg",
    images: [
      "/images/products/white-sanctuary.jpg",
      "/images/products/white-sanctuary_2.jpg",
    ],
    careTips: "Gently pluck anthers from lilies as they open to avoid pollen staining. Lilies last up to 2 weeks.",
    inStock: true,
  },
  {
    id: "botanical-solace",
    type: "bouquet",
    name: "Botanical Solace",
    desc: "White hydrangea, seeded eucalyptus",
    price: 140,
    occasion: "Sympathy",
    sizes: ["Signature", "Grand"],
    image: "/images/products/botanical-solace.jpg",
    images: [
      "/images/products/botanical-solace.jpg",
      "/images/products/botanical-solace_2.jpg",
    ],
    careTips: "Hydrangeas love water — submerge stems deep in water and mist bloom heads lightly.",
    inStock: true,
  },

  // --- ACCESSORIES & GIFTS ---
  {
    id: "hand-blown-vase",
    type: "accessory",
    name: "Hand-blown Vase",
    desc: "Ceramic, marble plinth form",
    price: 65,
    occasion: "Vessels",
    sizes: ["Small", "Medium", "Large"],
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80",
      "/images/products/hand-blown-vase_2.jpg",
      "/images/products/hand-blown-vase_3.jpg",
    ],
    careTips: "Hand wash only. Avoid sudden temperature changes, which can crack the glaze.",
    inStock: true,
  },
  {
    id: "linen-wrap-set",
    type: "accessory",
    name: "Linen Wrap Set",
    desc: "Natural woven linen, waxed twine",
    price: 22,
    occasion: "Wrapping",
    sizes: ["Standard"],
    image: "/images/products/linen-wrap-set.jpg",
    images: [
      "/images/products/linen-wrap-set.jpg",
      "/images/products/linen-wrap-set_2.jpg",
      "/images/products/linen-wrap-set_3.jpg",
    ],
    careTips: "Store flat in a dry place. Linen can be spot-cleaned or gently hand-washed if needed.",
    inStock: true,
  },
  {
    id: "candle-bouquet-set",
    type: "accessory",
    name: "Candle & Bouquet Set",
    desc: "Soy candle, botanical pairing",
    price: 95,
    occasion: "Gift Sets",
    sizes: ["Standard"],
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80",
      "/images/products/candle-bouquet-set_2.jpg",
      "/images/products/candle-bouquet-set_3.jpg",
    ],
    careTips: "Trim candle wick to 1/4 inch before each burn. Follow bouquet care as noted per arrangement.",
    inStock: true,
  },
  {
    id: "letterpress-card",
    type: "accessory",
    name: "Letterpress Card",
    desc: "Artisan botanical print card",
    price: 8,
    occasion: "Cards",
    sizes: ["Standard"],
    image: "/images/products/letterpress-card.jpg",
    images: [
      "/images/products/letterpress-card.jpg",
      "/images/products/letterpress-card_2.jpg",
      "/images/products/letterpress-card_3.jpg",
    ],
    careTips: "Keep away from moisture to preserve the ink detailing.",
    inStock: true,
  },
  {
    id: "ceramic-bud-vase",
    type: "accessory",
    name: "Ceramic Bud Vase",
    desc: "Matte white, minimalist form",
    price: 38,
    occasion: "Vessels",
    sizes: ["Small"],
    image: "/images/products/ceramic-bud-vase.jpg",
    images: [
      "/images/products/ceramic-bud-vase.jpg",
      "/images/products/ceramic-bud-vase_2.jpg",
      "/images/products/ceramic-bud-vase_3.jpg",
    ],
    careTips: "Hand wash only. Perfect for single stems or delicate sprigs of eucalyptus.",
    inStock: true,
  },
  {
    id: "chocolate-bloom-box",
    type: "accessory",
    name: "Chocolate & Bloom Box",
    desc: "Local artisanal truffles pairing",
    price: 78,
    occasion: "Gift Sets",
    sizes: ["Standard"],
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80",
      "/images/products/chocolate-bloom-box_2.jpg",
      "/images/products/chocolate-bloom-box_3.jpg",
    ],
    careTips: "Store chocolates in a cool, dry place. Refer to individual bouquet care for the floral portion.",
    inStock: true,
  },
  {
    id: "brass-floral-shears",
    type: "accessory",
    name: "Brass Floral Shears",
    desc: "Hand-forged carbon steel, brass rivets",
    price: 45,
    occasion: "Tools",
    sizes: ["Standard"],
    image: "/images/products/brass-floral-shears.jpg",
    images: [
      "/images/products/brass-floral-shears.jpg",
      "/images/products/brass-floral-shears_2.jpg",
    ],
    careTips: "Wipe clean and dry after each use. Oil the pivot rivet lightly twice a season.",
    inStock: true,
  },
  {
    id: "amber-glass-spritzer",
    type: "accessory",
    name: "Amber Glass Spritzer",
    desc: "Botanical dropper & fine mist sprayer",
    price: 32,
    occasion: "Vessels",
    sizes: ["Standard"],
    image: "/images/products/amber-glass-spritzer.jpg",
    images: [
      "/images/products/amber-glass-spritzer.jpg",
      "/images/products/amber-glass-spritzer_2.jpg",
    ],
    careTips: "Rinse bottle with warm water between uses. Ideal for misting tropical greens and hydrangeas.",
    inStock: true,
  },
  {
    id: "raw-silk-ribbon-trio",
    type: "accessory",
    name: "Raw Silk Ribbon Trio",
    desc: "Plant-dyed habotai silk ribbons",
    price: 28,
    occasion: "Wrapping",
    sizes: ["Standard"],
    image: "/images/products/raw-silk-ribbon-trio.jpg",
    images: [
      "/images/products/raw-silk-ribbon-trio.jpg",
      "/images/products/raw-silk-ribbon-trio_2.jpg",
      "/images/products/raw-silk-ribbon-trio_3.jpg",
    ],
    careTips: "Store rolled away from direct sunlight to keep the natural plant-based dyes vibrant.",
    inStock: true,
  },
  {
    id: "botanical-votive-trio",
    type: "accessory",
    name: "Botanical Votive Trio",
    desc: "Cedarwood, fig leaf & gardenia votives",
    price: 58,
    occasion: "Gift Sets",
    sizes: ["Standard"],
    image: "/images/products/botanical-votive-trio.jpg",
    images: [
      "/images/products/botanical-votive-trio.jpg",
      "/images/products/botanical-votive-trio_2.jpg",
    ],
    careTips: "Burn on heat-resistant surfaces. Allow wax pool to reach glass edge on first burn.",
    inStock: true,
  },
  {
    id: "ceramic-watering-pitcher",
    type: "accessory",
    name: "Ceramic Watering Pitcher",
    desc: "Glazed stoneware, arched ergonomic handle",
    price: 52,
    occasion: "Vessels",
    sizes: ["Standard"],
    image: "/images/products/ceramic-watering-pitcher.jpg",
    images: [
      "/images/products/ceramic-watering-pitcher.jpg",
      "/images/products/ceramic-watering-pitcher_2.jpg",
    ],
    careTips: "Glazed interior is watertight and stain-resistant. Hand rinse with mild soap.",
    inStock: true,
  },
  {
    id: "canvas-florist-apron",
    type: "accessory",
    name: "Waxed Canvas Florist Apron",
    desc: "Heavyweight cotton canvas, brass hardware",
    price: 65,
    occasion: "Tools",
    sizes: ["Standard"],
    image: "/images/products/canvas-florist-apron.jpg",
    images: [
      "/images/products/canvas-florist-apron.jpg",
      "/images/products/canvas-florist-apron_2.jpg",
    ],
    careTips: "Spot clean with cold water and mild brush. Re-wax annually to preserve water-resistance.",
    inStock: true,
  },
  {
    id: "botanical-flower-press",
    type: "accessory",
    name: "Botanical Flower Press",
    desc: "Handmade pine press, brass wing nuts",
    price: 42,
    occasion: "Tools",
    sizes: ["Standard"],
    image: "/images/products/botanical-flower-press.jpg",
    images: [
      "/images/products/botanical-flower-press.jpg",
      "/images/products/botanical-flower-press_2.jpg",
    ],
    careTips: "Includes 10 corrugated cardboard spacers and blotting sheets. Tighten wing nuts evenly.",
    inStock: true,
  },
  {
    id: "pressed-flower-bookmarks",
    type: "accessory",
    name: "Pressed Flower Bookmark Trio",
    desc: "Real pressed petals in archival laminate",
    price: 16,
    occasion: "Gift Sets",
    sizes: ["Standard"],
    image: "/images/products/pressed-flower-bookmarks.jpg",
    images: [
      "/images/products/pressed-flower-bookmarks.jpg",
      "/images/products/botanical-flower-press.jpg",
    ],
    careTips: "Keep out of intense direct sunlight to maintain the natural botanical pigmentation.",
    inStock: true,
  },
];

// Query all products with optional filters
export const getProducts = query({
  args: {
    type: v.optional(v.string()),
    occasion: v.optional(v.string()),
    inStockOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("products");

    if (args.type) {
      q = q.withIndex("by_type", (q) => q.eq("type", args.type));
    }

    let products = await q.collect();

    if (args.occasion && args.occasion !== "All") {
      products = products.filter((p) => p.occasion === args.occasion);
    }

    if (args.inStockOnly) {
      products = products.filter((p) => p.inStock !== false);
    }

    return products;
  },
});

// Query single product by slug ID or Convex ID
export const getProductById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // 1. Try slug search via by_id index
    const bySlug = await ctx.db
      .query("products")
      .withIndex("by_id", (q) => q.eq("id", args.id))
      .first();

    if (bySlug) return bySlug;

    // 2. Try by convex ID directly
    try {
      const byConvexId = await ctx.db.get(args.id);
      if (byConvexId) return byConvexId;
    } catch {
      // not a valid convex ID, ignore
    }

    return null;
  },
});

// Seed initial products into the database
export const seedProducts = mutation({
  args: {
    force: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let inserted = 0;
    let updated = 0;

    for (const item of INITIAL_PRODUCTS) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_id", (q) => q.eq("id", item.id))
        .first();

      if (!existing) {
        await ctx.db.insert("products", {
          ...item,
          inStock: item.inStock ?? true,
          createdAt: Date.now(),
        });
        inserted++;
      } else if (args.force) {
        await ctx.db.patch(existing._id, {
          name: item.name,
          price: item.price,
          desc: item.desc,
          type: item.type,
          occasion: item.occasion,
          sizes: item.sizes,
          image: item.image,
          images: item.images,
          careTips: item.careTips,
          inStock: item.inStock ?? true,
          updatedAt: Date.now(),
        });
        updated++;
      }
    }

    const total = await ctx.db.query("products").collect();
    return { inserted, updated, total: total.length };
  },
});

// Create a new product
export const createProduct = mutation({
  args: {
    id: v.optional(v.string()),
    name: v.string(),
    price: v.number(),
    desc: v.string(),
    type: v.string(),
    occasion: v.optional(v.string()),
    sizes: v.optional(v.array(v.string())),
    image: v.string(),
    images: v.optional(v.array(v.string())),
    careTips: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    palette: v.optional(v.string()),
    space: v.optional(v.string()),
    mood: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const slug =
      args.id?.trim() ||
      args.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `item-${Date.now()}`;

    // Verify slug uniqueness
    const existing = await ctx.db
      .query("products")
      .withIndex("by_id", (q) => q.eq("id", slug))
      .first();

    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const images = args.images && args.images.length > 0 ? args.images : [args.image];

    const productId = await ctx.db.insert("products", {
      id: finalSlug,
      name: args.name.trim(),
      price: Math.max(0, args.price),
      desc: args.desc.trim(),
      type: args.type,
      occasion: args.occasion?.trim() || undefined,
      sizes: args.sizes || ["Standard"],
      image: args.image.trim(),
      images,
      careTips: args.careTips?.trim() || undefined,
      inStock: args.inStock ?? true,
      palette: args.palette || undefined,
      space: args.space || undefined,
      mood: args.mood || undefined,
      createdAt: Date.now(),
    });

    return { productId, slug: finalSlug };
  },
});

// Update an existing product
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    price: v.number(),
    desc: v.string(),
    type: v.string(),
    occasion: v.optional(v.string()),
    sizes: v.optional(v.array(v.string())),
    image: v.string(),
    images: v.optional(v.array(v.string())),
    careTips: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    palette: v.optional(v.string()),
    space: v.optional(v.string()),
    mood: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const images = args.images && args.images.length > 0 ? args.images : [args.image];

    await ctx.db.patch(args.id, {
      name: args.name.trim(),
      price: Math.max(0, args.price),
      desc: args.desc.trim(),
      type: args.type,
      occasion: args.occasion?.trim() || undefined,
      sizes: args.sizes || ["Standard"],
      image: args.image.trim(),
      images,
      careTips: args.careTips?.trim() || undefined,
      inStock: args.inStock ?? true,
      palette: args.palette || undefined,
      space: args.space || undefined,
      mood: args.mood || undefined,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Quick inline price update
export const updateProductPrice = mutation({
  args: {
    id: v.id("products"),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      price: Math.max(0, args.price),
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// Quick inline stock status toggle
export const toggleProductStock = mutation({
  args: {
    id: v.id("products"),
    inStock: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      inStock: args.inStock,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// Delete a product
export const deleteProduct = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

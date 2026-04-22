const express = require("express");
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());

// ─────────────────────────────────────────
// FLAVOR TROUBLESHOOTER
// ─────────────────────────────────────────
app.get("/flavor", (req, res) => {
  const { taste } = req.query;

  const problems = {
    sour: {
      issue: "Under-extracted",
      explanation: "Your coffee didn't extract long enough or the grind is too coarse. Not enough sugars and acids were dissolved.",
      fixes: [
        "Grind finer",
        "Increase brew time",
        "Increase water temperature (try 94–96°C)",
        "Use a slower, more even pour"
      ]
    },
    bitter: {
      issue: "Over-extracted",
      explanation: "Too much was pulled from the grounds — the harsh, dry compounds that come out last are dominating your cup.",
      fixes: [
        "Grind coarser",
        "Reduce brew time",
        "Lower water temperature (try 88–92°C)",
        "Use less coffee or more water"
      ]
    },
    weak: {
      issue: "Low strength / under-dosed",
      explanation: "Your brew ratio is off — too much water for the amount of coffee used.",
      fixes: [
        "Use more coffee (try 1:15 ratio — 1g coffee per 15g water)",
        "Grind slightly finer",
        "Reduce total water volume"
      ]
    },
    flat: {
      issue: "Stale coffee or poor development",
      explanation: "Your beans may be too old, or the roast was underdeveloped. Fresh coffee should have aroma and complexity.",
      fixes: [
        "Use fresher beans — ideally roasted within the last 2–4 weeks",
        "Store beans in an airtight container away from light",
        "Try a slightly higher brew temperature",
        "Check if your grinder is producing a consistent grind"
      ]
    },
    astringent: {
      issue: "Over-extraction or poor water quality",
      explanation: "That dry, mouth-coating sensation usually comes from over-extraction or high mineral water.",
      fixes: [
        "Grind coarser",
        "Reduce brew time",
        "Use filtered water (aim for 150ppm TDS)",
        "Rinse your filter before brewing"
      ]
    },
    salty: {
      issue: "Mineral imbalance in water",
      explanation: "High sodium or chloride levels in your water can produce a salty taste.",
      fixes: [
        "Switch to filtered or bottled water",
        "Avoid softened water — it's high in sodium",
        "Try a water recipe (Third Wave Water is a popular option)"
      ]
    }
  };

  if (!taste) {
    return res.json({
      message: "Add a taste parameter to get advice. Example: /flavor?taste=sour",
      available: Object.keys(problems)
    });
  }

  const result = problems[taste.toLowerCase()];
  if (!result) {
    return res.status(404).json({
      error: "Taste not recognised",
      available: Object.keys(problems)
    });
  }

  res.json(result);
});

// ─────────────────────────────────────────
// BREWING GUIDES
// ─────────────────────────────────────────
app.get("/brewing-guides", (req, res) => {
  res.json([
    {
      method: "V60 Pour Over",
      roast: "Light",
      grind: "Medium-fine (adjust for origin — faster for high-solubility Ethiopians like Guji)",
      temp: "211°F / 99.4°C",
      ratio: "1:18 (23g coffee / 415g water)",
      time: "Pour windows — no strict total time",
      extraction_target: "18–22% extraction yield. Target 20.5–21% measured with VST refractometer.",
      pour_protocol: [
        "Bloom: Pour 65g within 10 seconds. Wait until 1:00.",
        "2nd pour: At 1:00, pour to 275g total. Done by 1:15.",
        "3rd pour: At 1:30, pour to 415g total. Done by 1:45 (no more than 15 seconds)."
      ],
      flavor_profile: "Highlights acidity and clarity. Best for showcasing bright, floral, and complex origins. Preferred for washed Ethiopians and high-acidity lots.",
      tips: "V60 is chosen when you want to highlight acidity and delicate aromatics. More soluble coffees like Guji Ethiopians will brew faster — adjust grind coarser to compensate. Baristas tend to favor Kalita for its forgiveness, but V60 rewards precision."
    },
    {
      method: "Kalita Wave",
      roast: "Light / Medium",
      grind: "Medium (adjust for origin — faster for high-solubility Ethiopians like Guji)",
      temp: "211°F / 99.4°C",
      ratio: "1:18 (23g coffee / 415g water)",
      time: "Pour windows — no strict total time",
      extraction_target: "18–22% extraction yield. Target 20.5–21% measured with VST refractometer.",
      pour_protocol: [
        "Bloom: Pour 65g within 10 seconds. Wait until 1:00.",
        "2nd pour: At 1:00, pour to 275g total. Done by 1:15.",
        "3rd pour: At 1:30, pour to 415g total. Done by 1:45 (no more than 15 seconds)."
      ],
      flavor_profile: "Highlights sweetness and body. Flat bed produces even extraction — particularly effective for naturals and honey process coffees.",
      tips: "Kalita is the workhorse of specialty pour over. The flat bed and three-hole design forgive minor pour inconsistencies better than the V60. Especially effective for naturals — the even extraction draws out sweetness beautifully. Most baristas prefer this over the V60 for its consistency."
    },
    {
      method: "Chemex",
      roast: "Light / Medium — used exclusively for decaf",
      grind: "Coarse — significantly coarser than V60 or Kalita to compensate for filter resistance",
      temp: "211°F / 99.4°C",
      ratio: "1:18 (23g coffee / 415g water)",
      time: "Pour windows same as V60/Kalita but brew times are less consistent due to filter thickness",
      extraction_target: "18–22% extraction yield. Target 20.5–21% measured with VST refractometer.",
      pour_protocol: [
        "Bloom: Pour 65g within 10 seconds. Wait until 1:00.",
        "2nd pour: At 1:00, pour to 275g total. Done by 1:15.",
        "3rd pour: At 1:30, pour to 415g total. Done by 1:45 (no more than 15 seconds)."
      ],
      flavor_profile: "Exceptionally clean and bright. Thick Chemex filters remove more oils and fines than V60 or Kalita, producing the clearest cup of the three.",
      tips: "At Intelligentsia, Chemex was used exclusively for decaf. The thick bonded filter creates significantly more flow resistance than V60 or Kalita filters — grind much coarser than you think you need. Because of this resistance, brew times are less predictable and consistent than V60 or Kalita. Same dose, ratio, and pour protocol applies but expect more variability. The payoff is an exceptionally clean, bright cup that showcases the best of well-processed decaf."
    },
    {
      method: "French Press",
      roast: "Medium / Dark",
      grind: "Coarse",
      temp: "92–94°C",
      ratio: "1:15",
      time: "4:00 min steep",
      tips: "Do not stir after plunging. For cleaner results, let grounds settle 1 min before pouring. Full immersion = full body."
    },
    {
      method: "AeroPress",
      roast: "Any",
      grind: "Medium-fine (adjust to taste)",
      temp: "80–96°C",
      ratio: "1:12 to 1:16",
      time: "1:00–2:00 min",
      tips: "Most versatile brewer available. Inverted method gives more control. Experiment freely — there is no wrong way to use an AeroPress."
    },
    {
      method: "Moka Pot",
      roast: "Medium / Dark",
      grind: "Fine (not espresso-fine)",
      temp: "Use pre-heated water",
      ratio: "Fill basket level, no tamping",
      time: "4–5 min on low heat",
      tips: "Use pre-boiled water to avoid a metallic taste. Remove from heat when you hear a hissing/sputtering sound. Not espresso — but close."
    },
    {
      method: "Espresso",
      roast: "Medium / Dark",
      grind: "Very fine — adjusted per style and coffee",
      temp: "198–200°F / 92.2–93.3°C",
      ratio: "Normale: 1:2.5 (18g in, 45g out)",
      time: "25–30 sec for normale. Varies by style.",
      certification: "Baristas must be certified before dialing espresso. Espresso is the highest form of coffee brewing — everything is intense yet nuanced. Bad extractions are obvious. Great to excellent shots are the required norm. The occasional god shot is always welcome.",
      styles: [
        {
          name: "Ristretto",
          ratio: "1:1 to 1:1.5 (18g in, 18–27g out)",
          time: "18–22 sec",
          character: "Intense, syrupy, concentrated sweetness. Only the earliest and most soluble compounds extracted. No room for error."
        },
        {
          name: "Normale",
          ratio: "1:2.5 (18g in, 45g out)",
          time: "25–30 sec",
          character: "The Intelligentsia standard. High extraction pushing toward lungo territory. Balanced intensity with complexity. Sweet, full, and lingering."
        },
        {
          name: "Lungo",
          ratio: "1:3 to 1:3.5 (18g in, 54–63g out)",
          time: "35–45 sec",
          character: "Extended extraction. More bitter compounds present but balanced by high sweetness when dialed correctly. Not for every coffee."
        },
        {
          name: "Turbo Shot",
          ratio: "1:2.5 (same as normale)",
          time: "22–24 sec",
          grind: "Coarser than normale — faster flow rate",
          character: "Same dose, coarser grind, faster shot time. Reduces bitterness and increases clarity. Some coffees taste significantly better as turbo shots — particularly naturals and high-clarity lots."
        }
      ],
      tips: "Espresso is the highest form of coffee brewing — every variable is amplified. Dial in grind first, one click at a time. Always pull on a scale. Sour or fast = grind finer. Bitter or slow = grind coarser. Not every coffee suits every style — part of the craft is knowing which style serves the coffee best.",
      evaluation: {
        philosophy: "Espresso evaluation is based entirely on quality in the cup. Shot time and yield are starting points — the cup tells you the truth. A balanced shot has sweetness that carries through to a long, lingering finish. That finish is your most important diagnostic tool.",
        primary_indicators: [
          { indicator: "Balanced", description: "Sweetness present from first sip through to a long lingering finish. Complexity without harshness. This is the target — great to excellent is the required norm." },
          { indicator: "Sour finish", description: "Under-extracted. The shot may taste okay upfront but the finish turns sour or sharp rather than sweet. Grind finer, slow the shot down, or check your dose." },
          { indicator: "Bitter or dry finish", description: "Over-extracted. Harsh compounds dominating the back palate. Grind coarser, speed the shot up, or reduce yield." },
          { indicator: "Flat or hollow", description: "Low extraction overall. No sweetness, no complexity, no finish. Often a channeling issue or uneven distribution. Check your tamp and distribution before adjusting grind." },
          { indicator: "Sharp or astringent", description: "Over-extracted or water too hot. The dryness coats the mouth. Drop temperature slightly or grind coarser." }
        ],
        refractometer_protocol: {
          tool: "VST refractometer",
          when_to_use: "When a barista is having difficulty dialing in and sensory evaluation alone is not resolving the issue. Even the most experienced baristas hit walls — the refractometer removes guesswork and shows exactly what is happening in the cup.",
          target_extraction: "18–22% extraction yield. Target 20.5–21% for the Intelligentsia normale standard.",
          target_tds: "8–12% TDS for espresso depending on style. Ristretto will be higher, lungo lower.",
          process: [
            "Pull the shot and let it cool slightly — hot samples give inaccurate readings",
            "Place a drop on the refractometer prism",
            "Read the Brix value and use the VST coffee app to calculate extraction yield",
            "Compare against your target range",
            "Adjust grind, dose, or yield based on the data combined with your sensory evaluation"
          ],
          important_note: "The refractometer confirms what your palate is telling you — it does not replace sensory evaluation. Always taste first, measure second. If the cup tastes balanced and the numbers are slightly off, trust the cup."
        }
      }
    },
    {
      method: "Cold Brew",
      roast: "Medium / Dark",
      grind: "Extra coarse",
      temp: "Cold / room temp water",
      ratio: "1:8",
      time: "12–18 hours",
      tips: "Steep in fridge for 12–18 hours. Strain through a fine mesh or filter. Dilute 1:1 with water or milk to serve. Very low acidity."
    }
  ]);
});

// ─────────────────────────────────────────
// CULTIVARS
// ─────────────────────────────────────────
app.get("/cultivars", (req, res) => {
  const { species } = req.query;

  const cultivars = [
    {
      name: "Gesha / Geisha",
      species: "arabica",
      origin: "Ethiopia → Panama",
      process: ["washed", "natural"],
      flavor: ["Jasmine", "Peach", "Tea-like", "Floral"],
      body: "Light",
      acidity: "High",
      description: "One of the most celebrated and expensive cultivars in specialty coffee. Prized for its delicate, tea-like clarity and intense floral aromatics. Exceptional in washed processing."
    },
    {
      name: "Bourbon",
      species: "arabica",
      origin: "Réunion Island",
      process: ["washed", "natural", "honey"],
      flavor: ["Caramel", "Red apple", "Brown sugar", "Milk chocolate"],
      body: "Medium",
      acidity: "Medium",
      description: "Classic sweetness with caramel and red fruit notes. Foundation of many Latin American and Philippine specialty coffees. Natural processing intensifies its fruit complexity."
    },
    {
      name: "Typica",
      species: "arabica",
      origin: "Yemen / Ethiopia",
      process: ["washed"],
      flavor: ["Sweet", "Clean", "Citrus", "Silky"],
      body: "Medium",
      acidity: "Medium-low",
      description: "One of the oldest cultivars. Clean, sweet, and elegant with a silky body. Used as a benchmark for quality in Central America and Indonesia."
    },
    {
      name: "Catimor",
      species: "arabica",
      origin: "Portugal (Timor Hybrid × Caturra)",
      process: ["washed", "natural"],
      flavor: ["Earthy", "Nutty", "Herbal"],
      body: "Full",
      acidity: "Low",
      description: "The most widely grown cultivar in the Philippines due to its disease resistance and productivity. Cup quality varies — exceptional terroir and processing can produce a clean, satisfying cup."
    },
    {
      name: "SL28 / SL34",
      species: "arabica",
      origin: "Kenya (Scott Laboratories)",
      process: ["washed"],
      flavor: ["Blackcurrant", "Tomato", "Dark berry", "Citrus"],
      body: "Medium",
      acidity: "Very high",
      description: "The backbone of Kenya's famous cup profile. Exceptional brightness and complex fruit. Developed by Scott Laboratories in the 1930s specifically for Kenyan growing conditions."
    },
    {
      name: "Catuai",
      species: "arabica",
      origin: "Brazil (Mundo Novo × Caturra)",
      process: ["natural", "honey", "washed"],
      flavor: ["Chocolate", "Dried fruit", "Nutty", "Brown sugar"],
      body: "Medium-full",
      acidity: "Medium",
      description: "Very common in Brazil and Central America. Natural processing brings out its chocolate and dried fruit character beautifully."
    },
    {
      name: "Fine Robusta",
      species: "robusta",
      origin: "Philippines (Bukidnon, Cavite)",
      process: ["washed", "natural"],
      flavor: ["Dark chocolate", "Earthy", "Bold", "Creamy"],
      body: "Full",
      acidity: "Low",
      description: "Not commodity Robusta. When processed with the same care as specialty Arabica, Philippine fine Robusta produces a clean, complex cup with exceptional crema. Higher altitude lots from Bukidnon are particularly impressive."
    },
    {
      name: "Kapeng Barako (True)",
      species: "liberica",
      origin: "Batangas and Cavite, Philippines",
      process: ["natural"],
      flavor: ["Woody", "Smoky", "Bold", "Floral nose"],
      body: "Very full",
      acidity: "Low",
      description: "True Barako is Coffea liberica grown specifically in Batangas (and historically Cavite). Bold, woody, smoky with a signature floral aroma unlike any other species. An endangered Philippine agricultural treasure."
    },
    {
      name: "Excelsa",
      species: "liberica",
      origin: "Philippines (Mindanao, Visayas)",
      process: ["natural", "washed"],
      flavor: ["Tart", "Fruity", "Wine-like", "Dark fruit"],
      body: "Medium-full",
      acidity: "Medium-high",
      description: "Coffea liberica var. dewevrei — often mislabeled as Barako but a distinct variety with a completely different flavor profile. Tart and fruity where true Barako is bold and smoky. Deserves to be understood on its own terms."
    }
  ];

  if (species) {
    const filtered = cultivars.filter(c => c.species === species.toLowerCase());
    if (!filtered.length) {
      return res.status(404).json({
        error: "Species not found",
        available: ["arabica", "robusta", "liberica"]
      });
    }
    return res.json(filtered);
  }

  res.json(cultivars);
});

// ─────────────────────────────────────────
// PROCESSING METHODS
// ─────────────────────────────────────────
app.get("/processing", (req, res) => {
  const { category } = req.query;

  const methods = [
    {
      name: "Washed (Wet Process)",
      category: "traditional",
      flavor: ["Clean", "Bright", "Terroir-forward", "Crisp acidity"],
      body: "Light to medium",
      description: "Pulp removed mechanically, then fermented in water to remove mucilage before drying. Produces the clearest expression of origin and cultivar. The baseline all other methods are judged against."
    },
    {
      name: "Natural (Dry Process)",
      category: "traditional",
      flavor: ["Fruity", "Winey", "Heavy body", "Fermented sweetness"],
      body: "Full",
      description: "Whole cherry dried intact on raised beds for weeks. Fruit sugars ferment into the bean producing intense fruit and wine-like sweetness. The original process — how coffee was dried in Ethiopia for centuries."
    },
    {
      name: "Honey Process",
      category: "classic",
      flavor: ["Syrupy", "Sweet", "Balanced", "Stone fruit"],
      body: "Medium to full",
      description: "Pulped but mucilage intentionally left on during drying. Yellow honey = less mucilage, cleaner. Red honey = more sweetness. Black honey = closest to natural. A bridge between washed and natural."
    },
    {
      name: "Wet Hulled (Giling Basah)",
      category: "classic",
      flavor: ["Earthy", "Herbal", "Tobacco", "Dark spice"],
      body: "Very full",
      description: "Unique to Sumatra and parts of Indonesia. Parchment removed while bean still has high moisture. Creates the distinctive earthy, herbaceous, full-bodied character Sumatran coffees are known for."
    },
    {
      name: "Double Washed (Kenya)",
      category: "developed",
      flavor: ["Crisp", "Blackcurrant", "Very bright", "Tomato"],
      body: "Medium",
      description: "After standard washed fermentation, beans are soaked again in fresh clean water for 12–72 hours. Unique to Kenyan processing — removes even more mucilage, creating exceptional clarity and intensifying acidity."
    },
    {
      name: "Extended Fermentation",
      category: "developed",
      flavor: ["Complex", "Deep sweetness", "Developed fruit"],
      body: "Medium to full",
      description: "Standard washed or natural but fermentation time deliberately lengthened — sometimes 48–96 hours. Controlled correctly it develops deeper complexity. Poorly controlled it produces over-fermented, vinegary defects."
    },
    {
      name: "Anaerobic Fermentation",
      category: "modern",
      flavor: ["Tropical fruit", "Lactic sweetness", "Funky", "Intense"],
      body: "Full",
      description: "Cherries sealed in airtight tanks with CO₂ allowed to escape via valve. Absence of oxygen shifts fermentation microbiology producing intense tropical fruit and lactic sweetness not achievable aerobically."
    },
    {
      name: "Lactic Fermentation",
      category: "modern",
      flavor: ["Creamy", "Yogurt", "Soft acidity", "Smooth"],
      body: "Medium-full",
      description: "A specific type of anaerobic fermentation managed to favor lactic acid bacteria. Produces creamy, yogurt-like sweetness with reduced sharpness. Lower water activity encourages lactobacillus activity."
    },
    {
      name: "Carbonic Maceration",
      category: "experimental",
      flavor: ["Juicy", "Clean fruit", "Low bitterness", "Bright"],
      body: "Medium",
      description: "Borrowed from Beaujolais wine. Whole intact cherries sealed in CO₂-saturated tanks — fermentation begins intracellularly inside the cherry itself. Produces remarkably clean, intense, juicy fruit. Pioneered by 2015 World Barista Champion Sasa Sestic."
    },
    {
      name: "Yeast Inoculation",
      category: "experimental",
      flavor: ["Controlled", "Consistent", "Precise fruit"],
      body: "Variable",
      description: "Specific commercial or cultured yeast strains introduced into fermentation to steer flavor development. Produces highly consistent and intentional profiles. Controversial — moves away from terroir-driven fermentation toward recipe-driven processing."
    },
    {
      name: "Co-Fermentation",
      category: "experimental",
      flavor: ["Infused", "Unique", "Variable"],
      body: "Variable",
      description: "Coffee fermented alongside other ingredients — fruit pulp, juice, cinnamon, even alcohol. Bean absorbs aromatic compounds during fermentation. Results range from extraordinary to gimmicky depending on execution."
    },
    {
      name: "Barrel Aged",
      category: "experimental",
      flavor: ["Whiskey", "Wine", "Vanilla", "Layered complexity"],
      body: "Full",
      description: "Green beans rested in wine, whiskey, rum, or other spirit barrels before roasting. Porous green bean absorbs volatile compounds from the wood and residual liquid. Risks overwhelming the coffee's inherent character if overdone."
    }
  ];

  if (category) {
    const filtered = methods.filter(m => m.category === category.toLowerCase());
    if (!filtered.length) {
      return res.status(404).json({
        error: "Category not found",
        available: ["traditional", "classic", "developed", "modern", "experimental"]
      });
    }
    return res.json(filtered);
  }

  res.json(methods);
});

// ─────────────────────────────────────────
// PHILIPPINE ORIGINS
// ─────────────────────────────────────────
app.get("/origins/philippines", (req, res) => {
  res.json([
    {
      region: "Benguet, Cordillera",
      altitude: "1,200–1,800 masl",
      species: ["Arabica"],
      process: ["Washed", "Natural"],
      flavor: ["Citrus", "Floral", "Bright acidity", "Clean"],
      description: "The highest growing region in the Philippines. Altitude produces a bright, complex cup with pronounced acidity and floral clarity. One of the most celebrated Philippine origins in the specialty scene."
    },
    {
      region: "Sagada, Mountain Province",
      altitude: "1,500 masl",
      species: ["Arabica"],
      process: ["Washed"],
      flavor: ["Fruity", "Bright", "Clean", "Sweet"],
      description: "Community-processed Arabica from the highlands of Mountain Province. Known for its clean, bright character. Often sold as single origin by Philippine specialty roasters."
    },
    {
      region: "Mt. Apo, Davao",
      altitude: "900–1,500 masl",
      species: ["Arabica"],
      process: ["Washed", "Honey"],
      flavor: ["Balanced", "Nutty", "Milk chocolate", "Mild body"],
      description: "Grown on the slopes of the Philippines' highest peak. Produces a balanced, approachable cup with good sweetness and a clean finish. Popular among specialty cafes nationwide."
    },
    {
      region: "Sultan Kudarat",
      altitude: "600–1,200 masl",
      species: ["Arabica", "Robusta"],
      process: ["Washed", "Natural"],
      flavor: ["Full body", "Earthy", "Dark chocolate", "Herbal"],
      description: "One of the largest coffee-producing provinces in Mindanao. Both Arabica and fine Robusta grown here. Full-bodied and earthy with a chocolatey depth."
    },
    {
      region: "Bukidnon",
      altitude: "600–1,400 masl",
      species: ["Arabica", "Robusta"],
      process: ["Washed", "Natural"],
      flavor: ["Clean", "Balanced", "Nutty", "Mild acidity"],
      description: "Home to some of the Philippines' most promising fine Robusta. Higher altitude lots produce cleaner, more complex cups than lowland Robusta. Arabica here is approachable and well-balanced."
    },
    {
      region: "Batangas",
      altitude: "Low altitude",
      species: ["Liberica (True Barako)"],
      process: ["Natural"],
      flavor: ["Woody", "Smoky", "Bold", "Floral nose"],
      description: "The home of authentic Kapeng Barako. Coffea liberica grown here is the real thing — bold, woody, smoky with that signature floral aroma. Very few farms still growing true Liberica. Support these producers directly."
    },
    {
      region: "Cavite",
      altitude: "Low altitude",
      species: ["Liberica (True Barako)", "Robusta"],
      process: ["Natural"],
      flavor: ["Bold", "Earthy", "Full body"],
      description: "Historically the other home of Kapeng Barako alongside Batangas. Liberica production has declined significantly but a few farms still maintain authentic Barako cultivation."
    }
  ]);
});

// ─────────────────────────────────────────
// EQUIPMENT GUIDE
// ─────────────────────────────────────────
app.get("/equipment", (req, res) => {
  const { tier } = req.query;

  const gear = [
    {
      category: "Grinder",
      tier: "entry",
      item: "Timemore C2 / Hario Skerton",
      price_php: "₱2,500–₱3,500",
      description: "The single most impactful upgrade any home brewer can make. A consistent burr grinder produces even particle sizes — the foundation of good extraction.",
      why_it_matters: "Blade grinders produce uneven particles that extract at different rates — the biggest cause of bitter and sour coffee."
    },
    {
      category: "Grinder",
      tier: "mid",
      item: "Timemore Slim Plus / 1Zpresso Q2",
      price_php: "₱5,000–₱9,000",
      description: "Significant step up in grind consistency and build quality. Suitable for pour over and espresso.",
      why_it_matters: "At this tier you will taste the difference clearly in your cup."
    },
    {
      category: "Brewer",
      tier: "entry",
      item: "Hario V60 / Cafec Flower Dripper",
      price_php: "₱800–₱1,500",
      description: "The entry point to specialty pour over. Simple, effective, produces a clean and bright cup.",
      why_it_matters: "Teaches you the fundamentals of pour control and extraction."
    },
    {
      category: "Brewer",
      tier: "entry",
      item: "AeroPress",
      price_php: "₱2,500–₱3,500",
      description: "The most versatile brewer available. Forgiving, portable, and produces excellent coffee across a wide range of styles.",
      why_it_matters: "Perfect for beginners who want to experiment without committing to one brew method."
    },
    {
      category: "Kettle",
      tier: "entry",
      item: "Gooseneck Kettle (basic)",
      price_php: "₱1,200–₱2,000",
      description: "A gooseneck spout gives you control over your pour rate and direction — essential for pour over methods.",
      why_it_matters: "Pouring from a standard kettle onto a V60 makes consistent extraction nearly impossible."
    },
    {
      category: "Kettle",
      tier: "mid",
      item: "Fellow Stagg EKG / Timemore Fish",
      price_php: "₱6,000–₱12,000",
      description: "Electric gooseneck with precise temperature control. Set your temperature and hold it throughout the brew.",
      why_it_matters: "Temperature stability is one of the most overlooked variables in home brewing."
    },
    {
      category: "Scale",
      tier: "entry",
      item: "Any kitchen scale (0.1g precision)",
      price_php: "₱500–₱1,000",
      description: "Weighing your coffee and water is the fastest way to brew consistently. Eyeballing scoops produces different results every time.",
      why_it_matters: "Consistency is the foundation of improvement. You cannot dial in a recipe you cannot measure."
    },
    {
      category: "Scale",
      tier: "mid",
      item: "Acaia Pearl / Timemore Black Mirror",
      price_php: "₱5,000–₱12,000",
      description: "Brewing scales with built-in timers and flow rate measurement. Used by professionals worldwide.",
      why_it_matters: "Flow rate feedback helps you pour more consistently, especially on V60 and Chemex."
    }
  ];

  if (tier) {
    const filtered = gear.filter(g => g.tier === tier.toLowerCase());
    if (!filtered.length) {
      return res.status(404).json({
        error: "Tier not found",
        available: ["entry", "mid"]
      });
    }
    return res.json(filtered);
  }

  res.json(gear);
});

// ─────────────────────────────────────────
// ROASTER DIRECTORY
// ─────────────────────────────────────────
app.get("/roasters", (req, res) => {
  res.json([
    {
      name: "Sample Roaster — Add Your Own",
      location: "Metro Manila",
      specialty: ["Philippine single origins", "Light roast"],
      species: ["Arabica"],
      note: "Replace this with real roaster data. Add roasters you personally know and vouch for."
    }
  ]);
});

// ─────────────────────────────────────────
// SENSORY TRAINING
// ─────────────────────────────────────────
app.get("/sensory", (req, res) => {
  res.json({
    introduction: "Sensory training is the practice of intentionally developing your ability to identify and describe what you taste. Like any skill, it improves with deliberate practice.",
    exercises: [
      {
        name: "Side-by-side comparison",
        difficulty: "Beginner",
        description: "Brew the same coffee twice — once with your usual method, once with a slight grind adjustment. Focus on identifying what changed.",
        what_to_look_for: ["Sweetness", "Acidity", "Body", "Finish length"]
      },
      {
        name: "Process comparison",
        difficulty: "Beginner",
        description: "Buy the same cultivar in both washed and natural processing from the same roaster. Brew them the same way and compare.",
        what_to_look_for: ["Fruitiness", "Clarity", "Body", "Fermentation notes"]
      },
      {
        name: "Origin blind tasting",
        difficulty: "Intermediate",
        description: "Ask someone to brew two coffees from different origins without telling you which is which. Try to identify origin characteristics.",
        what_to_look_for: ["Ethiopian floral notes", "Colombian balance", "Kenyan brightness", "Indonesian earthiness"]
      },
      {
        name: "Cooling observation",
        difficulty: "Beginner",
        description: "Taste the same cup at 70°C, 55°C, and 40°C. Notice how the flavor profile changes as it cools.",
        what_to_look_for: ["Flavors that emerge as it cools", "Acidity changes", "Sweetness perception"]
      }
    ],
    flavor_wheel_categories: [
      "Floral (jasmine, rose, elderflower)",
      "Fruity (citrus, stone fruit, berry, dried fruit)",
      "Sweet (caramel, chocolate, brown sugar, vanilla)",
      "Nutty (almond, hazelnut, peanut)",
      "Spicy (pepper, cinnamon, clove)",
      "Savory (tobacco, cedar, leather)",
      "Fermented (winey, funky, vinegar — can be positive or defect)"
    ]
  });
});

// ─────────────────────────────────────────
// CONTACT + CONSULTING
// ─────────────────────────────────────────
app.get("/contact", (req, res) => {
  res.json({
    name: "Vlad",
    app: "Bored Barista",
    email: "vlad@boredbarista.com",
    services: [
      {
        name: "Home brewer session",
        description: "One-on-one coaching session. We dial in your setup, fix your extraction, and train your palate.",
        duration: "90 minutes",
        format: "In-person or online"
      },
      {
        name: "Group sensory workshop",
        description: "Guided cupping and flavor training for groups of 4–10 people.",
        duration: "2–3 hours",
        format: "In-person"
      },
      {
        name: "Cafe / roaster consulting",
        description: "Menu development, staff training, quality control, and processing advice for cafes and roasters.",
        format: "Custom engagement"
      }
    ]
  });
});

// ─────────────────────────────────────────
// ROOT — API OVERVIEW
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    app: "Bored Barista API",
    version: "1.0",
    routes: [
      "GET /flavor?taste=sour            — Flavor troubleshooter",
      "GET /brewing-guides               — All brew method guides",
      "GET /cultivars                    — All cultivars",
      "GET /cultivars?species=arabica    — Filter by species (arabica / robusta / liberica)",
      "GET /processing                   — All processing methods",
      "GET /processing?category=modern  — Filter by category",
      "GET /origins/philippines          — Philippine regional origins",
      "GET /equipment                    — Full gear guide",
      "GET /equipment?tier=entry         — Filter by tier (entry / mid)",
      "GET /roasters                     — Roaster directory",
      "GET /sensory                      — Sensory training exercises",
      "GET /contact                      — Contact and consulting services"
    ]
  });
});

app.listen(3000, () => console.log("Bored Barista API running on http://localhost:3000"));

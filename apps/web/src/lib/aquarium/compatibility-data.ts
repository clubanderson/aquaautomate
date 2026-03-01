import type { SpeciesProfile, CompatibilityRule } from "./tank-mates";

/**
 * Curated species profiles sourced from Aquarium Co-Op, FishLore,
 * AquariumSource, Seriously Fish, and other reputable aquarium references.
 */
export const SPECIES_PROFILES: SpeciesProfile[] = [
  {
    species: "Neon Tetra",
    scientificName: "Paracheirodon innesi",
    matchKeywords: ["neon tetra"],
    temperament: "peaceful",
    waterParams: { tempMinF: 70, tempMaxF: 81, phMin: 6.0, phMax: 7.0 },
    minTankGallons: 10,
    swimLevel: "mid",
  },
  {
    species: "Guppy",
    scientificName: "Poecilia reticulata",
    matchKeywords: ["guppy", "guppies"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 82, phMin: 6.8, phMax: 7.8 },
    minTankGallons: 10,
    swimLevel: "top",
  },
  {
    species: "Betta",
    scientificName: "Betta splendens",
    matchKeywords: ["betta", "siamese fighting fish"],
    temperament: "semi-aggressive",
    waterParams: { tempMinF: 76, tempMaxF: 82, phMin: 6.5, phMax: 7.5 },
    minTankGallons: 5,
    swimLevel: "top",
  },
  {
    species: "Corydoras",
    scientificName: "Corydoras spp.",
    matchKeywords: ["corydoras", "cory", "cory catfish"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 79, phMin: 6.0, phMax: 7.5 },
    minTankGallons: 20,
    swimLevel: "bottom",
  },
  {
    species: "Angelfish",
    scientificName: "Pterophyllum scalare",
    matchKeywords: ["angelfish", "angel"],
    temperament: "semi-aggressive",
    waterParams: { tempMinF: 76, tempMaxF: 84, phMin: 6.0, phMax: 7.5 },
    minTankGallons: 30,
    swimLevel: "mid",
  },
  {
    species: "Molly",
    scientificName: "Poecilia sphenops",
    matchKeywords: ["molly", "mollies"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 82, phMin: 7.0, phMax: 8.5 },
    minTankGallons: 20,
    swimLevel: "mid",
  },
  {
    species: "Platy",
    scientificName: "Xiphophorus maculatus",
    matchKeywords: ["platy", "platies"],
    temperament: "peaceful",
    waterParams: { tempMinF: 70, tempMaxF: 80, phMin: 7.0, phMax: 8.2 },
    minTankGallons: 10,
    swimLevel: "mid",
  },
  {
    species: "Swordtail",
    scientificName: "Xiphophorus hellerii",
    matchKeywords: ["swordtail"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 82, phMin: 7.0, phMax: 8.4 },
    minTankGallons: 20,
    swimLevel: "mid",
  },
  {
    species: "Cherry Barb",
    scientificName: "Puntius titteya",
    matchKeywords: ["cherry barb"],
    temperament: "peaceful",
    waterParams: { tempMinF: 73, tempMaxF: 81, phMin: 6.0, phMax: 7.0 },
    minTankGallons: 20,
    swimLevel: "mid",
  },
  {
    species: "Harlequin Rasbora",
    scientificName: "Trigonostigma heteromorpha",
    matchKeywords: ["harlequin rasbora", "rasbora"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 81, phMin: 6.0, phMax: 7.5 },
    minTankGallons: 10,
    swimLevel: "mid",
  },
  {
    species: "Dwarf Gourami",
    scientificName: "Trichogaster lalius",
    matchKeywords: ["dwarf gourami", "gourami"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 82, phMin: 6.0, phMax: 7.5 },
    minTankGallons: 10,
    swimLevel: "top",
  },
  {
    species: "Bristlenose Pleco",
    scientificName: "Ancistrus spp.",
    matchKeywords: ["bristlenose pleco", "bristlenose", "pleco"],
    temperament: "peaceful",
    waterParams: { tempMinF: 73, tempMaxF: 81, phMin: 6.5, phMax: 7.5 },
    minTankGallons: 20,
    swimLevel: "bottom",
  },
  {
    species: "Otocinclus",
    scientificName: "Otocinclus spp.",
    matchKeywords: ["otocinclus", "oto", "otto"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 79, phMin: 6.0, phMax: 7.5 },
    minTankGallons: 10,
    swimLevel: "bottom",
  },
  {
    species: "Cherry Shrimp",
    scientificName: "Neocaridina davidi",
    matchKeywords: ["cherry shrimp", "neocaridina", "red shrimp"],
    temperament: "peaceful",
    waterParams: { tempMinF: 65, tempMaxF: 80, phMin: 6.5, phMax: 8.0 },
    minTankGallons: 5,
    swimLevel: "bottom",
  },
  {
    species: "Amano Shrimp",
    scientificName: "Caridina multidentata",
    matchKeywords: ["amano shrimp", "amano"],
    temperament: "peaceful",
    waterParams: { tempMinF: 70, tempMaxF: 80, phMin: 6.5, phMax: 7.5 },
    minTankGallons: 10,
    swimLevel: "bottom",
  },
  {
    species: "Nerite Snail",
    scientificName: "Neritina spp.",
    matchKeywords: ["nerite snail", "nerite"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 78, phMin: 7.0, phMax: 8.5 },
    minTankGallons: 5,
    swimLevel: "bottom",
  },
  {
    species: "Mystery Snail",
    scientificName: "Pomacea bridgesii",
    matchKeywords: ["mystery snail"],
    temperament: "peaceful",
    waterParams: { tempMinF: 68, tempMaxF: 82, phMin: 7.0, phMax: 8.0 },
    minTankGallons: 5,
    swimLevel: "bottom",
  },
  /* Additional species matching actual store products */
  {
    species: "Tiger Barb",
    scientificName: "Puntigrus tetrazona",
    matchKeywords: ["tiger barb", "blushing tiger barb"],
    temperament: "semi-aggressive",
    waterParams: { tempMinF: 74, tempMaxF: 82, phMin: 6.0, phMax: 8.0 },
    minTankGallons: 20,
    swimLevel: "mid",
  },
  {
    species: "Danio",
    scientificName: "Danio spp.",
    matchKeywords: ["danio", "zebra danio", "leopard danio", "giant danio"],
    temperament: "peaceful",
    waterParams: { tempMinF: 64, tempMaxF: 78, phMin: 6.5, phMax: 7.5 },
    minTankGallons: 10,
    swimLevel: "top",
  },
  {
    species: "Rainbowfish",
    scientificName: "Melanotaeniidae spp.",
    matchKeywords: ["rainbowfish", "rainbow", "boesemani", "threadfin"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 82, phMin: 6.5, phMax: 8.0 },
    minTankGallons: 30,
    swimLevel: "mid",
  },
  {
    species: "Clown Loach",
    scientificName: "Chromobotia macracanthus",
    matchKeywords: ["clown loach", "loach", "yoyo loach", "pakistani loach"],
    temperament: "peaceful",
    waterParams: { tempMinF: 77, tempMaxF: 86, phMin: 6.0, phMax: 7.5 },
    minTankGallons: 75,
    swimLevel: "bottom",
  },
  {
    species: "African Cichlid",
    scientificName: "Various (Mbuna, Peacock, Hap)",
    matchKeywords: ["african cichlid", "cichlid ob", "jewel cichlid", "jewel fish", "buffalo head cichlid"],
    temperament: "semi-aggressive",
    waterParams: { tempMinF: 76, tempMaxF: 82, phMin: 7.8, phMax: 8.6 },
    minTankGallons: 55,
    swimLevel: "mid",
  },
  {
    species: "American Cichlid",
    scientificName: "Various (Geophagus, Convict, etc.)",
    matchKeywords: ["american cichlid", "convict", "jack dempsey", "green terror", "acara", "geophagus", "managuensis"],
    temperament: "semi-aggressive",
    waterParams: { tempMinF: 72, tempMaxF: 82, phMin: 6.0, phMax: 7.5 },
    minTankGallons: 40,
    swimLevel: "mid",
  },
  {
    species: "Knifefish",
    scientificName: "Various (Chitala, Xenomystus)",
    matchKeywords: ["knifefish", "knife fish", "clown knife"],
    temperament: "semi-aggressive",
    waterParams: { tempMinF: 75, tempMaxF: 82, phMin: 6.0, phMax: 7.0 },
    minTankGallons: 100,
    swimLevel: "bottom",
  },
  {
    species: "Goldfish",
    scientificName: "Carassius auratus",
    matchKeywords: ["goldfish", "oranda", "ryukin", "ranchu"],
    temperament: "peaceful",
    waterParams: { tempMinF: 60, tempMaxF: 74, phMin: 6.5, phMax: 7.5 },
    minTankGallons: 20,
    swimLevel: "mid",
  },
  {
    species: "Puffer",
    scientificName: "Various (Tetraodon, Dichotomyctere)",
    matchKeywords: ["puffer", "figure eight puffer"],
    temperament: "semi-aggressive",
    waterParams: { tempMinF: 74, tempMaxF: 82, phMin: 7.0, phMax: 8.0 },
    minTankGallons: 30,
    swimLevel: "mid",
  },
  {
    species: "Catfish",
    scientificName: "Various (Synodontis, Pimelodus)",
    matchKeywords: ["catfish", "bumblebee catfish", "pictus catfish"],
    temperament: "peaceful",
    waterParams: { tempMinF: 72, tempMaxF: 82, phMin: 6.0, phMax: 7.5 },
    minTankGallons: 30,
    swimLevel: "bottom",
  },
];

/**
 * Compatibility rules matrix.
 * Only explicitly listed pairs are shown — unlisted pairs default to "compatible"
 * for peaceful species or "caution" involving semi-aggressive species.
 */
export const COMPATIBILITY_RULES: CompatibilityRule[] = [
  /* Betta conflicts */
  { speciesA: "Betta", speciesB: "Guppy", compatibility: "incompatible", note: "Bettas often attack guppies, mistaking long fins for rival males." },
  { speciesA: "Betta", speciesB: "Betta", compatibility: "incompatible", note: "Male bettas are highly territorial and will fight to the death." },
  { speciesA: "Betta", speciesB: "Dwarf Gourami", compatibility: "incompatible", note: "Both are labyrinth fish and may see each other as rivals." },
  { speciesA: "Betta", speciesB: "Cherry Shrimp", compatibility: "caution", note: "Bettas may eat small shrimp. Provide dense plant cover for hiding." },
  { speciesA: "Betta", speciesB: "Neon Tetra", compatibility: "caution", note: "Can work in 20+ gallon tanks with lots of plants. Monitor closely." },
  { speciesA: "Betta", speciesB: "Corydoras", compatibility: "compatible", note: "Corydoras stay on the bottom and are generally ignored by bettas." },
  { speciesA: "Betta", speciesB: "Nerite Snail", compatibility: "compatible", note: "Nerite snails are too large and armored for bettas to harm." },
  { speciesA: "Betta", speciesB: "Mystery Snail", compatibility: "compatible", note: "Mystery snails are generally safe with bettas." },

  /* Angelfish conflicts */
  { speciesA: "Angelfish", speciesB: "Neon Tetra", compatibility: "caution", note: "Adult angelfish may eat small neon tetras. Safer with larger tetras." },
  { speciesA: "Angelfish", speciesB: "Cherry Shrimp", compatibility: "incompatible", note: "Angelfish will eat cherry shrimp on sight." },
  { speciesA: "Angelfish", speciesB: "Guppy", compatibility: "caution", note: "Angelfish may nip at guppy fins. Best avoided." },
  { speciesA: "Angelfish", speciesB: "Amano Shrimp", compatibility: "caution", note: "Large amano shrimp may survive, but smaller ones are at risk." },

  /* Peaceful community pairings */
  { speciesA: "Neon Tetra", speciesB: "Corydoras", compatibility: "compatible", note: "Classic peaceful community combination. Both prefer soft, acidic water." },
  { speciesA: "Neon Tetra", speciesB: "Cherry Shrimp", compatibility: "compatible", note: "Neon tetras are too small to threaten adult cherry shrimp." },
  { speciesA: "Guppy", speciesB: "Corydoras", compatibility: "compatible", note: "Excellent community pairing. No conflicts." },
  { speciesA: "Guppy", speciesB: "Platy", compatibility: "compatible", note: "Peaceful livebearers that coexist well together." },
  { speciesA: "Guppy", speciesB: "Molly", compatibility: "compatible", note: "Both livebearers, similar water parameters." },
  { speciesA: "Cherry Barb", speciesB: "Corydoras", compatibility: "compatible", note: "Both peaceful and prefer similar water conditions." },
  { speciesA: "Harlequin Rasbora", speciesB: "Neon Tetra", compatibility: "compatible", note: "Both are peaceful schooling fish that mix well." },
  { speciesA: "Bristlenose Pleco", speciesB: "Corydoras", compatibility: "compatible", note: "Both are peaceful bottom-dwellers. Provide enough space." },

  /* Tiger Barb interactions */
  { speciesA: "Tiger Barb", speciesB: "Angelfish", compatibility: "incompatible", note: "Tiger barbs are notorious fin nippers — they will shred angelfish fins." },
  { speciesA: "Tiger Barb", speciesB: "Betta", compatibility: "incompatible", note: "Tiger barbs will relentlessly nip at betta fins." },
  { speciesA: "Tiger Barb", speciesB: "Guppy", compatibility: "incompatible", note: "Tiger barbs will nip guppy fins. Keep with short-finned species instead." },
  { speciesA: "Tiger Barb", speciesB: "Cherry Barb", compatibility: "compatible", note: "Both barbs — cherry barbs are peaceful and usually left alone in a large group." },
  { speciesA: "Tiger Barb", speciesB: "Clown Loach", compatibility: "compatible", note: "Classic pairing. Clown loaches are too large and fast for tiger barbs to bother." },

  /* Cichlid interactions */
  { speciesA: "African Cichlid", speciesB: "Neon Tetra", compatibility: "incompatible", note: "African cichlids will eat small tetras. Only keep with similar-sized cichlids." },
  { speciesA: "African Cichlid", speciesB: "Cherry Shrimp", compatibility: "incompatible", note: "Cichlids will eat shrimp. Never combine." },
  { speciesA: "African Cichlid", speciesB: "American Cichlid", compatibility: "incompatible", note: "Different water requirements (alkaline vs neutral) — do not mix." },
  { speciesA: "American Cichlid", speciesB: "Neon Tetra", compatibility: "incompatible", note: "Most American cichlids will eat small tetras." },
  { speciesA: "American Cichlid", speciesB: "Cherry Shrimp", compatibility: "incompatible", note: "Cichlids will eat shrimp on sight." },

  /* Goldfish interactions */
  { speciesA: "Goldfish", speciesB: "Neon Tetra", compatibility: "incompatible", note: "Goldfish are coldwater, tetras are tropical — incompatible temperatures." },
  { speciesA: "Goldfish", speciesB: "Betta", compatibility: "incompatible", note: "Different temperature needs and bettas may be harassed." },
  { speciesA: "Goldfish", speciesB: "Corydoras", compatibility: "caution", note: "Temperature overlap is narrow. Goldfish may outcompete corys for food." },

  /* Puffer interactions */
  { speciesA: "Puffer", speciesB: "Cherry Shrimp", compatibility: "incompatible", note: "Puffers eat invertebrates — shrimp are food, not tank mates." },
  { speciesA: "Puffer", speciesB: "Nerite Snail", compatibility: "incompatible", note: "Puffers eat snails — it's part of their diet." },
  { speciesA: "Puffer", speciesB: "Neon Tetra", compatibility: "caution", note: "Some puffers may nip at small fish. Species-dependent." },

  /* Knifefish interactions */
  { speciesA: "Knifefish", speciesB: "Cherry Shrimp", compatibility: "incompatible", note: "Knifefish are predatory and will eat small shrimp." },
  { speciesA: "Knifefish", speciesB: "Neon Tetra", compatibility: "incompatible", note: "Knifefish will eat any fish small enough to fit in their mouth." },
];

/**
 * Non-fish product compatibility notes.
 * Maps product type or tag keywords to a description of how
 * the product relates to fish compatibility.
 */
export const NON_FISH_COMPATIBILITY: {
  keywords: string[];
  note: string;
  relatedSpecies: string[];
}[] = [
  {
    keywords: ["driftwood", "spider wood", "mopani"],
    note: "Driftwood provides hiding spots and lowers pH slightly — great for Corydoras, Plecos, and shrimp. It also grows beneficial biofilm that Otocinclus and shrimp graze on.",
    relatedSpecies: ["Corydoras", "Bristlenose Pleco", "Otocinclus", "Cherry Shrimp", "Amano Shrimp"],
  },
  {
    keywords: ["java fern", "anubias", "live plant", "plants", "aquarium plant"],
    note: "Live plants provide cover for small fish and shrimp, reduce stress, and improve water quality. Bettas, shrimp, and tetras especially benefit from planted tanks.",
    relatedSpecies: ["Betta", "Neon Tetra", "Cherry Shrimp", "Amano Shrimp", "Harlequin Rasbora"],
  },
  {
    keywords: ["filter", "sponge filter", "canister"],
    note: "Gentle filtration is essential for shrimp and fry. Sponge filters are ideal for breeding tanks and shrimp colonies.",
    relatedSpecies: ["Cherry Shrimp", "Amano Shrimp", "Guppy", "Neon Tetra"],
  },
  {
    keywords: ["heater", "aquarium heater"],
    note: "A reliable heater keeps tropical fish healthy. Most community fish need 74-80\u00B0F.",
    relatedSpecies: ["Neon Tetra", "Betta", "Corydoras", "Angelfish"],
  },
  {
    keywords: ["light", "led", "spectrum"],
    note: "Good lighting promotes plant growth, which benefits all fish by improving water quality and providing natural cover.",
    relatedSpecies: [],
  },
  {
    keywords: ["substrate", "gravel", "sand"],
    note: "Sand substrate is best for Corydoras and loaches who sift through it. Fine gravel works for most community setups.",
    relatedSpecies: ["Corydoras", "Bristlenose Pleco", "Cherry Shrimp"],
  },
  {
    keywords: ["rock", "stone", "dragon stone", "seiryu"],
    note: "Rocks provide territory markers and hiding spots. Seiryu stone raises pH slightly, which livebearers prefer.",
    relatedSpecies: ["Bristlenose Pleco", "Molly", "Platy", "Nerite Snail"],
  },
];

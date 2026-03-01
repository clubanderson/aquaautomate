import type { SpeciesProfile, CompatibilityRule } from "./tank-mates";

/**
 * Curated species profiles sourced from Aquarium Co-Op, FishLore,
 * AquariumSource, Seriously Fish, and other reputable aquarium references.
 */
export const SPECIES_PROFILES: SpeciesProfile[] = [
  {
    species: "Neon Tetra",
    scientificName: "Paracheirodon innesi",
    matchKeywords: ["neon tetra", "neon", "tetra"],
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

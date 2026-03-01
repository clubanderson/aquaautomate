/** Compatibility between two species */
export type Compatibility = "compatible" | "caution" | "incompatible";

/** A freshwater species profile */
export interface SpeciesProfile {
  /** Common name */
  species: string;
  /** Scientific name */
  scientificName: string;
  /** Keywords to match against product titles and tags */
  matchKeywords: string[];
  /** General temperament */
  temperament: "peaceful" | "semi-aggressive" | "aggressive";
  /** Water parameter ranges */
  waterParams: {
    tempMinF: number;
    tempMaxF: number;
    phMin: number;
    phMax: number;
  };
  /** Minimum tank size in gallons */
  minTankGallons: number;
  /** Where the fish primarily swims */
  swimLevel: "top" | "mid" | "bottom" | "all";
}

/** A compatibility rule between two species */
export interface CompatibilityRule {
  speciesA: string;
  speciesB: string;
  compatibility: Compatibility;
  note: string;
}

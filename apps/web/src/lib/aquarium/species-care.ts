/**
 * Extended care data for species care sheet pages.
 * Keyed by species name (must match SPECIES_PROFILES.species exactly).
 */

export interface SpeciesCareData {
  /** URL-safe slug for the species page */
  slug: string;
  /** Short description for the hero */
  summary: string;
  /** Diet description */
  diet: string;
  /** Lifespan range */
  lifespan: string;
  /** Adult size range */
  adultSize: string;
  /** Natural habitat description */
  habitat: string;
  /** Recommended group size */
  groupSize: string;
  /** Breeding difficulty and notes */
  breeding: string;
  /** Special care notes / tips */
  careTips: string[];
  /** Featured image path (placeholder for now) */
  image?: string;
}

/** Number of compatible species to feature on care sheet pages */
export const CARE_SHEET_COMPAT_COUNT = 6;

export const SPECIES_CARE: Record<string, SpeciesCareData> = {
  "Neon Tetra": {
    slug: "neon-tetra",
    summary:
      "One of the most popular freshwater fish in the hobby. Neon tetras are peaceful schooling fish known for their iridescent blue and red stripe. Perfect for beginners and community tanks.",
    diet: "Omnivore — accepts high-quality flake food, micro pellets, frozen/freeze-dried brine shrimp, daphnia, and bloodworms. Feed small amounts 1-2 times daily.",
    lifespan: "5–8 years",
    adultSize: "1.2 inches (3 cm)",
    habitat:
      "Native to blackwater streams in the Amazon basin (Peru, Colombia, Brazil). Prefers dim lighting, dark substrate, and dense vegetation.",
    groupSize: "6+ (school of 10–12 recommended)",
    breeding:
      "Moderate difficulty. Egg scatterers — need soft, acidic water (pH 5.0-6.0) and dim lighting. Remove adults after spawning to prevent egg predation.",
    careTips: [
      "Keep in schools of 6 or more — they feel safest in groups and display better color",
      "Provide plenty of plants and hiding spots to mimic their natural habitat",
      "Sensitive to water parameter swings — acclimate slowly and keep parameters stable",
      "Prone to neon tetra disease (Pleistophora) — quarantine new additions",
      "Lower lighting brings out their best colors",
    ],
  },
  Guppy: {
    slug: "guppy",
    summary:
      "The quintessential beginner fish. Guppies are hardy, colorful, and breed readily. Males display spectacular tail colors and patterns. Great for community tanks.",
    diet: "Omnivore — flake food, micro pellets, blanched vegetables (zucchini, peas), frozen brine shrimp, daphnia. Feed 1-2 times daily in small amounts.",
    lifespan: "2–3 years",
    adultSize: "1.5–2.5 inches (4–6 cm)",
    habitat:
      "Native to streams and pools in South America and the Caribbean. Adaptable to a wide range of water conditions.",
    groupSize: "3+ (keep 2-3 females per male to reduce harassment)",
    breeding:
      "Very easy — livebearers that breed prolifically. Females can store sperm for months. Provide floating plants for fry to hide in, or use a breeding box.",
    careTips: [
      "Males are more colorful; females are larger and plainer",
      "Will breed constantly — plan for population control or separate sexes",
      "Hardy but prefer slightly hard, alkaline water",
      "Prone to fin rot in poor water conditions — keep up with water changes",
      "Peaceful with almost everything except fin nippers",
    ],
  },
  Betta: {
    slug: "betta",
    summary:
      "The Siamese fighting fish — one of the most recognizable aquarium fish. Males have spectacular flowing fins and vibrant colors. Can be kept in community tanks with care.",
    diet: "Carnivore — betta pellets, frozen/freeze-dried bloodworms, brine shrimp, daphnia. Avoid generic tropical flakes. Feed 2-3 pellets twice daily.",
    lifespan: "3–5 years",
    adultSize: "2.5–3 inches (6–7 cm)",
    habitat:
      "Native to shallow rice paddies, floodplains, and slow-moving streams in Thailand and Southeast Asia. Labyrinth organ allows them to breathe atmospheric air.",
    groupSize: "1 male only (females can be kept in groups of 5+ — 'sorority')",
    breeding:
      "Moderate difficulty. Males build bubble nests. Condition with high-protein foods, introduce female briefly. Male guards the eggs and fry.",
    careTips: [
      "NEVER keep two males together — they will fight to the death",
      "Despite myths, bettas need at least 5 gallons — not a tiny bowl",
      "Prefer calm water with little surface agitation (labyrinth breathers)",
      "Add Indian almond leaves for tannins that promote health",
      "Can coexist with peaceful bottom-dwellers like corydoras and snails",
    ],
  },
  Corydoras: {
    slug: "corydoras",
    summary:
      "Adorable armored catfish that are the cleanup crew of the aquarium. Corydoras are peaceful bottom-dwellers that constantly sift through substrate for food. Essential for any community tank.",
    diet: "Omnivore — sinking pellets/wafers, frozen bloodworms, brine shrimp, blanched vegetables. They scavenge but need their own food — don't rely on leftovers.",
    lifespan: "5–7 years",
    adultSize: "1–3 inches (2.5–7.5 cm) depending on species",
    habitat:
      "Native to slow-moving rivers and streams in South America. Found in sandy or muddy substrates where they sift for food with their barbels.",
    groupSize: "6+ (social species — keep in groups of the same species)",
    breeding:
      "Moderate. Cool water changes can trigger spawning. Females carry eggs to adhesive surfaces (glass, leaves). Eggs hatch in 3-5 days.",
    careTips: [
      "Use sand or smooth gravel substrate — sharp gravel damages their barbels",
      "Always keep in groups of 6+ of the same species — they're highly social",
      "Excellent 'cleanup crew' but still need targeted feeding with sinking foods",
      "Very sensitive to salt — never use aquarium salt with corydoras",
      "Active during the day, especially at feeding time — fun to watch",
    ],
  },
  Angelfish: {
    slug: "angelfish",
    summary:
      "The elegant centerpiece fish for larger community tanks. Angelfish are semi-aggressive cichlids with tall, laterally compressed bodies and long flowing fins.",
    diet: "Omnivore — high-quality flakes/pellets, frozen bloodworms, brine shrimp, mysis shrimp, live foods. Feed 2-3 times daily.",
    lifespan: "8–10 years",
    adultSize: "6 inches long, up to 10 inches tall (15 × 25 cm)",
    habitat:
      "Native to the Amazon basin — slow-moving rivers with dense vegetation and submerged roots. Prefer tall, well-planted tanks.",
    groupSize: "1 or 5+ (avoid pairs/trios — aggression issues)",
    breeding:
      "Moderate. Form monogamous pairs. Lay eggs on flat surfaces (leaves, slate). Parents guard eggs and fry. Remove other fish during breeding.",
    careTips: [
      "Need tall tanks (18+ inches) — their body shape requires vertical space",
      "Will eat small fish (neon tetras) as adults — choose tank-mates carefully",
      "Best kept as a single specimen or in a group of 5+ to spread aggression",
      "Sensitive to poor water quality — maintain regular water changes",
      "Pairs can become very territorial when breeding",
    ],
  },
  Molly: {
    slug: "molly",
    summary:
      "Versatile livebearers that thrive in freshwater, brackish, and even saltwater. Mollies come in many color varieties and are excellent community fish.",
    diet: "Omnivore with herbivorous tendency — flakes, algae wafers, blanched vegetables (zucchini, spinach), spirulina-based foods. They graze on algae naturally.",
    lifespan: "3–5 years",
    adultSize: "3–4.5 inches (7–11 cm)",
    habitat:
      "Native to freshwater and brackish streams in Central and South America. Highly adaptable to various water conditions.",
    groupSize: "3+ (keep 2-3 females per male)",
    breeding:
      "Very easy — livebearers that breed readily. Females can produce 20-100 fry every 4-6 weeks. Provide floating plants or breeding boxes for fry survival.",
    careTips: [
      "Prefer slightly hard, alkaline water — add a small amount of marine salt if needed",
      "Prolific breeders — plan for population management",
      "Great algae eaters — help keep tank clean naturally",
      "Susceptible to 'molly disease' (shimmies) in soft/acidic water",
      "Can be kept in brackish setups — very adaptable",
    ],
  },
  Platy: {
    slug: "platy",
    summary:
      "Colorful, hardy livebearers perfect for beginners. Platies come in dozens of color combinations and are peaceful with virtually all community fish.",
    diet: "Omnivore — flakes, micro pellets, blanched vegetables, frozen brine shrimp. Will also graze on algae. Feed 1-2 times daily.",
    lifespan: "3–5 years",
    adultSize: "2–3 inches (5–7 cm)",
    habitat:
      "Native to Central America (Mexico, Guatemala, Honduras). Found in warm springs and ditches with moderate vegetation.",
    groupSize: "3+ (keep 2-3 females per male)",
    breeding:
      "Very easy — livebearers. Females produce 20-40 fry monthly. Fry are relatively large and can survive in a well-planted community tank.",
    careTips: [
      "One of the hardiest freshwater fish — great for cycling new tanks",
      "Come in amazing color varieties: red, blue, sunburst, mickey mouse, tuxedo",
      "Peaceful with everything — truly a no-drama community fish",
      "Will hybridize with swordtails if kept together",
      "Slightly alkaline water (pH 7.0-8.2) keeps them healthiest",
    ],
  },
  Swordtail: {
    slug: "swordtail",
    summary:
      "Named for the distinctive 'sword' extension on the male's tail fin. Swordtails are hardy, colorful livebearers that make excellent community tank fish.",
    diet: "Omnivore — flakes, pellets, blanched vegetables, frozen foods. Will graze on algae. Feed 1-2 times daily.",
    lifespan: "3–5 years",
    adultSize: "4–5 inches (10–13 cm) including sword",
    habitat:
      "Native to Central America. Found in flowing streams and rivers with moderate vegetation.",
    groupSize: "3+ (keep 2-3 females per male — males can be pushy)",
    breeding:
      "Very easy — livebearers. Females produce 20-80 fry monthly. Interesting sex-change behavior: some females can develop swords and become functional males.",
    careTips: [
      "Males can be aggressive toward each other — keep only one male or 3+ to spread aggression",
      "Good jumpers — keep tank covered",
      "Prefer some water flow — they come from streams naturally",
      "Will hybridize with platies",
      "Need a slightly larger tank than other livebearers due to size and activity level",
    ],
  },
  "Cherry Barb": {
    slug: "cherry-barb",
    summary:
      "A peaceful, shy barb species with stunning red coloration. Males turn deep cherry red when in breeding condition. Unlike tiger barbs, cherry barbs are gentle community fish.",
    diet: "Omnivore — flakes, micro pellets, frozen brine shrimp, daphnia, bloodworms. Not picky eaters.",
    lifespan: "4–6 years",
    adultSize: "1.5–2 inches (4–5 cm)",
    habitat:
      "Native to shaded forest streams in Sri Lanka. Prefer densely planted tanks with subdued lighting.",
    groupSize: "6+ (schooling fish — groups bring out their best color)",
    breeding:
      "Easy. Egg scatterers — scatter eggs among fine-leaved plants. Males display brilliant red coloring during courtship. Remove adults after spawning.",
    careTips: [
      "Unlike tiger barbs, cherry barbs are peaceful and won't nip fins",
      "Males display deepest red when they have females to impress",
      "Provide dense planting and subdued lighting — they're naturally shy",
      "Hardy and disease-resistant — great beginner schooling fish",
      "Endangered in the wild — captive breeding helps conservation",
    ],
  },
  "Harlequin Rasbora": {
    slug: "harlequin-rasbora",
    summary:
      "One of the most popular schooling fish in the hobby. The distinctive black triangular patch on a copper body makes them instantly recognizable. Peaceful and easy to keep.",
    diet: "Omnivore — flakes, micro pellets, frozen/freeze-dried foods. Small mouth — needs appropriately sized food.",
    lifespan: "5–8 years",
    adultSize: "1.5–2 inches (4–5 cm)",
    habitat:
      "Native to peat swamp forests in Southeast Asia (Malaysia, Singapore, Thailand). Prefer soft, acidic, tannin-stained water.",
    groupSize: "8+ (looks best in larger schools)",
    breeding:
      "Moderate-difficult. Deposit eggs on the underside of broad leaves (like Cryptocoryne). Need very soft, acidic water to trigger spawning.",
    careTips: [
      "Keep in schools of 8+ for the best display — they school tightly when they feel secure",
      "Thrive in planted tanks with driftwood and tannins",
      "Peaceful with everything — ideal dither fish for shy species",
      "Hardy once acclimated but sensitive to sudden parameter changes",
      "Indian almond leaves replicate their natural tannin-rich water",
    ],
  },
  "Dwarf Gourami": {
    slug: "dwarf-gourami",
    summary:
      "A stunning centerpiece fish with iridescent blue and red stripes. Dwarf gouramis are labyrinth fish that breathe from the surface. Peaceful but can be territorial with other gouramis.",
    diet: "Omnivore — flakes, micro pellets, frozen bloodworms, brine shrimp. Will also eat small insects from the surface.",
    lifespan: "4–6 years",
    adultSize: "2–3.5 inches (5–9 cm)",
    habitat:
      "Native to slow-moving waters in South Asia (India, Bangladesh). Found in densely vegetated ponds and rice paddies.",
    groupSize: "1 male (males fight; can keep 1 male with 2-3 females)",
    breeding:
      "Easy-moderate. Male builds a bubble nest at the surface. Condition with live foods. Male guards the nest and fry.",
    careTips: [
      "Labyrinth breather — needs access to surface air; avoid strong surface agitation",
      "Only keep one male per tank — they're territorial with other gouramis",
      "Susceptible to Dwarf Gourami Iridovirus (DGIV) — buy from reputable sources",
      "Prefers heavily planted tanks with floating plants for cover",
      "Shy at first but becomes bolder over time — give hiding spots",
    ],
  },
  "Bristlenose Pleco": {
    slug: "bristlenose-pleco",
    summary:
      "The best algae-eating fish for most aquariums. Unlike common plecos that grow huge, bristlenose plecos stay small and are the most effective glass cleaners in the hobby.",
    diet: "Herbivore/omnivore — algae wafers, blanched zucchini/cucumber, sinking pellets, driftwood (they rasp on wood for fiber). Supplement with protein occasionally.",
    lifespan: "5–10 years",
    adultSize: "4–5 inches (10–13 cm)",
    habitat:
      "Native to rivers and streams in South America. Found attached to rocks and driftwood in flowing water.",
    groupSize: "1+ (can keep multiples in larger tanks; males may squabble)",
    breeding:
      "Easy. Males have prominent bristles and guard eggs in caves. Provide ceramic caves or coconut shells. Males fan eggs until hatching.",
    careTips: [
      "MUST have driftwood — they need the fiber for digestion",
      "Far better choice than common pleco, which grows to 18+ inches",
      "Primarily nocturnal — most active at night; don't worry if you rarely see them during the day",
      "Drop in a blanched zucchini slice at night — they love it",
      "Males develop impressive bristles — females have fewer or none",
    ],
  },
  Otocinclus: {
    slug: "otocinclus",
    summary:
      "Tiny, peaceful algae-eating catfish that are the best cleanup crew for planted tanks. Otos are gentle, non-destructive algae eaters that won't harm delicate plants.",
    diet: "Herbivore — primarily grazes on biofilm and soft algae. Supplement with algae wafers, blanched zucchini, and spirulina. Sensitive to starvation.",
    lifespan: "3–5 years",
    adultSize: "1.5–2 inches (3.5–5 cm)",
    habitat:
      "Native to South American rivers, clinging to rocks and plants in flowing, well-oxygenated water.",
    groupSize: "6+ (social species — never keep alone)",
    breeding:
      "Difficult in captivity. Rarely breeds in home aquariums. Egg layers that deposit on plant leaves.",
    careTips: [
      "Only add to mature, well-established tanks with existing algae/biofilm",
      "Highly sensitive to water quality — zero ammonia/nitrite tolerance",
      "Will starve in too-clean tanks — supplement with algae wafers",
      "Keep in groups of 6+ — solitary otos waste away from stress",
      "Best algae eater for planted tanks — won't damage plant leaves",
    ],
  },
  "Cherry Shrimp": {
    slug: "cherry-shrimp",
    summary:
      "The most popular freshwater shrimp in the hobby. Cherry shrimp are prolific breeders, excellent algae eaters, and come in color grades from pale to deep blood red.",
    diet: "Omnivore/detritivore — biofilm, algae, shrimp pellets, blanched vegetables, calcium-rich foods. They graze constantly.",
    lifespan: "1–2 years",
    adultSize: "1–1.5 inches (2.5–4 cm)",
    habitat:
      "Native to streams in Taiwan. Prefer densely planted tanks with moss and hiding spots.",
    groupSize: "10+ (colony species — more is better)",
    breeding:
      "Very easy — females carry eggs under their body (berried). Fry are miniature adults. Colony will grow rapidly with good conditions.",
    careTips: [
      "No copper-based medications — copper is lethal to shrimp",
      "Java moss and cholla wood provide perfect grazing surfaces",
      "Females with deeper red color produce higher-grade offspring",
      "Drip acclimate over 1+ hour — extremely sensitive to parameter changes",
      "Keep with peaceful fish only — most fish will eat baby shrimp",
    ],
  },
  "Amano Shrimp": {
    slug: "amano-shrimp",
    summary:
      "Named after legendary aquascaper Takashi Amano, these are the best algae-eating shrimp available. Larger and more voracious than cherry shrimp, they make short work of hair algae.",
    diet: "Omnivore — primarily algae (especially hair algae and black beard algae). Also accepts shrimp pellets, blanched vegetables, biofilm.",
    lifespan: "2–3 years",
    adultSize: "2 inches (5 cm)",
    habitat:
      "Native to Japan and Taiwan. Found in freshwater streams that flow to the ocean (larvae need brackish water).",
    groupSize: "3+ (keep in groups for best algae control)",
    breeding:
      "Very difficult in home aquariums. Larvae require brackish water to survive, then transition to freshwater as adults. Most are wild-caught.",
    careTips: [
      "The gold standard for algae control — nothing eats hair algae like amanos",
      "Larger than cherry shrimp — safer with more fish species",
      "Notorious for stealing food and running away with it",
      "Will not breed in freshwater — larvae need brackish conditions",
      "Can escape tanks — ensure tight-fitting lid",
    ],
  },
  "Nerite Snail": {
    slug: "nerite-snail",
    summary:
      "The best algae-eating snail for freshwater tanks. Nerites clean glass, rocks, and decorations without eating plants. They won't overpopulate your tank since their eggs don't hatch in freshwater.",
    diet: "Herbivore — primarily algae. Supplement with algae wafers and blanched vegetables if the tank is too clean.",
    lifespan: "1–2 years",
    adultSize: "0.5–1 inch (1.5–2.5 cm)",
    habitat:
      "Native to coastal and brackish waters worldwide. Adapted to freshwater but eggs only hatch in brackish/saltwater.",
    groupSize: "1+ per 5 gallons for algae control",
    breeding:
      "Will lay white sesame-seed-like eggs on hard surfaces, but eggs won't hatch in freshwater. No overpopulation risk.",
    careTips: [
      "Best algae eater in the hobby — better than any fish or shrimp",
      "Won't reproduce in freshwater — no snail plague worry",
      "Will lay white eggs on decor that don't hatch — purely cosmetic annoyance",
      "Need calcium for shell health — maintain KH above 4",
      "Can escape the tank — keep lid secure",
    ],
  },
  "Mystery Snail": {
    slug: "mystery-snail",
    summary:
      "Large, colorful freshwater snails available in gold, blue, purple, ivory, and more. Mystery snails are peaceful, interesting to watch, and help clean the tank.",
    diet: "Omnivore — algae, calcium-rich foods, blanched vegetables (zucchini, spinach), sinking pellets, cuttlebone for shell health.",
    lifespan: "1–2 years",
    adultSize: "2 inches (5 cm)",
    habitat:
      "Native to South America (Amazon basin). Found in slow-moving rivers, ponds, and swamps.",
    groupSize: "1+ (peaceful; keep multiples for breeding)",
    breeding:
      "Easy. Lay egg clutches above the waterline (pink/white clusters). Eggs hatch in 2-4 weeks. Can produce 50-200 snails per clutch.",
    careTips: [
      "Lay eggs above the waterline — scrape off if you don't want babies",
      "Need calcium supplementation for shell health — cuttlebone works great",
      "Very sensitive to copper — lethal even in trace amounts",
      "Great tank janitors — eat leftover food, dead plant matter, and algae",
      "Come in stunning color varieties: gold, blue, purple, magenta, ivory",
    ],
  },
  "Tiger Barb": {
    slug: "tiger-barb",
    summary:
      "An active, striking fish known for its bold black stripes and tendency to nip fins. Tiger barbs must be kept in large groups to manage their semi-aggressive behavior.",
    diet: "Omnivore — flakes, pellets, frozen bloodworms, brine shrimp, vegetables. Active eaters that consume food quickly.",
    lifespan: "5–7 years",
    adultSize: "2.5–3 inches (6–7 cm)",
    habitat:
      "Native to rivers and streams in Borneo and Sumatra, Indonesia. Prefer well-oxygenated water with moderate flow.",
    groupSize: "6+ (minimum 8–10 recommended to reduce fin nipping)",
    breeding:
      "Easy. Egg scatterers. Condition with live foods. Spawns readily in a separate breeding tank. Remove adults after spawning.",
    careTips: [
      "MUST keep in groups of 8+ — small groups result in relentless fin nipping",
      "Do NOT keep with long-finned fish (bettas, angelfish, guppies)",
      "In large groups, aggression is directed within the school, not at tank-mates",
      "Very active swimmers — need a long tank with swimming space",
      "Come in many varieties: green, albino, GloFish variants",
    ],
  },
  Danio: {
    slug: "danio",
    summary:
      "Energetic, hardy schooling fish that are among the easiest to keep. Zebra danios are the original aquarium 'starter fish' and are used extensively in scientific research.",
    diet: "Omnivore — flakes, micro pellets, frozen foods, live foods. Not picky eaters. Feed 1-2 times daily.",
    lifespan: "3–5 years",
    adultSize: "2–2.5 inches (5–6 cm) for zebra danio; giant danio up to 4 inches",
    habitat:
      "Native to South and Southeast Asia. Found in a variety of habitats from fast-flowing streams to rice paddies.",
    groupSize: "6+ (active schooling fish — more is better)",
    breeding:
      "Very easy. Egg scatterers. Will spawn readily in groups. Provide marbles or mesh at the bottom to protect eggs from being eaten.",
    careTips: [
      "Extremely hardy — can tolerate a wider temperature range than most tropicals",
      "Very active swimmers — need a longer tank with open swimming space",
      "Excellent cycling fish for new tanks (though fish-in cycling is debated)",
      "Prefer cooler water (64-78\u00B0F) — great for unheated indoor tanks",
      "GloFish danios are genetically modified with fluorescent proteins",
    ],
  },
  Rainbowfish: {
    slug: "rainbowfish",
    summary:
      "Stunning, active fish that display iridescent colors that shift with the light. Rainbowfish are peaceful schooling fish that make spectacular community tank centerpieces.",
    diet: "Omnivore — flakes, pellets, frozen foods, live foods, color-enhancing foods. Feed varied diet for best coloration.",
    lifespan: "5–8 years",
    adultSize: "2–6 inches (5–15 cm) depending on species",
    habitat:
      "Native to Australia, New Guinea, and Southeast Asia. Found in streams, rivers, and lakes with clear water.",
    groupSize: "6+ (schooling fish that display best colors in groups)",
    breeding:
      "Easy-moderate. Egg scatterers that attach eggs to fine-leaved plants or spawning mops. Continuous spawners over days/weeks.",
    careTips: [
      "Colors intensify as they mature — young fish look dull; give them 6-12 months",
      "Morning light triggers their best color displays — watch them 'flash'",
      "Active swimmers that need a longer tank (4 feet+) for larger species",
      "Peaceful with everything their size or larger",
      "Males are more colorful; keep at least 2 females per male",
    ],
  },
  "Clown Loach": {
    slug: "clown-loach",
    summary:
      "The king of loaches — playful, social, and with distinct tiger-like stripes. Clown loaches are beloved for their personality but grow large and need big tanks long-term.",
    diet: "Omnivore — sinking pellets, frozen bloodworms, snails (natural snail control!), vegetables, live foods. They love eating snails.",
    lifespan: "15–25 years",
    adultSize: "8–12 inches (20–30 cm) — grows slowly but eventually large",
    habitat:
      "Native to rivers in Borneo and Sumatra, Indonesia. Found in flowing water with sandy substrates and submerged wood.",
    groupSize: "5+ (highly social — never keep fewer than 3)",
    breeding:
      "Extremely difficult in captivity. Rarely breeds in home aquariums. Commercial breeding uses hormone injections.",
    careTips: [
      "Will grow LARGE (12 inches) — plan for 75+ gallon tank long-term",
      "Best natural snail control — they devour pest snails",
      "Extremely sensitive to ich medication — use half doses only",
      "Love to play dead (lie on their side) — this is normal behavior, not illness",
      "Nocturnal but become more active during the day in groups of 5+",
    ],
  },
  "African Cichlid": {
    slug: "african-cichlid",
    summary:
      "Vibrant, aggressive fish from the Rift Lakes of Africa. African cichlids offer saltwater-like colors in a freshwater setup but require specialized care and tank-mates.",
    diet: "Varies by species — Mbuna are herbivores (spirulina, algae wafers), Haps/Peacocks are omnivores/carnivores (pellets, frozen foods). Research your specific species.",
    lifespan: "6–10 years",
    adultSize: "3–8 inches (7–20 cm) depending on species",
    habitat:
      "Native to the African Rift Lakes (Malawi, Tanganyika, Victoria). Highly alkaline, hard water with rocky environments.",
    groupSize: "12+ (overstock to reduce aggression — more fish = less targeting)",
    breeding:
      "Easy — most are mouthbrooders. Female holds eggs/fry in her mouth for 2-4 weeks. Prolific breeders.",
    careTips: [
      "Need hard, alkaline water (pH 7.8-8.6) — add crushed coral or limestone",
      "Overstock the tank to distribute aggression — counterintuitive but essential",
      "Do NOT mix with community fish — they'll terrorize or eat peaceful species",
      "Provide lots of rock formations for territories and hiding",
      "Keep Mbuna separate from Haps/Peacocks — different diets and temperaments",
    ],
  },
  "American Cichlid": {
    slug: "american-cichlid",
    summary:
      "A diverse group from Central and South America including convicts, jack dempseys, and oscars. American cichlids range from small community-safe species to large predators.",
    diet: "Mostly omnivore/carnivore — pellets, frozen foods, live foods, earthworms, shrimp. Larger species eat feeder fish (though pellets are healthier).",
    lifespan: "5–15 years (oscars can live 15+)",
    adultSize: "3–18 inches (7–45 cm) depending on species",
    habitat:
      "Native to rivers, lakes, and streams throughout Central and South America. Water conditions vary by species.",
    groupSize: "Varies — some are best kept as pairs, others in groups",
    breeding:
      "Easy for most species. Substrate spawners — both parents guard eggs and fry aggressively. Convicts are especially prolific.",
    careTips: [
      "Research your specific species — the group is incredibly diverse",
      "Many grow large (oscars, jack dempseys) and need 55+ gallon tanks",
      "Breeding pairs become extremely aggressive — may need their own tank",
      "Intelligent fish that recognize their owners and develop personality",
      "Strong diggers — use sand substrate and secure decorations",
    ],
  },
  Knifefish: {
    slug: "knifefish",
    summary:
      "Nocturnal predatory fish with a unique, blade-shaped body. Knifefish use weak electrical fields to navigate and hunt in the dark. Fascinating but for experienced keepers.",
    diet: "Carnivore — frozen bloodworms, brine shrimp, live foods, meaty pellets. Can be trained to accept pellets with patience.",
    lifespan: "10–15 years",
    adultSize: "8–20 inches (20–50 cm) depending on species",
    habitat:
      "Native to rivers in Southeast Asia and Africa. Nocturnal hunters found in murky, slow-moving water with plenty of cover.",
    groupSize: "1 (territorial with their own kind; some exceptions)",
    breeding:
      "Very difficult in captivity. Rarely attempted in home aquariums.",
    careTips: [
      "Strictly nocturnal — provide caves and dim lighting",
      "Will eat any fish small enough to fit in their mouth",
      "Clown knives grow to 20+ inches — need 150+ gallon tanks",
      "Use weak electrical fields for navigation — sensitive to stray current",
      "Black ghost knifefish are the most popular and best for home aquariums",
    ],
  },
  Goldfish: {
    slug: "goldfish",
    summary:
      "The classic pet fish — and much more demanding than most people realize. Goldfish are coldwater fish that need large tanks, heavy filtration, and should never be kept in bowls.",
    diet: "Omnivore — goldfish-specific pellets/flakes, blanched peas (helps digestion), frozen foods, vegetables. Avoid generic tropical fish food.",
    lifespan: "10–15 years (up to 25+ with proper care)",
    adultSize: "6–12 inches (15–30 cm) for common; 4–8 inches for fancy varieties",
    habitat:
      "Domesticated from Prussian carp in China. Coldwater fish that prefer temperatures below 74\u00B0F. Need high oxygen levels.",
    groupSize: "2+ (social fish; 20 gallons for first fish, 10 per additional)",
    breeding:
      "Easy. Egg scatterers triggered by temperature changes (simulating spring). Very prolific — can produce hundreds of eggs.",
    careTips: [
      "NEVER keep in a bowl — minimum 20 gallons for one goldfish",
      "Coldwater fish (60-74\u00B0F) — do NOT keep with tropical fish",
      "Produce enormous amounts of waste — need heavy filtration (2x rated capacity)",
      "Can live 15-25 years with proper care — they're a commitment",
      "Fancy goldfish (orandas, ryukins) need slower water flow than commons/comets",
    ],
  },
  Puffer: {
    slug: "puffer",
    summary:
      "Intelligent, curious fish with the ability to inflate when threatened. Puffers have fused beak-like teeth that need to be worn down by eating hard-shelled foods.",
    diet: "Carnivore — snails (essential for dental wear), frozen foods, shrimp, clams, mussels, bloodworms. Must provide hard-shelled foods to keep beak trimmed.",
    lifespan: "5–10 years",
    adultSize: "1–6 inches (2.5–15 cm) depending on species",
    habitat:
      "Found worldwide in freshwater, brackish, and saltwater environments. Figure eight puffers need brackish water; pea puffers are fully freshwater.",
    groupSize: "Varies — pea puffers can be kept in groups; larger species are solitary",
    breeding:
      "Difficult for most species. Some freshwater species (pea puffers) breed more readily in heavily planted tanks.",
    careTips: [
      "MUST provide snails regularly to wear down their ever-growing beak/teeth",
      "Highly intelligent — recognize their owners, beg for food, and explore",
      "Most species are aggressive — research species-specific tank-mate options",
      "Never inflate a puffer intentionally — it causes extreme stress and can kill them",
      "Pea puffers are the best choice for smaller tanks and community setups",
    ],
  },
  Catfish: {
    slug: "catfish",
    summary:
      "A vast group of bottom-dwelling fish that includes everything from tiny otos to giant plecos. Catfish are essential cleanup crew members that add activity to the lower levels of your tank.",
    diet: "Varies by species — most are omnivores. Sinking pellets, algae wafers, frozen bloodworms, vegetables. Nocturnal feeders — drop food after lights out.",
    lifespan: "5–20 years depending on species",
    adultSize: "2–12 inches (5–30 cm) depending on species",
    habitat:
      "Found worldwide in freshwater habitats. Most prefer sandy substrates, dim lighting, and plenty of hiding spots.",
    groupSize: "Varies by species (most are social and prefer groups)",
    breeding:
      "Varies widely — some (like bristlenose) breed easily; others are extremely difficult in captivity.",
    careTips: [
      "Use sand or smooth gravel — catfish barbels are easily damaged by sharp substrate",
      "Most are nocturnal — feed sinking foods after lights out",
      "Research your specific species — 'catfish' encompasses thousands of species",
      "Provide caves, driftwood, and hiding spots for security",
      "Many catfish have venomous spines — handle with care during netting",
    ],
  },
};

/** Get all species slugs for static page generation */
export function getAllSpeciesSlugs(): string[] {
  return Object.values(SPECIES_CARE).map((c) => c.slug);
}

/** Look up care data by slug */
export function getSpeciesCareBySlug(
  slug: string
): (SpeciesCareData & { speciesName: string }) | null {
  for (const [speciesName, care] of Object.entries(SPECIES_CARE)) {
    if (care.slug === slug) {
      return { ...care, speciesName };
    }
  }
  return null;
}

import { createAmazonProduct } from "./adapters/amazon";
import type { NormalizedProduct } from "./types";

/**
 * Curated Amazon affiliate product catalog.
 *
 * Each product uses a real ASIN — the affiliate URL is generated
 * automatically via createAmazonProduct() using AMAZON_ASSOCIATE_TAG.
 *
 * Categories: Filters, Heaters, UV Lights, Air Stones, Gravel,
 * Air Pumps, Air Distribution, AWC Systems, PEX Plumbing,
 * Aquarium Controls, Salt Systems, Backgrounds, Fish Food,
 * Driftwood, Plants, Auto Feeders, Tanks, Stands.
 *
 * All electronics are Tuya / Shelly / Lutron compatible for
 * Home Assistant automation.
 */

/* ------------------------------------------------------------------ */
/*  FILTERS                                                           */
/* ------------------------------------------------------------------ */

const FILTERS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B000260FUM",
    title: "AquaClear 50 Power Filter — 20 to 50 Gallon",
    description:
      "Industry-standard HOB filter with customizable media basket. Mechanical, chemical, and biological filtration in one unit. Quiet operation and adjustable flow.",
    price: "34.99",
    imageUrl: "https://m.media-amazon.com/images/I/81DlYuymFnL._AC_SL1500_.jpg",
    vendor: "AquaClear",
    productType: "FILTER",
    tags: ["filter", "hob", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
  createAmazonProduct({
    asin: "B07JHG13WP",
    title: "Fluval 207 Performance Canister Filter — Up to 45 Gallon",
    description:
      "Multi-stage canister filter with quick-change clamps. Virtually silent motor, large media capacity, and self-priming. Great for planted tanks.",
    price: "129.99",
    imageUrl: "https://m.media-amazon.com/images/I/61mJR7p-ZvL._AC_SL1500_.jpg",
    vendor: "Fluval",
    productType: "FILTER",
    tags: ["filter", "canister", "freshwater", "planted-tank", "equipment"],
    waterType: "freshwater",
  }),
  createAmazonProduct({
    asin: "B00GOFPX9I",
    title: "Hikari Bacto-Surge Sponge Filter — Large",
    description:
      "High-density foam sponge filter powered by air pump. Excellent biological filtration for shrimp tanks, fry tanks, and hospital tanks. Easy to clean.",
    price: "11.99",
    imageUrl: "https://m.media-amazon.com/images/I/71l8KX6I5qL._AC_SL1200_.jpg",
    vendor: "Hikari",
    productType: "FILTER",
    tags: ["filter", "sponge", "freshwater", "shrimp", "breeding", "equipment"],
    waterType: "freshwater",
  }),
  createAmazonProduct({
    asin: "B00TTBLDXY",
    title: "Hikari Bacto-Surge Sponge Filter — Mini",
    description:
      "Compact sponge filter for nano tanks up to 10 gallons. Gentle flow safe for shrimp and fry. Run with any small air pump.",
    price: "6.99",
    imageUrl: "https://m.media-amazon.com/images/I/710VooDu4PL._AC_SL1200_.jpg",
    vendor: "Hikari",
    productType: "FILTER",
    tags: ["filter", "sponge", "nano", "shrimp", "freshwater", "equipment"],
    waterType: "freshwater",
  }),
];

/* ------------------------------------------------------------------ */
/*  HEATERS                                                           */
/* ------------------------------------------------------------------ */

const HEATERS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B001VMSK0I",
    title: "Fluval E 300W Electronic Heater",
    description:
      "Advanced electronic heater with LCD temperature display and dual temperature sensors. Fish guard included. Pair with a Tuya smart plug for HA automation and scheduled heating.",
    price: "54.99",
    imageUrl: "https://m.media-amazon.com/images/I/61AOPqZZuxL._AC_SL1500_.jpg",
    vendor: "Fluval",
    productType: "HEATER",
    tags: ["heater", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B003M7P9YU",
    title: "Eheim Jager Aquarium Heater — 150W",
    description:
      "Precision German-made heater with TruTemp dial. Shatter-resistant glass, fully submersible. Use with Tuya/Shelly smart plug for HA temperature scheduling.",
    price: "35.99",
    imageUrl: "https://m.media-amazon.com/images/I/617tBxtuJxL._AC_SL1500_.jpg",
    vendor: "Eheim",
    productType: "HEATER",
    tags: ["heater", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B008AGHH8Y",
    title: "Cobalt Aquatics Neo-Therm Heater — Shatterproof",
    description:
      "Flat, modern design with one-touch digital thermostat. Shatterproof construction and LED indicator. Pair with a Tuya smart plug for remote on/off via Home Assistant.",
    price: "39.99",
    imageUrl: "https://m.media-amazon.com/images/I/71nJyHFpt-L._AC_SL1500_.jpg",
    vendor: "Cobalt Aquatics",
    productType: "HEATER",
    tags: ["heater", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B07H333NG2",
    title: "Hygger 100W Titanium Aquarium Heater with External Controller",
    description:
      "Titanium heating element with separate digital controller. Durable for freshwater and saltwater. Smart-plug compatible for HA automation with Tuya or Shelly.",
    price: "29.99",
    imageUrl: "https://m.media-amazon.com/images/I/61U77C224EL._AC_SL1001_.jpg",
    vendor: "Hygger",
    productType: "HEATER",
    tags: ["heater", "titanium", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
];

/* ------------------------------------------------------------------ */
/*  UV LIGHTS                                                         */
/* ------------------------------------------------------------------ */

const UV_LIGHTS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B099KRCQPN",
    title: "AA Green Killing Machine Internal UV Sterilizer — 9W",
    description:
      "Internal UV sterilizer for aquariums up to 50 gallons. Kills green water algae, parasites, and bacteria. Easy install, no plumbing required.",
    price: "39.99",
    imageUrl: "https://m.media-amazon.com/images/I/812DxGpEH1L._AC_SL1500_.jpg",
    vendor: "AA Aquarium",
    productType: "UV LIGHT",
    tags: ["uv", "sterilizer", "algae", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
  createAmazonProduct({
    asin: "B0064JHVOE",
    title: "Coralife Turbo-Twist UV Sterilizer — 18W, Up to 250 Gal",
    description:
      "Inline UV sterilizer with turbo-twist flow design for maximum UV exposure. Eliminates free-floating algae, bacteria, and parasites.",
    price: "64.99",
    imageUrl: "https://m.media-amazon.com/images/I/71yNeyLvpPL._AC_SL1500_.jpg",
    vendor: "Coralife",
    productType: "UV LIGHT",
    tags: ["uv", "sterilizer", "inline", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
];

/* ------------------------------------------------------------------ */
/*  AIR STONES                                                        */
/* ------------------------------------------------------------------ */

const AIR_STONES: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B08R5G9R7X",
    title: "Pawfly 2-Inch Air Stone Disc Bubble Diffuser",
    description:
      "Fine bubble air stone for aquarium aeration. Creates dense, small bubbles for efficient gas exchange. Works with any air pump.",
    price: "5.99",
    imageUrl: "https://m.media-amazon.com/images/I/81WftHR4-vS._AC_SL1500_.jpg",
    vendor: "Pawfly",
    productType: "AIR STONE",
    tags: ["air-stone", "aeration", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
  createAmazonProduct({
    asin: "B071DZG6QP",
    title: "Pawfly 4-Inch Air Stone Disc — 2 Pack",
    description:
      "Large disc air stones produce a wall of fine bubbles. Great for larger tanks and sump aeration. Includes 2 discs.",
    price: "7.99",
    imageUrl: "https://m.media-amazon.com/images/I/71FPUlTJcOL._AC_SL1500_.jpg",
    vendor: "Pawfly",
    productType: "AIR STONE",
    tags: ["air-stone", "aeration", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
];

/* ------------------------------------------------------------------ */
/*  GRAVEL / SUBSTRATE                                                */
/* ------------------------------------------------------------------ */

const GRAVEL: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B00JMABYUO",
    title: "Fluval Plant and Shrimp Stratum — 8.8 lbs",
    description:
      "Volcanic soil substrate for planted and shrimp tanks. Naturally lowers pH for soft-water species. Promotes healthy plant root growth.",
    price: "24.99",
    imageUrl: "https://m.media-amazon.com/images/I/61xuz5C1O9L._AC_SL1000_.jpg",
    vendor: "Fluval",
    productType: "GRAVEL",
    tags: ["substrate", "planted-tank", "shrimp", "freshwater", "equipment"],
    waterType: "freshwater",
  }),
  createAmazonProduct({
    asin: "B0002DH0QM",
    title: "CaribSea Eco-Complete Planted Aquarium Substrate — 20 lbs",
    description:
      "Complete substrate system with live heterotrophic bacteria. Contains iron, calcium, magnesium, potassium, and over 25 other elements. No rinsing required.",
    price: "26.99",
    imageUrl: "https://m.media-amazon.com/images/I/81oOxQrQDBL._AC_SL1500_.jpg",
    vendor: "CaribSea",
    productType: "GRAVEL",
    tags: ["substrate", "planted-tank", "freshwater", "equipment"],
    waterType: "freshwater",
  }),
];

/* ------------------------------------------------------------------ */
/*  AIR PUMPS                                                         */
/* ------------------------------------------------------------------ */

const AIR_PUMPS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B0009YHU6Y",
    title: "Tetra Whisper Air Pump — 10 to 30 Gallon",
    description:
      "Ultra-quiet air pump with dome shape that dampens noise. Powerful, reliable, and energy-efficient. Plug into a Tuya smart plug for HA scheduled aeration.",
    price: "9.99",
    imageUrl: "https://m.media-amazon.com/images/I/81AXyFVAgxL._AC_SL1500_.jpg",
    vendor: "Tetra",
    productType: "AIR PUMP",
    tags: ["air-pump", "aeration", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B0D39C9KX8",
    title: "Hygger Ultra Quiet Air Pump 6W — Dual Outlets, Up to 300 Gal",
    description:
      "Powerful dual-outlet air pump with adjustable airflow. Includes air stones and airline tubing. Whisper quiet at under 35dB. Tuya smart plug compatible.",
    price: "21.99",
    imageUrl: "https://m.media-amazon.com/images/I/81bDq8X31ZL._AC_SL1500_.jpg",
    vendor: "Hygger",
    productType: "AIR PUMP",
    tags: ["air-pump", "dual-outlet", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B0CM9GMKF1",
    title: "Hygger Rechargeable USB Portable Air Pump — Battery Backup",
    description:
      "Battery-powered portable air pump with USB charging. Auto-activates during power outages. Essential for fish safety during emergencies.",
    price: "15.99",
    imageUrl: "https://m.media-amazon.com/images/I/61qqBZrKd5L._AC_SL1500_.jpg",
    vendor: "Hygger",
    productType: "AIR PUMP",
    tags: ["air-pump", "battery", "emergency", "portable", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
];

/* ------------------------------------------------------------------ */
/*  AIR DISTRIBUTION                                                  */
/* ------------------------------------------------------------------ */

const AIR_DISTRIBUTION: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B07PKSDFKN",
    title: "AQUANEAT 2-Way Air Gang Valve with Check Valves",
    description:
      "Stainless steel gang valve manifold with lever control and suction cups. Split one air pump output into 2 lines with individual flow control.",
    price: "7.99",
    imageUrl: "https://m.media-amazon.com/images/I/61dHNwEKjVS._AC_SL1500_.jpg",
    vendor: "AQUANEAT",
    productType: "AIR DISTRIBUTION",
    tags: ["air-distribution", "gang-valve", "manifold", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
  createAmazonProduct({
    asin: "B08LPGVTXH",
    title: "Enkarl Airline Check Valves (20pc) + 25ft Airline Tubing",
    description:
      "Complete airline tubing kit with 20 check valves and 25 feet of standard airline tubing. Prevents backflow and water siphoning.",
    price: "7.99",
    imageUrl: "https://m.media-amazon.com/images/I/61JBxrmX3tL._AC_SL1000_.jpg",
    vendor: "Enkarl",
    productType: "AIR DISTRIBUTION",
    tags: ["air-distribution", "tubing", "check-valve", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
];

/* ------------------------------------------------------------------ */
/*  AWC SYSTEMS (Automatic Water Change)                              */
/* ------------------------------------------------------------------ */

const AWC_SYSTEMS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B097QB38MZ",
    title: "AutoAqua Smart ATO Lite — Automatic Top-Off System with Pump",
    description:
      "Optical sensor auto top-off system that detects water level and pumps fresh water automatically. Prevents evaporation drop. Tuya plug compatible for HA monitoring.",
    price: "54.99",
    imageUrl: "https://m.media-amazon.com/images/I/411OUA0MeFS._AC_.jpg",
    vendor: "AutoAqua",
    productType: "AWC SYSTEM",
    tags: ["awc", "auto-top-off", "automation", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B07BJMD1T4",
    title: "Kamoer Peristaltic Dosing Pump — 24V with Power Supply",
    description:
      "Precision dosing pump for automated fertilizer, calcium, and alkalinity dosing. Use with Tuya smart plug for HA-scheduled dosing routines.",
    price: "29.99",
    imageUrl: "https://m.media-amazon.com/images/I/71zlB8WIFIL._AC_SL1500_.jpg",
    vendor: "Kamoer",
    productType: "AWC SYSTEM",
    tags: ["awc", "dosing-pump", "automation", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
];

/* ------------------------------------------------------------------ */
/*  PEX PLUMBING & ACCESSORIES                                       */
/* ------------------------------------------------------------------ */

const PEX_PLUMBING: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B003OATBDK",
    title: 'SharkBite 1/2" PEX-B Tubing — 100ft, Red',
    description:
      "Flexible PEX-B water tubing for aquarium plumbing, AWC systems, and water top-off lines. Easy to cut and route. Compatible with push-fit and crimp fittings.",
    price: "39.99",
    imageUrl: "https://m.media-amazon.com/images/I/71PEu8jYrUL._AC_SL1500_.jpg",
    vendor: "SharkBite",
    productType: "PEX PLUMBING",
    tags: ["pex", "plumbing", "tubing", "awc", "equipment"],
  }),
  createAmazonProduct({
    asin: "B01AS48PBS",
    title: 'SharkBite 1/2" 90-Degree Elbow — 4 Pack, Push-to-Connect',
    description:
      "Push-fit brass elbows — no tools, no soldering. Connect PEX tubing around corners for aquarium plumbing runs. Removable and reusable.",
    price: "21.99",
    imageUrl: "https://m.media-amazon.com/images/I/71mcpdilSAL._AC_SL1500_.jpg",
    vendor: "SharkBite",
    productType: "PEX PLUMBING",
    tags: ["pex", "plumbing", "fitting", "elbow", "equipment"],
  }),
  createAmazonProduct({
    asin: "B007AGM6FO",
    title: 'SharkBite 1/2" Copper Crimp Rings — 100 Pack',
    description:
      "Standard copper crimp rings for PEX connections. Use with a PEX crimp tool for permanent, leak-free joints on aquarium water lines.",
    price: "19.99",
    imageUrl: "https://m.media-amazon.com/images/I/71Wi26P3PVL._SL1500_.jpg",
    vendor: "SharkBite",
    productType: "PEX PLUMBING",
    tags: ["pex", "plumbing", "crimp", "fitting", "equipment"],
  }),
  createAmazonProduct({
    asin: "B018VNUCSC",
    title: 'iCrimp PEX Crimp Tool — 1/2" & 3/4" with Cutter & Go/No-Go Gauge',
    description:
      "Angle-head PEX crimping tool with built-in cutter and calibration gauge. Essential for DIY aquarium plumbing and AWC system installs.",
    price: "34.99",
    imageUrl: "https://m.media-amazon.com/images/I/71FRqPsvClL._AC_SL1405_.jpg",
    vendor: "iCrimp",
    productType: "PEX PLUMBING",
    tags: ["pex", "plumbing", "tool", "crimp", "equipment"],
  }),
  createAmazonProduct({
    asin: "B0C4VWXHDW",
    title: 'SharkBite 1/2" Push-to-Connect Ball Valve',
    description:
      "Quarter-turn ball valve for PEX lines. Push-fit connection — no tools required. Use as shutoff valve for aquarium water lines and AWC systems.",
    price: "13.99",
    imageUrl: "https://m.media-amazon.com/images/I/71gy9244CFL._SL1500_.jpg",
    vendor: "SharkBite",
    productType: "PEX PLUMBING",
    tags: ["pex", "plumbing", "valve", "shutoff", "equipment"],
  }),
];

/* ------------------------------------------------------------------ */
/*  AQUARIUM CONTROLS (Smart Plugs, Controllers)                      */
/* ------------------------------------------------------------------ */

const AQUARIUM_CONTROLS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B07X1JT372",
    title: "Inkbird ITC-306A WiFi Temperature Controller — Dual Probes",
    description:
      "WiFi aquarium thermostat with heating/cooling outlets and dual temperature probes. Control heaters and fans remotely. Works with Tuya/Smart Life app and Home Assistant.",
    price: "48.99",
    imageUrl: "https://m.media-amazon.com/images/I/71+eIuL53iL._AC_SL1500_.jpg",
    vendor: "Inkbird",
    productType: "AQUARIUM CONTROLS",
    tags: ["controller", "temperature", "wifi", "tuya", "automation", "home-assistant", "equipment"],
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B086WXTQNP",
    title: "Tuya WiFi Smart Power Strip — 4 AC + 4 USB, Surge Protector",
    description:
      "WiFi-enabled power strip with individually controllable outlets. Tuya/Smart Life compatible — full local control in Home Assistant via Tuya integration. Control lights, heaters, pumps independently.",
    price: "24.99",
    imageUrl: "https://m.media-amazon.com/images/I/618HjwpRSkL._AC_SL1500_.jpg",
    vendor: "Tuya",
    productType: "AQUARIUM CONTROLS",
    tags: ["smart-plug", "power-strip", "tuya", "wifi", "automation", "home-assistant", "equipment"],
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B08YDH3B2N",
    title: "Shelly Plus Plug S — WiFi Smart Plug with Power Monitoring",
    description:
      "Compact WiFi smart plug with real-time power monitoring. Runs local firmware — no cloud required. Native Home Assistant integration via Shelly. Perfect for controlling individual aquarium devices.",
    price: "17.99",
    imageUrl: "https://m.media-amazon.com/images/I/61kBLkEdSpL._AC_SL1500_.jpg",
    vendor: "Shelly",
    productType: "AQUARIUM CONTROLS",
    tags: ["smart-plug", "shelly", "wifi", "automation", "home-assistant", "local-control", "equipment"],
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B0BF3J1FJG",
    title: "Shelly Plus 1PM Mini — WiFi Relay Switch with Power Metering",
    description:
      "Ultra-compact WiFi relay that fits behind any switch or inside enclosures. Monitor power consumption of pumps, heaters, and lights. 100% local control via Home Assistant.",
    price: "15.99",
    imageUrl: "https://m.media-amazon.com/images/I/61h3aKR-HGL._SL1500_.jpg",
    vendor: "Shelly",
    productType: "AQUARIUM CONTROLS",
    tags: ["relay", "shelly", "wifi", "automation", "home-assistant", "local-control", "equipment"],
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B00KLAXFQA",
    title: "Lutron Pico Remote (5-Button) — Wireless Scene Controller",
    description:
      "Wireless 5-button scene controller. Pair with Lutron Caseta bridge for Home Assistant tank scene control — one button for day mode, night mode, feeding mode, and more.",
    price: "16.95",
    imageUrl: "https://m.media-amazon.com/images/I/713DWJ4ssYL._SL1500_.jpg",
    vendor: "Lutron",
    productType: "AQUARIUM CONTROLS",
    tags: ["remote", "lutron", "scenes", "automation", "home-assistant", "equipment"],
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B00NO7GH5C",
    title: "Lutron Caseta Smart Bridge — Works with Home Assistant",
    description:
      "Hub for Lutron Caseta and Pico remotes. Native Home Assistant integration via Lutron Caseta Pro. Control aquarium lighting scenes, fans, and pumps with physical buttons.",
    price: "79.99",
    imageUrl: "https://m.media-amazon.com/images/I/71FeZwdGc+L._AC_SL1500_.jpg",
    vendor: "Lutron",
    productType: "AQUARIUM CONTROLS",
    tags: ["hub", "lutron", "bridge", "automation", "home-assistant", "equipment"],
    automationCompatible: true,
  }),
];

/* ------------------------------------------------------------------ */
/*  SALT SYSTEMS                                                      */
/* ------------------------------------------------------------------ */

const SALT_SYSTEMS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B000255NKA",
    title: "Instant Ocean Sea Salt — 50 Gallon Mix",
    description:
      "The most trusted marine salt mix. Fast dissolving, provides essential ocean elements. For fish-only and reef aquariums.",
    price: "21.99",
    imageUrl: "https://m.media-amazon.com/images/I/81K3I-LMf1L._AC_SL1500_.jpg",
    vendor: "Instant Ocean",
    productType: "SALT SYSTEM",
    tags: ["salt", "marine", "saltwater", "reef", "equipment"],
    waterType: "saltwater",
  }),
  createAmazonProduct({
    asin: "B000HCLNR0",
    title: "Instant Ocean Reef Crystals — 50 Gallon Mix",
    description:
      "Enriched salt formula with extra calcium, trace elements, and vitamins for reef tanks. Supports coral growth and coloration.",
    price: "27.99",
    imageUrl: "https://m.media-amazon.com/images/I/81rqmfuZlWL._AC_SL1500_.jpg",
    vendor: "Instant Ocean",
    productType: "SALT SYSTEM",
    tags: ["salt", "marine", "saltwater", "reef", "coral", "equipment"],
    waterType: "saltwater",
  }),
  createAmazonProduct({
    asin: "B018LRO1SU",
    title: "Salinity Refractometer — 0-100 PPT, Auto Temperature Compensation",
    description:
      "Precision refractometer for measuring salinity and specific gravity. Essential for saltwater and reef tank maintenance. Auto temp compensation for accurate readings.",
    price: "19.99",
    imageUrl: "https://m.media-amazon.com/images/I/81equeUKnXL._AC_SL1500_.jpg",
    vendor: "Generic",
    productType: "SALT SYSTEM",
    tags: ["refractometer", "salinity", "testing", "saltwater", "reef", "equipment"],
    waterType: "saltwater",
  }),
];

/* ------------------------------------------------------------------ */
/*  BACKGROUNDS                                                       */
/* ------------------------------------------------------------------ */

const BACKGROUNDS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B007GCEDNU",
    title: 'Sporn Aquarium Background — Static Cling Black, 24" x 12"',
    description:
      "Static cling background — no adhesive needed. Pure black background makes fish colors pop and hides equipment. Easy to trim and reposition.",
    price: "7.99",
    imageUrl: "https://m.media-amazon.com/images/I/61kTBz7lKUL._AC_SL1500_.jpg",
    vendor: "Sporn",
    productType: "BACKGROUND",
    tags: ["background", "black", "static-cling", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
  createAmazonProduct({
    asin: "B007GCDVTW",
    title: 'Sporn Aquarium Background — Static Cling Black, 36" x 18"',
    description:
      "Large static cling background for 30-55 gallon tanks. No glue, no tape — just press and stick. Removes cleanly for tank maintenance.",
    price: "11.99",
    imageUrl: "https://m.media-amazon.com/images/I/61S2eLjErnL._AC_SL1500_.jpg",
    vendor: "Sporn",
    productType: "BACKGROUND",
    tags: ["background", "black", "static-cling", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
];

/* ------------------------------------------------------------------ */
/*  FISH FOOD                                                         */
/* ------------------------------------------------------------------ */

const FISH_FOOD: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B07194GD1F",
    title: "Fluval Bug Bites Tropical Fish Food — Small Granules, 1.6 oz",
    description:
      "Insect-based fish food made with Black Soldier Fly larvae. High protein, sustainably sourced. Slow-sinking granules for tropical community fish.",
    price: "5.99",
    imageUrl: "https://m.media-amazon.com/images/I/71w0zgvCBZL._AC_SL1500_.jpg",
    vendor: "Fluval",
    productType: "FISH FOOD",
    tags: ["food", "tropical", "granules", "freshwater", "supplies"],
    waterType: "freshwater",
  }),
  createAmazonProduct({
    asin: "B00025Z6K2",
    title: "Hikari Tropical Algae Wafers — 8.8 oz",
    description:
      "Sinking algae wafers for plecos, otocinclus, shrimp, and other bottom feeders. Nutrient-rich with spirulina. Won't cloud water.",
    price: "11.99",
    imageUrl: "https://m.media-amazon.com/images/I/816NExiu0+L._AC_SL1500_.jpg",
    vendor: "Hikari",
    productType: "FISH FOOD",
    tags: ["food", "algae-wafer", "pleco", "shrimp", "bottom-feeder", "freshwater", "supplies"],
    waterType: "freshwater",
  }),
  createAmazonProduct({
    asin: "B000TZ5A42",
    title: "Hikari Bio-Pure Freeze Dried Blood Worms — 1.58 oz",
    description:
      "Premium freeze-dried blood worms. High-protein treat for tropical fish, bettas, and cichlids. Nitrogen-charged packaging preserves freshness.",
    price: "9.99",
    imageUrl: "https://m.media-amazon.com/images/I/61hK6YpE9aL._AC_SL1200_.jpg",
    vendor: "Hikari",
    productType: "FISH FOOD",
    tags: ["food", "blood-worms", "treat", "freshwater", "supplies"],
    waterType: "freshwater",
  }),
  createAmazonProduct({
    asin: "B00M4Q8FPU",
    title: "NorthFin Community Formula — 1mm Slow-Sinking Pellets, 250g",
    description:
      "Premium fish food with whole Antarctic krill, herring, and kelp. No fillers, no artificial colors. Trusted by serious fishkeepers.",
    price: "13.99",
    imageUrl: "https://m.media-amazon.com/images/I/81vrXtdQFzL._AC_SL1500_.jpg",
    vendor: "NorthFin",
    productType: "FISH FOOD",
    tags: ["food", "pellets", "community", "freshwater", "supplies"],
    waterType: "freshwater",
  }),
];

/* ------------------------------------------------------------------ */
/*  DRIFTWOOD                                                         */
/* ------------------------------------------------------------------ */

const DRIFTWOOD: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B07XLN3Q3J",
    title: "Zoo Med Spider Wood — Small, 8-12 inches",
    description:
      "Natural spider wood (azalea root) for aquascaping. Creates dramatic branching hardscape. Safe for all freshwater aquariums. Each piece is unique.",
    price: "11.99",
    imageUrl: "https://m.media-amazon.com/images/I/61GmUk7bENL._AC_SL1280_.jpg",
    vendor: "Zoo Med",
    productType: "DRIFTWOOD",
    tags: ["driftwood", "hardscape", "aquascaping", "freshwater", "equipment"],
    waterType: "freshwater",
  }),
  createAmazonProduct({
    asin: "B00M0DI6L0",
    title: "SubstrateSource Cholla Wood — 6 inch, 2 Pack",
    description:
      "Natural cholla wood tubes perfect for shrimp, plecos, and fry. Provides hiding spots and grazing surfaces. Sinks quickly after soaking.",
    price: "6.99",
    imageUrl: "https://m.media-amazon.com/images/I/71R2ZNlV5PL._AC_SL1500_.jpg",
    vendor: "SubstrateSource",
    productType: "DRIFTWOOD",
    tags: ["driftwood", "cholla", "shrimp", "pleco", "hardscape", "freshwater", "equipment"],
    waterType: "freshwater",
  }),
];

/* ------------------------------------------------------------------ */
/*  PLANTS (Live Aquarium)                                            */
/* ------------------------------------------------------------------ */

const PLANTS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B008HXF16K",
    title: "Anubias Nana — Live Aquarium Plant, Potted",
    description:
      "Hardy, low-light plant that thrives attached to driftwood or rocks. Do not bury the rhizome. Perfect for beginners — nearly impossible to kill.",
    price: "11.99",
    imageUrl: "https://m.media-amazon.com/images/I/71rqPHKeR8L._AC_SL1500_.jpg",
    vendor: "SubstrateSource",
    productType: "PLANTS",
    tags: ["plant", "anubias", "low-light", "beginner", "freshwater"],
    waterType: "freshwater",
  }),
  createAmazonProduct({
    asin: "B013AZDEAO",
    title: "4 Potted Live Aquarium Plants Bundle — Anubias, Sword, Java Fern",
    description:
      "Starter bundle with 4 potted live plants: Anubias, Amazon Sword, Java Fern variants. Low to moderate light requirements. Ships fast with insulated packaging.",
    price: "27.99",
    imageUrl: "https://m.media-amazon.com/images/I/41j-UbEonWL._AC_.jpg",
    vendor: "Marcus Fish Tanks",
    productType: "PLANTS",
    tags: ["plant", "bundle", "beginner", "freshwater", "low-light"],
    waterType: "freshwater",
  }),
];

/* ------------------------------------------------------------------ */
/*  AUTOMATIC FISH FEEDERS                                            */
/* ------------------------------------------------------------------ */

const AUTO_FEEDERS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B001F2117I",
    title: "Eheim Everyday Fish Feeder — Programmable Auto Dispenser",
    description:
      "Reliable programmable feeder with adjustable portion control. Battery operated with low-battery indicator. Pair with a Tuya smart plug for HA integration and feeding schedules.",
    price: "29.99",
    imageUrl: "https://m.media-amazon.com/images/I/61Ft5ukvC-L._AC_SL1500_.jpg",
    vendor: "Eheim",
    productType: "AUTO FEEDER",
    tags: ["feeder", "automatic", "vacation", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B07W66GG2F",
    title: "Zacro Automatic Fish Feeder — USB Rechargeable",
    description:
      "USB rechargeable auto feeder with timer for up to 4 feedings per day. Adjustable food amount slider. Perfect for weekends and vacations. Smart plug compatible.",
    price: "15.99",
    imageUrl: "https://m.media-amazon.com/images/I/41sb0u7OqLL._AC_.jpg",
    vendor: "Zacro",
    productType: "AUTO FEEDER",
    tags: ["feeder", "automatic", "usb", "vacation", "freshwater", "saltwater", "equipment", "automation-compatible"],
    waterType: "both",
    automationCompatible: true,
  }),
];

/* ------------------------------------------------------------------ */
/*  TANKS                                                             */
/* ------------------------------------------------------------------ */

const TANKS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B01MRIQW7K",
    title: "Fluval Flex 9 Gallon Aquarium Kit — LED & Filtration Included",
    description:
      "Curved front glass nano aquarium with built-in multi-stage filtration and LED lighting. Honeycomb light diffuser and remote control. Great starter kit.",
    price: "99.99",
    imageUrl: "https://m.media-amazon.com/images/I/81uCo3jczlL._AC_SL1500_.jpg",
    vendor: "Fluval",
    productType: "TANK",
    tags: ["tank", "nano", "kit", "led", "freshwater", "equipment"],
    waterType: "freshwater",
  }),
  createAmazonProduct({
    asin: "B0002APZO4",
    title: "Aqueon Standard Glass Aquarium Tank — 10 Gallon",
    description:
      "Classic glass aquarium — the workhorse of the hobby. Clean silicone seams, distortion-free glass. Perfect for community fish, bettas, or shrimp.",
    price: "17.99",
    imageUrl: "https://m.media-amazon.com/images/I/71aTm2JEeZL._AC_SL1200_.jpg",
    vendor: "Aqueon",
    productType: "TANK",
    tags: ["tank", "glass", "starter", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
  createAmazonProduct({
    asin: "B0002AS3RG",
    title: "Aqueon Standard Glass Aquarium Tank — 20 Gallon Long",
    description:
      "The 20 gallon long is the most versatile tank size in the hobby. Wide footprint gives fish swimming room and plants space to spread. Great for community setups.",
    price: "34.99",
    imageUrl: "https://m.media-amazon.com/images/I/51THjS0hYgL._AC_SL1048_.jpg",
    vendor: "Aqueon",
    productType: "TANK",
    tags: ["tank", "glass", "community", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
];

/* ------------------------------------------------------------------ */
/*  STANDS                                                            */
/* ------------------------------------------------------------------ */

const STANDS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B0002AQIF6",
    title: "Aqueon Forge Metal Aquarium Stand — 20 Gallon",
    description:
      "Sturdy metal aquarium stand rated for 20 gallon tanks. Open bottom shelf for equipment storage. Powder-coated black finish. Leveling feet for uneven floors.",
    price: "54.99",
    imageUrl: "https://m.media-amazon.com/images/I/71qBAj83BnL._AC_SL1500_.jpg",
    vendor: "Aqueon",
    productType: "STAND",
    tags: ["stand", "metal", "furniture", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
  createAmazonProduct({
    asin: "B0193WVZ98",
    title: "Imagitarium Brooklyn Metal Tank Stand — 29 Gallon",
    description:
      "Industrial-style metal aquarium stand for 29 gallon tanks. Supports up to 300 lbs. Open shelving design, matte black. Sturdy and stylish.",
    price: "69.99",
    imageUrl: "https://m.media-amazon.com/images/I/71a1WfvWFkL._AC_SL1500_.jpg",
    vendor: "Imagitarium",
    productType: "STAND",
    tags: ["stand", "metal", "furniture", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
  createAmazonProduct({
    asin: "B07NQN89QR",
    title: "Aqueon Forge Metal Aquarium Stand — 10 Gallon",
    description:
      "Compact metal stand for 10 gallon tanks. Perfect for desktops or small spaces. Open bottom for canister filters or supplies.",
    price: "39.99",
    imageUrl: "https://m.media-amazon.com/images/I/81wO3fRatTL._AC_SL1500_.jpg",
    vendor: "Aqueon",
    productType: "STAND",
    tags: ["stand", "metal", "compact", "nano", "freshwater", "saltwater", "equipment"],
    waterType: "both",
  }),
];

/* ------------------------------------------------------------------ */
/*  CAMERAS                                                            */
/* ------------------------------------------------------------------ */

const CAMERAS: NormalizedProduct[] = [
  createAmazonProduct({
    asin: "B0F9S67XH7",
    title: "Amouu 2K HD Aquarium WiFi Pet Camera — Anti-Glare Glass Mount",
    description:
      "2K HD aquarium camera with 140° wide-angle anti-glare lens, night vision, two-way audio, and AI-powered motion detection. Peel-and-stick glass mount installation. 24/7 cloud or SD card recording.",
    price: "36.99",
    imageUrl: "https://m.media-amazon.com/images/I/61qJYLKbURL._AC_SL1500_.jpg",
    vendor: "Amouu",
    productType: "CAMERA",
    tags: ["camera", "wifi", "aquarium", "monitoring", "smart-home", "equipment"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B0FP4L1KR3",
    title: "HomiQ 3MP Aquarium AI Monitoring Camera — Magnetic Install",
    description:
      "3MP terrarium and aquarium camera with close-up detail lens, dual-band WiFi (2.4G/5GHz), starlight color night vision, and AI motion detection. Easy magnetic install. Anti-glare, anti-reflection design.",
    price: "49.99",
    imageUrl: "https://m.media-amazon.com/images/I/61nXnXkFURL._AC_SL1500_.jpg",
    vendor: "HomiQ",
    productType: "CAMERA",
    tags: ["camera", "wifi", "aquarium", "ai", "monitoring", "smart-home", "equipment"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B08V8B9P51",
    title: "Barlus 5MP Underwater Aquarium Camera — 32ft POE Cable",
    description:
      "Fully submersible 5MP POE IP camera in 304 stainless steel housing. Live streaming capability, no built-in lights (fish-safe), 32-foot cable. Perfect for ponds and large aquariums.",
    price: "219.99",
    imageUrl: "https://m.media-amazon.com/images/I/51MeCVsWvLL._AC_SL1500_.jpg",
    vendor: "Barlus",
    productType: "CAMERA",
    tags: ["camera", "underwater", "poe", "aquarium", "pond", "submersible", "equipment"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B0BW5YFBKH",
    title: "Barlus HD 5MP Underwater POE Camera — Fill Light, 98ft Cable",
    description:
      "Premium submersible 5MP POE IP camera with 316L marine-grade stainless steel, built-in fill light, 2.8mm wide-angle lens, and 98-foot cable. IP68 waterproof for aquaculture and aquarium use.",
    price: "349.99",
    imageUrl: "https://m.media-amazon.com/images/I/41vf7fd52wL._AC_SL1500_.jpg",
    vendor: "Barlus",
    productType: "CAMERA",
    tags: ["camera", "underwater", "poe", "aquarium", "marine", "submersible", "equipment"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B098F3VXHY",
    title: "LINOVISION 4K Ultra HD Underwater POE Camera — 33ft Cable",
    description:
      "Professional 4K (8MP) underwater POE camera with anti-corrosion coating, 112.7° wide-angle lens, LED illumination, and mobile app. For aquariums, ponds, and aquaculture farms.",
    price: "439.00",
    imageUrl: "https://m.media-amazon.com/images/I/31M2wOhmiRL._AC_SL1500_.jpg",
    vendor: "LINOVISION",
    productType: "CAMERA",
    tags: ["camera", "underwater", "4k", "poe", "aquarium", "professional", "equipment"],
    waterType: "both",
    automationCompatible: true,
  }),
  createAmazonProduct({
    asin: "B0F9KPMSML",
    title: "Pawfly WiFi Auto Fish Feeder with 2.5K HD Camera",
    description:
      "Smart automatic fish feeder with built-in 2.5K HD camera, infrared night vision, and WiFi app control. 230mL capacity, timer scheduling, USB powered. Monitor and feed remotely.",
    price: "39.99",
    imageUrl: "https://m.media-amazon.com/images/I/61YkLKbURL._AC_SL1500_.jpg",
    vendor: "Pawfly",
    productType: "AUTO FEEDER",
    tags: ["camera", "auto-feeder", "wifi", "smart-home", "aquarium", "monitoring", "equipment"],
    waterType: "both",
    automationCompatible: true,
  }),
];

/* ------------------------------------------------------------------ */
/*  COMBINED EXPORT                                                   */
/* ------------------------------------------------------------------ */

/** All curated Amazon affiliate products */
export const AMAZON_PRODUCTS: NormalizedProduct[] = [
  ...FILTERS,
  ...HEATERS,
  ...UV_LIGHTS,
  ...AIR_STONES,
  ...GRAVEL,
  ...AIR_PUMPS,
  ...AIR_DISTRIBUTION,
  ...AWC_SYSTEMS,
  ...PEX_PLUMBING,
  ...AQUARIUM_CONTROLS,
  ...SALT_SYSTEMS,
  ...BACKGROUNDS,
  ...FISH_FOOD,
  ...DRIFTWOOD,
  ...PLANTS,
  ...AUTO_FEEDERS,
  ...TANKS,
  ...STANDS,
  ...CAMERAS,
];

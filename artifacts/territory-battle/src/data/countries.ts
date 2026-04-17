export interface Country {
  id: string;
  name: string;
  flag: string;
  color: string;
  bgGradient: string;
  borderColor: string;
}

export const COUNTRIES: Country[] = [
  {
    id: "usa",
    name: "USA",
    flag: "🇺🇸",
    color: "#3B82F6",
    bgGradient: "from-blue-600/20 to-blue-900/10",
    borderColor: "border-blue-500/40",
  },
  {
    id: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    color: "#22C55E",
    bgGradient: "from-green-600/20 to-green-900/10",
    borderColor: "border-green-500/40",
  },
  {
    id: "russia",
    name: "Russia",
    flag: "🇷🇺",
    color: "#EF4444",
    bgGradient: "from-red-600/20 to-red-900/10",
    borderColor: "border-red-500/40",
  },
  {
    id: "china",
    name: "China",
    flag: "🇨🇳",
    color: "#F97316",
    bgGradient: "from-orange-600/20 to-orange-900/10",
    borderColor: "border-orange-500/40",
  },
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    color: "#A855F7",
    bgGradient: "from-purple-600/20 to-purple-900/10",
    borderColor: "border-purple-500/40",
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    color: "#EC4899",
    bgGradient: "from-pink-600/20 to-pink-900/10",
    borderColor: "border-pink-500/40",
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    color: "#EAB308",
    bgGradient: "from-yellow-600/20 to-yellow-900/10",
    borderColor: "border-yellow-500/40",
  },
  {
    id: "nigeria",
    name: "Nigeria",
    flag: "🇳🇬",
    color: "#14B8A6",
    bgGradient: "from-teal-600/20 to-teal-900/10",
    borderColor: "border-teal-500/40",
  },
  {
    id: "mexico",
    name: "Mexico",
    flag: "🇲🇽",
    color: "#F43F5E",
    bgGradient: "from-rose-600/20 to-rose-900/10",
    borderColor: "border-rose-500/40",
  },
];

export const EVENTS = [
  { emoji: "🌹", name: "Rose", points: 1 },
  { emoji: "🎁", name: "Gift Box", points: 5 },
  { emoji: "🏆", name: "Trophy", points: 10 },
  { emoji: "💎", name: "Diamond", points: 25 },
  { emoji: "👑", name: "Crown", points: 50 },
  { emoji: "🚀", name: "Rocket", points: 100 },
];

export const VIEWER_NAMES = [
  "user_4829", "tiktok_fan", "world_viewer", "live_king", "queen_bee",
  "super_star99", "viewer_007", "fan_boy23", "legend_X", "cool_dude88",
  "epic_gamer", "night_owl", "top_fan_1", "daily_live", "hyper_boost",
];

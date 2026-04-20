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
    id: "alb",
    name: "Albania",
    flag: "🇦🇱",
    color: "#E11D48",
    bgGradient: "from-red-600/20 to-red-900/10",
    borderColor: "border-red-500/40",
  },
  {
    id: "kos",
    name: "Kosovo",
    flag: "🇽🇰",
    color: "#2563EB",
    bgGradient: "from-blue-600/20 to-blue-900/10",
    borderColor: "border-blue-500/40",
  },
  {
    id: "tur",
    name: "Turkey",
    flag: "🇹🇷",
    color: "#DC2626",
    bgGradient: "from-red-600/20 to-red-900/10",
    borderColor: "border-red-500/40",
  },
  {
    id: "gre",
    name: "Greece",
    flag: "🇬🇷",
    color: "#1D4ED8",
    bgGradient: "from-blue-600/20 to-blue-900/10",
    borderColor: "border-blue-500/40",
  },
  {
    id: "ser",
    name: "Serbia",
    flag: "🇷🇸",
    color: "#7C3AED",
    bgGradient: "from-purple-600/20 to-purple-900/10",
    borderColor: "border-purple-500/40",
  },
  {
    id: "rus",
    name: "Russia",
    flag: "🇷🇺",
    color: "#EF4444",
    bgGradient: "from-red-600/20 to-red-900/10",
    borderColor: "border-red-500/40",
  },
  {
    id: "rom",
    name: "Romania",
    flag: "🇷🇴",
    color: "#F59E0B",
    bgGradient: "from-yellow-600/20 to-yellow-900/10",
    borderColor: "border-yellow-500/40",
  },
  {
    id: "cro",
    name: "Croatia",
    flag: "🇭🇷",
    color: "#06B6D4",
    bgGradient: "from-cyan-600/20 to-cyan-900/10",
    borderColor: "border-cyan-500/40",
  },
  {
    id: "usa",
    name: "USA",
    flag: "🇺🇸",
    color: "#22C55E",
    bgGradient: "from-green-600/20 to-green-900/10",
    borderColor: "border-green-500/40",
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

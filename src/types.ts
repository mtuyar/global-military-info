export interface CountryInsight {
  country: string;
  tagline: string;
  highlight: string;
  category: string;
  emoji: string;
  // Detailed military stats
  militaryBudget: string;
  activeMilitary: string;
  reserveMilitary: string;
  tanks: string;
  aircraft: string;
  navalVessels: string;
  nuclearWarheads: string;
  globalRank: number;
  strengths: string[];
}

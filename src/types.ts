export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  rewardXp: number;
  icon: string;
}

export interface Coin {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

export interface CharacterStats {
  codeQuality: number;
  aiSorcery: number;
  gameDesign: number;
  bugCleansing: number;
}

export interface GameProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  extraInfo?: string;
  stars?: number;
  progress?: number;
  link?: string;
}

import { GameProject, Quest, CharacterStats } from "../types";

export const INITIAL_STATS: CharacterStats = {
  codeQuality: 88,
  aiSorcery: 85,
  gameDesign: 80,
  bugCleansing: 95,
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: "start",
    title: "QUEST START",
    description: "Click the 'PRESS START' button in Level 1",
    completed: false,
    rewardXp: 100,
    icon: "play_arrow",
  },
  {
    id: "coins",
    title: "COIN HUNTER",
    description: "Collect all 5 secret gold coins floating on the screen",
    completed: false,
    rewardXp: 250,
    icon: "monetization_on",
  },
  {
    id: "stats",
    title: "STAT UPGRADE",
    description: "Upgrade any of Mahmoud's attributes in Character Data",
    completed: false,
    rewardXp: 150,
    icon: "bolt",
  },
  {
    id: "chat",
    title: "SUMMON AI MAGE",
    description: "Ask the AI NPC Clone a question in the JRPG chatbox",
    completed: false,
    rewardXp: 150,
    icon: "terminal",
  },
  {
    id: "explore",
    title: "CASE STUDY",
    description: "Examine a project details case study by clicking 'VIEW CASE'",
    completed: false,
    rewardXp: 100,
    icon: "search",
  },
];

export const GAME_PROJECTS: GameProject[] = [
  {
    id: "torostack",
    title: "TOROSTACK",
    description: "Built a microservices-based online judge using ASP.NET Core and Docker. Integrated AI feedback to help users improve their submitted solutions. Used async messaging for real-time updates across services.",
    imageUrl: "",
    category: "MICROSERVICES & AI",
    extraInfo: "Stack: ASP.NET Core, C#, React, SQL Server, Docker, REST API. Features real-time code execution environment and smart AI debugging feedback.",
    link: "https://www.torostack.me",
  },
  {
    id: "podcasty",
    title: "PODCASTY",
    description: "Developed a platform for uploading, managing, and streaming audio content. Built a REST API backend with ASP.NET Core and JWT authentication. Created a responsive React frontend with audio playback support.",
    imageUrl: "",
    category: "AUDIO STREAMING & JWT",
    extraInfo: "Stack: ASP.NET Core, C#, React, SQL Server, JWT, REST API. Implemented secure upload channels and interactive custom media player.",
    link: "https://github.com/Ma7EG/podcasty",
  },
  {
    id: "medaura",
    title: "MEDAURA",
    description: "A freelance medical education platform designed for sharing university courses. Engineered a secure and scalable .NET backend supporting high concurrent course video/file sharing and complete student-lecturer flows.",
    imageUrl: "",
    category: "FREELANCE BACKEND",
    extraInfo: "Stack: .NET, ASP.NET Core, SQL Server, Entity Framework Core. Developed REST APIs serving a Flutter web app and a React-based admin management dashboard.",
  },
  {
    id: "chatapp",
    title: "CHATAPP",
    description: "Built real-time chat backend using Singleton, Factory, and Observer patterns. Optimized for low latency and concurrent user handling.",
    imageUrl: "",
    category: "REAL-TIME BACKEND",
    extraInfo: "Focus on design patterns (Singleton, Factory, Observer) to keep latency low, managing concurrent connections efficiently.",
  },
];

export const PRESET_QUESTIONS = [
  "What is your current active mission?",
  "Tell me about Torostack!",
  "Tell me about MedAura!",
  "How can we hire you or collaborate?"
];

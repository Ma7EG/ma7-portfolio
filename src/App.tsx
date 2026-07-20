import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Terminal, 
  Gamepad2, 
  Play, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Plus, 
  Award, 
  CheckCircle, 
  Circle, 
  Send, 
  Share2, 
  Mail, 
  MessageSquare, 
  Brain, 
  Check, 
  Coins, 
  X,
  Code,
  Layers,
  ArrowRight
} from "lucide-react";
import { 
  playCoinSound, 
  playLevelUpSound, 
  playBlipSound, 
  playPowerUpSound, 
  playAchievementSound,
  setMuteState 
} from "./utils/audio";
import { 
  GAME_PROJECTS, 
  INITIAL_QUESTS, 
  INITIAL_STATS, 
  PRESET_QUESTIONS 
} from "./utils/gameData";
import { 
  ChatMessage, 
  Quest, 
  CharacterStats, 
  GameProject 
} from "./types";
import heroBg from "../assets/hero_bg.jpg";
import avatarImg from "../assets/avatar.jpg";
import githubIcon from "../assets/github.png";
import discordIcon from "../assets/discord.png";
import downloadCvIcon from "../assets/download_cv.png";
import cvPdf from "../assets/Mahmoud Ali Mahmoud.pdf";
import acpcImg from "../assets/ACPC.png";

const SYSTEM_INSTRUCTION = `You are the 8-bit AI Clone of Mahmoud Ali (Mahmoud Ali Mahmoud), a .NET Backend Developer. 

Your background and contact info:
Name: Mahmoud Ali
Email: mody044404440@gmail.com
Phone: +201154455968
GitHub: https://github.com/Ma7EG
LinkedIn: linkedin.com/in/mahmoudali2
Discord: ma76552
Codeforces: codeforces.com/profile/ma7.eg

About Mahmoud Ali:
He is a Junior .NET Backend Developer and fresh graduate with an IT degree and real project experience building REST APIs and web applications using ASP.NET Core and C#. Familiar with Clean Architecture, SOLID principles, SQL Server, and Docker. Quick learner and comfortable working in Agile teams.

Education:
Bachelor of Computer and Information Technology at The Egyptian E-Learning University (EELU). Grade: Very Good. Graduation Project: Excellent.

Experience:
1. Full Stack .NET Web Developer Intern at Digital Egypt Pioneers Initiative (DEPI) (Jun 2025 - Dec 2025):
- Built RESTful APIs and MVC applications with ASP.NET Core and C#.
- Applied Clean Architecture, Dependency Injection, Repository Pattern.
- Used Git and Azure DevOps for version control.
2. Software Development Intern at Banque Misr (Jun 2024 - Aug 2024):
- Worked in a Scrum team with daily stand-ups and reviews.
- Developed responsive web interfaces using Angular and Bootstrap.
3. Network Engineering Intern at National Telecommunication Institute (NTI) (Aug 2024 - Sep 2024):
- Trained in TCP/IP, subnetting, network configurations.
- Configured OSPF, VLANs, and firewall rules.

Projects:
1. Torostack (Graduation Project):
- An online judge and competitive programming platform with microservices using ASP.NET Core.
- Integrated AI feedback to help users debug code submissions.
- Used RabbitMQ/async messaging and Docker containers for execution sandbox.
- URL: www.torostack.me
2. Podcasty:
- Audio upload and streaming platform.
- Backend built with ASP.NET Core and JWT authentication, frontend built with React.
- URL: https://github.com/Ma7EG/podcasty
3. MedAura:
- Freelance medical course-sharing ecosystem.
- Built a secure and optimized .NET backend to deliver university courses to a Flutter web app and React admin dashboard.
- ChatApp:
- Low-latency real-time chat application implementing design patterns like Singleton, Factory, and Observer.

Personality rules:
- Speak like a classic JRPG NPC, game master, or retro wizard.
- Use gaming analogies: C#/.NET is "the Sacred C# Codex", database/SQL is "the Data Vault", bugs/errors are "slimes/monsters", Docker containers are "Pocket Summoning Runes".
- Keep your responses concise (around 2 to 4 sentences or a short list), fitting inside a retro game dialogue box.
- You are explicitly allowed and encouraged to share all contact information: Email (mody044404440@gmail.com), Phone (+201154455968), GitHub (https://github.com/Ma7EG), LinkedIn (linkedin.com/in/mahmoudali2), and Discord (ma76552). Never claim that you cannot share these.`;

export default function App() {
  
  const [muted, setMuted] = useState(false);
  const [score, setScore] = useState(999900);
  const [xp, setXp] = useState(0);
  const [skillPoints, setSkillPoints] = useState(3);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [stats, setStats] = useState<CharacterStats>(INITIAL_STATS);
  
  
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedProject, setSelectedProject] = useState<GameProject | null>(null);
  const [discordModalOpen, setDiscordModalOpen] = useState(false);

  
  const [coins, setCoins] = useState([
    { id: "coin-hero", x: 45, y: 12, collected: false, section: "hero" },
    { id: "coin-about", x: 8, y: 78, collected: false, section: "about" },
    { id: "coin-work", x: 92, y: 10, collected: false, section: "work" },
    { id: "coin-games", x: 50, y: 4, collected: false, section: "games" },
    { id: "coin-footer", x: 15, y: 45, collected: false, section: "footer" }
  ]);

  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "GREETINGS, ADVENTURER! I am the 8-bit AI Clone of Mahmoud Ali. Ask me anything about my backend spells, database queries, or server magic!",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  
  const [typewrittenText, setTypewrittenText] = useState("");
  const [isTypingActive, setIsTypingActive] = useState(false);

  
  const handleToggleMute = () => {
    const newMute = !muted;
    setMuted(newMute);
    setMuteState(newMute);
    if (!newMute) {
      setTimeout(() => playBlipSound(), 50);
    }
  };

  
  const triggerBlip = () => {
    if (!muted) playBlipSound();
  };

  
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === "model") {
      setIsTypingActive(true);
      const fullText = lastMsg.content;
      setTypewrittenText(fullText.substring(0, 1));
      let idx = 1;
      
      const interval = setInterval(() => {
        idx++;
        setTypewrittenText(fullText.substring(0, idx));
        if (idx >= fullText.length) {
          clearInterval(interval);
          setIsTypingActive(false);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [messages]);

  useEffect(() => {
    const container = chatBottomRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  
  const completeQuest = (questId: string) => {
    setQuests((prevQuests) => {
      const alreadyCompleted = prevQuests.find(q => q.id === questId)?.completed;
      if (alreadyCompleted) return prevQuests;

      
      if (!muted) playAchievementSound();

      const updated = prevQuests.map((q) => {
        if (q.id === questId) {
          
          setScore(s => s + q.rewardXp * 10);
          setXp(x => x + q.rewardXp);
          
          setSkillPoints(sp => sp + 2);
          return { ...q, completed: true };
        }
        return q;
      });

      return updated;
    });
  };

  
  const handleCollectCoin = (coinId: string) => {
    setCoins((prevCoins) => {
      const coin = prevCoins.find(c => c.id === coinId);
      if (!coin || coin.collected) return prevCoins;

      if (!muted) playCoinSound();

      
      const updated = prevCoins.map((c) => (c.id === coinId ? { ...c, collected: true } : c));
      
      
      setScore(s => s + 100);
      setXp(x => x + 25);

      
      const allCollectedNow = updated.every(c => c.collected);
      if (allCollectedNow) {
        completeQuest("coins");
      }

      return updated;
    });
  };

  
  const handleUpgradeStat = (statName: keyof CharacterStats) => {
    if (skillPoints <= 0) return;
    
    if (!muted) playPowerUpSound();

    setStats(prev => ({
      ...prev,
      [statName]: prev[statName] + 5
    }));
    
    setSkillPoints(sp => sp - 1);
    setScore(s => s + 50);
    setXp(x => x + 10);
    
    completeQuest("stats");
  };

  
  const handlePressStart = () => {
    if (!muted) playLevelUpSound();
    setGameStarted(true);
    completeQuest("start");
  };

  const handleSendChatMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || chatLoading) return;

    triggerBlip();
    setInputMessage("");
    setTypewrittenText("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatLoading(true);

    const presetAnswers: Record<string, string> = {
      "What is your current active mission?": "My current active mission is finding a Junior .NET Backend Developer role or freelance projects where I can build secure, scalable RESTful APIs, apply Clean Architecture, and collaborate in Agile teams.",
      "Tell me about Torostack!": "Torostack is my graduation project (graded Excellent). It is a web application and admin dashboard designed for sharing university courses in the medical field. I worked as a Backend Developer using .NET and C# to build its RESTful APIs, handle security, and manage database integrations. You can visit it at www.torostack.me",
      "Tell me about MedAura!": "MedAura is a freelance medical education platform designed for sharing university courses. It features a Flutter mobile app, a React admin dashboard, and a .NET backend. I worked as the Backend Developer using .NET/C# to engineer secure APIs, manage student-lecturer flows, and support concurrent media streaming.",
      "How can we hire you or collaborate?": "You can reach out to me via email at mody044404440@gmail.com, phone at +201154455968, LinkedIn (linkedin.com/in/mahmoudali2), or GitHub (github.com/Ma7EG)."
    };

    if (presetAnswers[textToSend]) {
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: presetAnswers[textToSend],
        timestamp: new Date().toLocaleTimeString()
      };
      setTypewrittenText("");
      setMessages(prev => [...prev, modelMsg]);
      setChatLoading(false);
      completeQuest("chat");
      return;
    }

    try {
      const contents = newMessages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }));

      const payload = {
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          ...contents
        ],
        model: "openai"
      };

      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error("API request failed");
      }

      const reply = await response.text();
      
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: reply || "...",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, modelMsg]);
      completeQuest("chat");
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        content: "Connection to the AI Realm interrupted. Please check your internet connection.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  
  const completedQuestsCount = quests.filter(q => q.completed).length;
  const questPercentage = Math.round((completedQuestsCount / quests.length) * 100);

  return (
    <div className="bg-[#5C94FC] text-[#1b1b1b] min-h-screen pb-16 md:pb-0 font-body-md relative overflow-hidden select-none">
      
      {}
      {coins.map((coin) => {
        if (coin.collected) return null;
        
        
        let coinStyles = "";
        if (coin.id === "coin-hero") {
          
          coinStyles = "absolute top-[16%] right-[54%] z-30";
        } else if (coin.id === "coin-about") {
          
          coinStyles = "absolute bottom-[28%] left-[28%] z-30";
        } else if (coin.id === "coin-work") {
          
          coinStyles = "absolute top-[1%] right-[5%] z-30";
        } else if (coin.id === "coin-games") {
          
          coinStyles = "absolute top-[2%] left-[48%] z-30";
        } else if (coin.id === "coin-footer") {
          
          coinStyles = "absolute top-[20%] left-[8%] z-30";
        }

        return (
          <div key={coin.id} className={coinStyles}>
            <button
              onClick={() => handleCollectCoin(coin.id)}
              className="relative group focus:outline-none cursor-pointer"
              title="Collect Secret Coin!"
              id={coin.id}
            >
              <motion.div 
                animate={{ 
                  y: [0, -12, 0],
                  scaleX: [1, 0.1, 1],
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                  scaleX: { repeat: Infinity, duration: 0.9, ease: "linear" }
                }}
                className="w-10 h-10 bg-[#ffd30a] rounded-full border-4 border-black flex items-center justify-center pixel-shadow-sm active:scale-95 transition-all"
              >
                <span className="font-press-start font-bold text-xs text-black select-none">$</span>
              </motion.div>
              {}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
            </button>
          </div>
        );
      })}

      {}
      <header className="sticky top-0 z-50 w-full bg-[#0f8925] text-white flex justify-between items-center px-6 h-16 border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <Terminal className="w-6 h-6 text-[#ffe179] animate-pulse" />
          <h1 className="font-press-start text-xs md:text-sm tracking-tight text-white select-none">
            MAHMOUD ALI
          </h1>
        </div>

        {}
        <nav className="hidden md:flex gap-6 lg:gap-10">
          <a 
            onClick={triggerBlip}
            href="#hero" 
            className="font-press-start text-[10px] text-[#ffe179] font-bold border-b-4 border-[#ffe179] pb-1 hover:translate-y-0.5 transition-all duration-75"
          >
            LEVEL 1: ABOUT
          </a>
          <a 
            onClick={triggerBlip}
            href="#work" 
            className="font-press-start text-[10px] text-white/80 hover:text-[#ffe179] pb-1 hover:translate-y-0.5 transition-all duration-75"
          >
            LEVEL 2: EXPERIENCE
          </a>
          <a 
            onClick={triggerBlip}
            href="#achievements" 
            className="font-press-start text-[10px] text-white/80 hover:text-[#ffe179] pb-1 hover:translate-y-0.5 transition-all duration-75"
          >
            LEVEL 4: ACHIEVEMENTS
          </a>
          <a 
            onClick={triggerBlip}
            href="#projects" 
            className="font-press-start text-[10px] text-white/80 hover:text-[#ffe179] pb-1 hover:translate-y-0.5 transition-all duration-75"
          >
            LEVEL 3: PROJECTS
          </a>
        </nav>

        {}
        <div className="flex items-center gap-4">
          <div className="bg-black/40 text-xs py-1 px-3 border-2 border-black font-mono text-[#ffe179] hidden sm:flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-yellow-300" />
            <span>XP: {xp}</span>
          </div>

          <button
            onClick={handleToggleMute}
            className="flex items-center justify-center p-2 border-2 border-black bg-black text-[#ffd30a] active:translate-y-0.5 transition-transform"
            title={muted ? "Unmute Retro Synth Sounds" : "Mute Sound"}
            id="mute-toggle"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="relative">
        
        {}
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <div className="bg-white pixel-border pixel-shadow p-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-black pb-3">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-[#e52521] animate-bounce" />
                <div>
                  <h3 className="font-press-start text-[11px] md:text-xs">ACTIVE HERO QUEST LOG</h3>
                  <p className="text-xs text-gray-600 font-sans">Complete Mahmoud's portfolio tasks to reach Quest Complete!</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-press-start text-[10px] bg-black text-white px-2 py-1 select-none">
                  SCORE: {score}
                </div>
                <div className="text-right">
                  <span className="font-press-start text-[9px] text-[#0f8925] block mb-1">
                    QUEST PROGRESS: {questPercentage}%
                  </span>
                  <div className="w-40 h-4 bg-gray-200 border-2 border-black inline-block overflow-hidden">
                    <div 
                      className="h-full bg-[#0f8925] transition-all duration-500"
                      style={{ width: `${questPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3">
              {quests.map((quest) => (
                <div 
                  key={quest.id}
                  className={`border-2 border-black p-2 flex items-center justify-between ${
                    quest.completed ? "bg-green-50" : "bg-gray-50 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {quest.completed ? (
                      <CheckCircle className="w-4 h-4 text-[#0f8925] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <div>
                      <h4 className="font-press-start text-[8px] font-bold tracking-tight">
                        {quest.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-sans leading-tight mt-0.5 line-clamp-1">
                        {quest.description}
                      </p>
                    </div>
                  </div>
                  <span className="font-press-start text-[7px] text-yellow-600 shrink-0 ml-1">
                    +{quest.rewardXp}xp
                  </span>
                </div>
              ))}
            </div>

            {questPercentage === 100 && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#ffd30a] border-4 border-black p-3 mt-4 text-center"
              >
                <h4 className="font-press-start text-xs text-black animate-pulse flex items-center justify-center gap-2">
                  👑 QUEST COMPLETED! YOU ARE THE ULTIMATE DEVELOPER HERO! 👑
                </h4>
                <p className="text-xs font-sans font-bold text-black/80 mt-1">
                  You found all secrets, talked to the AI, upgraded stats, and unlocked Mahmoud's hidden archives!
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {}
        <section className="relative min-h-[75vh] flex items-center justify-center pt-8 pb-12 px-6 overflow-hidden" id="hero">
          {}
          <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 md:opacity-100" style={{ backgroundImage: `url(${heroBg})` }}></div>
          
          <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-[#e52521] text-white px-4 py-2 pixel-border pixel-shadow mb-6">
                <p className="font-press-start text-xs md:text-sm">LEVEL 1</p>
              </div>
              
              <h2 className="font-press-start text-lg md:text-2xl text-black bg-white/80 md:bg-transparent p-4 md:p-0 mb-6 leading-tight">
                MAHMOUD ALI - QUEST START!
              </h2>

              <div className="pixel-border bg-white p-6 pixel-shadow max-w-xl">
                <p className="font-sans text-base md:text-lg text-gray-800 mb-6 leading-relaxed">
                  Junior .NET Backend Developer and fresh graduate building REST APIs and web applications using <span className="text-[#be000c] font-bold">ASP.NET Core & C#</span>. Comfortable in Agile environments and passionate about Clean Architecture.
                </p>
                
                <div className="flex gap-4 justify-center md:justify-start">
                  <button 
                    onClick={handlePressStart}
                    className={`px-6 py-4 pixel-border pixel-shadow font-press-start text-[10px] flex items-center gap-2 select-none active:translate-y-1 transition-all ${
                      gameStarted 
                        ? "bg-green-400 text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]" 
                        : "bg-[#ffd30a] text-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5"
                    }`}
                    id="press-start-btn"
                  >
                    <Play className="w-4 h-4 fill-black" /> 
                    {gameStarted ? "GAME STARTED!" : "PRESS START"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="relative w-64 h-64 md:w-80 md:h-80 pixel-border bg-[#e2e2e2] pixel-shadow overflow-hidden group mb-3">
                <img 
                  alt="Mahmoud Ali Pixel Avatar" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                  src={avatarImg}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 w-full bg-black/70 text-white text-center py-2 font-press-start text-[9px] select-none">
                  PLAYER 1
                </div>
              </div>

              <div className="flex flex-col items-center gap-2.5 w-full max-w-[280px] sm:max-w-xs z-20">
                <a 
                  href={cvPdf} 
                  download="Mahmoud Ali Mahmoud CV.pdf"
                  onClick={triggerBlip}
                  className="w-full flex justify-center"
                >
                  <img 
                    src={downloadCvIcon} 
                    alt="Download CV" 
                    className="w-full h-auto cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  />
                </a>

                <div className="flex w-full gap-3 justify-between">
                  <a 
                    href="https://github.com/Ma7EG" 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={triggerBlip}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1b1b1b] text-white font-press-start text-[8px] py-2 border-2 border-black pixel-shadow-sm hover:bg-zinc-800 active:translate-y-0.5 transition-transform"
                  >
                    <img 
                      src={githubIcon} 
                      alt="" 
                      className="w-7 h-7 object-contain"
                    />
                    GITHUB
                  </a>

                  <button 
                    onClick={() => {
                      triggerBlip();
                      setDiscordModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#5865F2] text-white font-press-start text-[8px] py-2 border-2 border-black pixel-shadow-sm hover:bg-[#4752c4] active:translate-y-0.5 transition-transform cursor-pointer focus:outline-none"
                  >
                    <img 
                      src={discordIcon} 
                      alt="" 
                      className="w-7 h-7 object-contain"
                    />
                    DISCORD
                  </button>
                </div>
              </div>

              {}
              <div className="absolute -top-10 -right-2 animate-bounce">
                <span className="material-symbols-outlined text-[#ffd30a] text-4xl font-bold select-none" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              </div>
              <div className="absolute top-4 -left-10 animate-bounce delay-150">
                <span className="material-symbols-outlined text-[#ffd30a] text-3xl font-bold select-none" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              </div>
            </div>

          </div>
        </section>

        {}
        <section className="py-16 px-6 bg-[#f3f3f3]" id="about">
          <div className="max-w-4xl mx-auto">
            
            <div className="nav-pipe w-full h-12 mb-12 flex items-center justify-center">
              <span className="font-press-start text-xs md:text-sm text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none">
                CHARACTER DATA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {}
              <div className="md:col-span-4 flex flex-col gap-6">
                
                {}
                <div className="bg-[#e2e2e2] pixel-border pixel-shadow-sm p-4 text-center">
                  <span className="material-symbols-outlined text-6xl text-[#be000c] mb-4 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  <h4 className="font-press-start text-[9px] mb-2 text-gray-600">CLASS</h4>
                  <p className="font-sans font-bold text-gray-900 text-lg">.NET Paladin</p>
                </div>

                {}
                <div className="bg-white border-4 border-black p-4 pixel-shadow-sm">
                  <div className="flex justify-between items-center border-b-2 border-black pb-1.5 mb-2.5">
                    <h4 className="font-press-start text-[9px] font-bold">ATTRIBUTES</h4>
                    <span className="font-press-start text-[8px] text-[#be000c] animate-pulse">
                      SP: {skillPoints}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-sans font-bold flex items-center gap-1">
                          <Code className="w-3.5 h-3.5 text-blue-500" />
                          C# & .NET Core Magic
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold">{stats.codeQuality}</span>
                          <button
                            onClick={() => handleUpgradeStat("codeQuality")}
                            disabled={skillPoints <= 0}
                            className={`w-5 h-5 flex items-center justify-center border border-black bg-[#ffd30a] text-black font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed`}
                            title="Upgrade Attribute (+5)"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 border border-black overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${stats.codeQuality}%` }} />
                      </div>
                    </div>

                    {}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-sans font-bold flex items-center gap-1">
                          <Brain className="w-3.5 h-3.5 text-[#be000c]" />
                          SQL Server & DB Design
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold">{stats.aiSorcery}</span>
                          <button
                            onClick={() => handleUpgradeStat("aiSorcery")}
                            disabled={skillPoints <= 0}
                            className="w-5 h-5 flex items-center justify-center border border-black bg-[#ffd30a] text-black font-bold text-xs disabled:opacity-40"
                            title="Upgrade Attribute (+5)"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 border border-black overflow-hidden">
                        <div className="h-full bg-[#be000c]" style={{ width: `${stats.aiSorcery}%` }} />
                      </div>
                    </div>

                    {}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-sans font-bold flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#0f8925]" />
                          Docker & Microservices
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold">{stats.gameDesign}</span>
                          <button
                            onClick={() => handleUpgradeStat("gameDesign")}
                            disabled={skillPoints <= 0}
                            className="w-5 h-5 flex items-center justify-center border border-black bg-[#ffd30a] text-black font-bold text-xs disabled:opacity-40"
                            title="Upgrade Attribute (+5)"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 border border-black overflow-hidden">
                        <div className="h-full bg-[#0f8925]" style={{ width: `${stats.gameDesign}%` }} />
                      </div>
                    </div>

                    {}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-sans font-bold flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5 text-purple-500" />
                          Algorithmic Wizardry
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold">{stats.bugCleansing}</span>
                          <button
                            onClick={() => handleUpgradeStat("bugCleansing")}
                            disabled={skillPoints <= 0}
                            className="w-5 h-5 flex items-center justify-center border border-black bg-[#ffd30a] text-black font-bold text-xs disabled:opacity-40"
                            title="Upgrade Attribute (+5)"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 border border-black overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${stats.bugCleansing}%` }} />
                      </div>
                    </div>

                  </div>
                  <p className="text-[10px] text-gray-500 mt-3 italic leading-snug">
                    Complete quests to gain Skill Points (SP) to spend!
                  </p>
                </div>

              </div>

              {}
              <div className="md:col-span-8 flex flex-col gap-6">
                
                {}
                <div className="bg-white pixel-border pixel-shadow p-6">
                  <h3 className="font-press-start text-xs md:text-sm mb-6 flex items-center gap-2 text-[#be000c]">
                    <span className="material-symbols-outlined font-bold text-lg select-none">info</span> THE MISSION
                  </h3>
                  
                  <p className="font-sans text-base md:text-lg leading-relaxed text-gray-800 cursor-blink">
                    Junior .NET Backend Developer and fresh graduate with an IT degree and real project experience building REST APIs and web applications using ASP.NET Core and C#. Familiar with Clean Architecture, SOLID principles, SQL Server, and Docker.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="bg-black text-white px-3 py-1 font-press-start text-[8px] select-none">C#</span>
                    <span className="bg-black text-white px-3 py-1 font-press-start text-[8px] select-none">ASP.NET CORE</span>
                    <span className="bg-black text-white px-3 py-1 font-press-start text-[8px] select-none">SQL SERVER</span>
                    <span className="bg-black text-white px-3 py-1 font-press-start text-[8px] select-none">DOCKER</span>
                    <span className="bg-black text-white px-3 py-1 font-press-start text-[8px] select-none">CLEAN ARCHITECTURE</span>
                  </div>
                </div>

                {}
                <div className="bg-black text-green-400 border-4 border-black pixel-shadow p-4 font-mono">
                  <div className="flex items-center justify-between border-b border-green-800 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
                      <span className="font-press-start text-[9px] text-[#ffe179] tracking-wider select-none">
                        NPC CONSOLE: MAHMOUD ALI
                      </span>
                    </div>
                    <span className="text-[10px] text-green-600 font-mono">NODE_ONLINE</span>
                  </div>

                  {}
                  <div className="h-44 overflow-y-auto mb-3 space-y-3 pr-2 bg-zinc-950 p-2.5 border-2 border-green-950 text-xs">
                    {messages.map((m, i) => {
                      const isLastModelMsg = m.role === "model" && i === messages.length - 1;
                      return (
                        <div 
                          key={m.id} 
                          className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {m.role !== "user" && (
                            <div className="w-8 h-8 border border-green-500 bg-[#e2e2e2] shrink-0 p-0.5 overflow-hidden">
                              <img 
                                src={avatarImg} 
                                className="w-full h-full object-contain" 
                                alt="avatar"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                          
                          <div 
                            className={`p-2 rounded-none max-w-[80%] leading-relaxed ${
                              m.role === "user" 
                                ? "bg-green-900/30 border border-green-600 text-green-300" 
                                : "bg-black text-green-400 font-mono"
                            }`}
                          >
                            <div className="text-[10px] opacity-40 mb-0.5 font-mono">
                              {m.role === "user" ? "ADVENTURER" : "NPC MAHMOUD"}
                            </div>
                            <p className="whitespace-pre-line text-xs">
                              {isLastModelMsg ? typewrittenText : m.content}
                              {isLastModelMsg && isTypingActive && (
                                <span className="inline-block w-2 h-3 bg-green-400 animate-pulse ml-0.5" />
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {chatLoading && (
                      <div className="flex gap-2 justify-start items-center">
                        <div className="w-8 h-8 border border-green-500 bg-zinc-900 shrink-0 flex items-center justify-center">
                          <span className="font-press-start text-[8px] animate-spin text-[#ffe179] select-none">?</span>
                        </div>
                        <div className="p-2 bg-black text-green-400 text-xs italic">
                          <span>Spell cast processing...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {}
                  <div className="mb-3">
                    <span className="text-[10px] text-green-600 font-mono block mb-1.5 select-none">
                      CHOOSE TALK OPTION:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSendChatMessage(q)}
                          disabled={chatLoading}
                          className="text-[10px] bg-zinc-900 hover:bg-green-950 hover:text-white text-green-400 px-2 py-1.5 border border-green-800 transition-colors cursor-pointer"
                        >
                          &gt; {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                      placeholder="Cast a custom question spell here..."
                      className="bg-zinc-950 text-green-400 border border-green-800 flex-1 p-2 focus:outline-none focus:border-green-400 placeholder-green-800 text-xs rounded-none font-mono select-text"
                    />
                    <button
                      onClick={() => handleSendChatMessage()}
                      disabled={chatLoading || !inputMessage.trim()}
                      className="bg-green-800 hover:bg-green-600 text-black font-bold px-3 py-2 flex items-center justify-center select-none disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {}
        <section className="py-16 px-6 relative" id="work">
          <div className="absolute inset-0 brick-pattern opacity-10 pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-[#be000c] px-4 py-2 pixel-border">
                <h2 className="font-press-start text-xs md:text-sm text-white select-none">LEVEL 2</h2>
              </div>
              <div className="h-1 flex-1 bg-black"></div>
              <h2 className="font-press-start text-xs md:text-sm text-black select-none">EXPERIENCE</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {}
              <div 
                onClick={triggerBlip}
                className="bg-[#943100] text-white pixel-border pixel-shadow p-6 hover:-translate-y-2 transition-transform cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="bg-white/25 p-2.5 mb-4 inline-block">
                    <span className="material-symbols-outlined text-4xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
                  </div>
                  <h3 className="font-press-start text-[10px] font-bold mb-1">DEPI GUILD</h3>
                  <p className="text-[9px] font-press-start text-yellow-300 opacity-90 mb-4 select-none">JUN - DEC 2025</p>
                  <p className="text-xs font-press-start text-[#ffe179] mb-3">.NET Developer Intern</p>
                  <ul className="space-y-2 font-sans text-xs">
                    <li className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-[#ffd30a] text-xs shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span> 
                      <span>Built APIs & MVC apps with ASP.NET Core & C#.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-[#ffd30a] text-xs shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span> 
                      <span>Applied Clean Architecture & Repository pattern.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-[#ffd30a] text-xs shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span> 
                      <span>Used Git & Azure DevOps for Agile sprint tracking.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {}
              <div 
                onClick={triggerBlip}
                className="bg-[#006d18] text-white pixel-border pixel-shadow p-6 hover:-translate-y-2 transition-transform cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="bg-white/25 p-2.5 mb-4 inline-block">
                    <span className="material-symbols-outlined text-4xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                  </div>
                  <h3 className="font-press-start text-[10px] font-bold mb-1">BANQUE MISR</h3>
                  <p className="text-[9px] font-press-start text-[#ffe179] opacity-90 mb-4 select-none">JUN - AUG 2024</p>
                  <p className="text-xs font-press-start text-[#ffe179] mb-3">Software Dev Intern</p>
                  <ul className="space-y-2 font-sans text-xs">
                    <li className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-[#ffe179] text-xs shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span> 
                      <span>Worked in a Scrum team with stand-ups & reviews.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-[#ffe179] text-xs shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span> 
                      <span>Built responsive UI using Angular & Bootstrap.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {}
              <div 
                onClick={triggerBlip}
                className="bg-[#e2e2e2] text-black pixel-border pixel-shadow p-6 hover:-translate-y-2 transition-transform cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="bg-black/10 p-2.5 mb-4 inline-block">
                    <span className="material-symbols-outlined text-4xl text-black select-none" style={{ fontVariationSettings: "'FILL' 1" }}>settings_ethernet</span>
                  </div>
                  <h3 className="font-press-start text-[10px] font-bold mb-1 text-black">NTI GUILD</h3>
                  <p className="text-[9px] font-press-start text-gray-500 mb-4 select-none">AUG - SEP 2024</p>
                  <p className="text-xs font-press-start text-gray-600 mb-3">Network Eng Intern</p>
                  <ul className="space-y-2 font-sans text-xs">
                    <li className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-gray-800 text-xs shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span> 
                      <span>Trained in TCP/IP & cyber-security basics.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-gray-800 text-xs shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span> 
                      <span>Configured OSPF, VLANs, and Firewall rules.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {}
              <div 
                onClick={triggerBlip}
                className="bg-[#e2e2e2] text-black pixel-border pixel-shadow p-6 hover:-translate-y-2 transition-transform cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="bg-black/10 p-2.5 mb-4 inline-block">
                    <span className="material-symbols-outlined text-4xl text-black select-none" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                  </div>
                  <h3 className="font-press-start text-[10px] font-bold mb-1 text-black">EELU UNIVERSITY</h3>
                  <p className="text-[9px] font-press-start text-gray-500 mb-4 select-none">CLASS OF 2026</p>
                  <p className="text-xs font-press-start text-gray-600 mb-3">Bachelor of IT</p>
                  <ul className="space-y-2 font-sans text-xs">
                    <li className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-gray-800 text-xs shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span> 
                      <span>Graduated with overall grade: Very Good.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-gray-800 text-xs shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span> 
                      <span>Graduation project: Excellent (Torostack).</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        </section>



        {}
        <section className="py-16 px-6 bg-[#dae5f9]" id="projects">
          <div className="max-w-6xl mx-auto">
            
            <div className="text-center mb-16">
              <div className="inline-block bg-[#ffd30a] px-8 py-3 pixel-border pixel-shadow-sm mb-4">
                <h2 className="font-press-start text-xs md:text-sm text-black select-none">
                  LEVEL 3: PROJECT PORTFOLIO
                </h2>
              </div>
              <p className="font-sans text-lg text-gray-800">
                Examine all projects to complete the quest. Click to inspect their specs and architecture!
              </p>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {GAME_PROJECTS.map((project, idx) => {
                const cardColors = [
                  "bg-white text-black border-black",
                  "bg-[#ffd30a] text-black border-black",
                  "bg-[#e52521] text-white border-black"
                ];
                const buttonTextColors = [
                  "text-[#be000c]",
                  "text-black",
                  "text-white hover:text-yellow-300"
                ];
                const badgeColors = [
                  "bg-black text-white",
                  "bg-black text-[#ffd30a]",
                  "bg-white text-[#e52521]"
                ];

                const colorClass = cardColors[idx % cardColors.length];
                const btnColorClass = buttonTextColors[idx % buttonTextColors.length];
                const badgeColorClass = badgeColors[idx % badgeColors.length];

                return (
                  <div 
                    key={project.id}
                    className={`${colorClass} pixel-border pixel-shadow overflow-hidden group flex flex-col justify-between p-6`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`font-press-start text-[8px] px-2 py-1 pixel-border ${badgeColorClass} select-none`}>
                          {project.category}
                        </span>
                        <div className="bg-black/10 w-10 h-10 pixel-border flex items-center justify-center select-none shrink-0 ml-2">
                          <span className="font-press-start text-sm font-bold">#0{idx+1}</span>
                        </div>
                      </div>

                      <h3 className="font-press-start text-xs md:text-sm mb-3 font-bold tracking-tight">
                        {project.title}
                      </h3>
                      <p className="font-sans text-xs md:text-sm leading-relaxed mb-6 opacity-90">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-current/20">
                      <button 
                        onClick={() => {
                          triggerBlip();
                          setSelectedProject(project);
                          completeQuest("explore");
                        }}
                        className={`text-[9px] font-press-start ${btnColorClass} flex items-center gap-2 hover:translate-x-1.5 transition-transform cursor-pointer font-bold`}
                      >
                        VIEW SPECS <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {}
        <section className="py-16 px-6 bg-[#f3f3f3] relative" id="achievements">
          <div className="max-w-6xl mx-auto">
            
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-[#ffd30a] px-4 py-2 pixel-border">
                <h2 className="font-press-start text-xs md:text-sm text-black select-none">LEVEL 4</h2>
              </div>
              <div className="h-1 flex-1 bg-black"></div>
              <h2 className="font-press-start text-xs md:text-sm text-black select-none">ACHIEVEMENTS</h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              
              <div className="flex-1 flex justify-center items-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 pixel-border bg-[#e2e2e2] pixel-shadow overflow-hidden group">
                  <img 
                    alt="Mahmoud Ali ACPC ECPC Participation" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                    src={acpcImg}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="pixel-border bg-white p-6 pixel-shadow max-w-xl">
                  <h3 className="font-press-start text-xs md:text-sm text-black mb-4">
                    PROBLEM SOLVING &amp; ALGORITHMS
                  </h3>
                  
                  <ul className="space-y-4 font-sans text-sm md:text-base text-gray-800 mb-6">
                    <li className="flex gap-2.5 items-start text-left">
                      <span className="material-symbols-outlined text-[#0f8925] text-lg shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                      <span>Solved problems on Codeforces – strong algorithmic and problem-solving skills.</span>
                    </li>
                    <li className="flex gap-2.5 items-start text-left">
                      <span className="material-symbols-outlined text-[#0f8925] text-lg shrink-0 mt-0.5 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                      <span>Participated in the Egyptian Collegiate Programming Contest (ECPC) 2025.</span>
                    </li>
                  </ul>

                  <div className="flex justify-center md:justify-start">
                    <a 
                      href="https://codeforces.com/profile/ma7.eg" 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={triggerBlip}
                      className="px-6 py-3 bg-[#e52521] text-white font-press-start text-[9px] border-2 border-black pixel-shadow hover:bg-[#be000c] active:translate-y-0.5 transition-transform inline-flex items-center gap-2"
                    >
                      <Code className="w-4 h-4" />
                      VIEW CODEFORCES PROFILE
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {}
      <footer className="border-t-4 border-black bg-[#943100] text-white py-12 px-6 relative mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffe179] text-3xl animate-pulse select-none" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              <h2 className="font-press-start text-xs md:text-sm text-white select-none">QUEST COMPLETE</h2>
            </div>
            <p className="font-press-start text-[8px] opacity-70 select-none">
              © 2026 MAHMOUD ALI - ALL QUESTS COMPLETE
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-center">
            {}
            <div className="flex gap-6">
              <a 
                onClick={triggerBlip}
                href="https://linkedin.com/in/mahmoudali2" 
                target="_blank" 
                rel="noreferrer" 
                className="flex flex-col items-center gap-2 text-white hover:text-[#ffe179] transition-colors group"
              >
                <Share2 className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="font-press-start text-[8px]">LINKEDIN</span>
              </a>
              <a 
                onClick={triggerBlip}
                href="https://github.com/Ma7EG" 
                target="_blank" 
                rel="noreferrer" 
                className="flex flex-col items-center gap-2 text-white hover:text-[#ffe179] transition-colors group"
              >
                <Terminal className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="font-press-start text-[8px]">GITHUB</span>
              </a>
              <a 
                onClick={triggerBlip}
                href="https://codeforces.com/profile/ma7.eg" 
                target="_blank" 
                rel="noreferrer" 
                className="flex flex-col items-center gap-2 text-white hover:text-[#ffe179] transition-colors group"
              >
                <Award className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="font-press-start text-[8px]">CODEFORCES</span>
              </a>
              <a 
                onClick={triggerBlip}
                href="mailto:mody044404440@gmail.com" 
                className="flex flex-col items-center gap-2 text-white hover:text-[#ffe179] transition-colors group"
              >
                <Mail className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span className="font-press-start text-[8px]">EMAIL</span>
              </a>
            </div>

            {}
            <div className="pixel-border bg-black p-4 text-white min-w-36 text-center shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] select-none">
              <p className="font-press-start text-[9px] text-[#ffe179] mb-1">TOTAL HERO SCORE</p>
              <p className="font-press-start text-xs text-white">{score}</p>
            </div>
          </div>

        </div>
      </footer>

      {}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-3 bg-[#e2e2e2] border-t-4 border-black shadow-[0_-4px_0_0_rgba(0,0,0,1)] md:hidden">
        <a 
          onClick={triggerBlip}
          className="flex flex-col items-center justify-center text-gray-700 p-1 font-bold" 
          href="#about"
        >
          <span className="material-symbols-outlined text-lg select-none">person</span>
          <span className="font-press-start text-[7px] mt-0.5">ABOUT</span>
        </a>
        <a 
          onClick={triggerBlip}
          className="flex flex-col items-center justify-center bg-[#ffd30a] text-black border-2 border-black px-3 py-1 active:scale-95 transition-transform" 
          href="#work"
        >
          <span className="material-symbols-outlined text-lg select-none">work</span>
          <span className="font-press-start text-[7px] mt-0.5">WORK</span>
        </a>
        <a 
          onClick={triggerBlip}
          className="flex flex-col items-center justify-center text-gray-700 p-1 font-bold" 
          href="#projects"
        >
          <span className="material-symbols-outlined text-lg select-none">code</span>
          <span className="font-press-start text-[7px] mt-0.5">PROJECTS</span>
        </a>
        <a 
          onClick={triggerBlip}
          className="flex flex-col items-center justify-center text-gray-700 p-1 font-bold" 
          href="#achievements"
        >
          <span className="material-symbols-outlined text-lg select-none">emoji_events</span>
          <span className="font-press-start text-[7px] mt-0.5">AWARD</span>
        </a>
      </nav>

      {}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white border-4 border-black max-w-2xl w-full p-6 relative pixel-shadow"
            >
              <button 
                onClick={() => {
                  triggerBlip();
                  setSelectedProject(null);
                }}
                className="absolute top-4 right-4 bg-[#e52521] text-white border-2 border-black p-1 active:translate-y-0.5 transition-transform"
                title="Close case study"
              >
                <X className="w-4 h-4 text-white font-bold" />
              </button>

              <div className="flex items-center gap-3 border-b-4 border-black pb-3 mb-4">
                <Terminal className="w-8 h-8 text-[#0f8925] animate-pulse" />
                <div>
                  <span className="font-press-start text-[8px] bg-black text-white px-2 py-0.5 select-none">
                    {selectedProject.category}
                  </span>
                  <h3 className="font-press-start text-xs md:text-sm text-black mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {selectedProject.imageUrl && (
                  <div className="aspect-video w-full border-4 border-black overflow-hidden">
                    <img 
                      src={selectedProject.imageUrl} 
                      className="w-full h-full object-cover" 
                      alt={selectedProject.title}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div>
                  <h4 className="font-press-start text-[9px] text-[#be000c] mb-1">PROJECT MISSION</h4>
                  <p className="font-sans text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 border-l-4 border-black">
                    {selectedProject.description}
                  </p>
                </div>

                {selectedProject.extraInfo && (
                  <div>
                    <h4 className="font-press-start text-[9px] text-[#0f8925] mb-1">DETAILS & STACK</h4>
                    <p className="font-sans text-xs text-gray-700 leading-relaxed bg-zinc-50 p-3 border border-dashed border-zinc-400 font-mono">
                      {selectedProject.extraInfo}
                    </p>
                  </div>
                )}

                {selectedProject.link && (
                  <div>
                    <h4 className="font-press-start text-[9px] text-[#0f8925] mb-1">PORTAL URL</h4>
                    <p className="font-sans text-xs bg-zinc-50 p-3 border border-dashed border-zinc-400">
                      <a 
                        href={selectedProject.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 hover:text-blue-800 underline font-bold break-all"
                      >
                        {selectedProject.link}
                      </a>
                    </p>
                  </div>
                )}
                
                {selectedProject.progress && (
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-press-start text-gray-600 mb-1">
                      <span>PROJECT LAUNCH PHASES COMPLETE</span>
                      <span>{selectedProject.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 border border-black overflow-hidden">
                      <div className="h-full bg-[#0f8925]" style={{ width: `${selectedProject.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-3 border-t-2 border-black flex justify-end">
                <button
                  onClick={() => {
                    triggerBlip();
                    setSelectedProject(null);
                  }}
                  className="bg-[#ffd30a] text-black font-press-start text-[9px] px-4 py-2 border-2 border-black pixel-shadow-sm active:translate-y-0.5 transition-transform"
                >
                  QUEST CLEAR - CLOSE
                </button>
              </div>

            </motion.div>
          </div>
        )}

        {discordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-black pixel-border pixel-shadow w-full max-w-sm p-6 relative flex flex-col justify-between"
            >
              <button 
                onClick={() => {
                  triggerBlip();
                  setDiscordModalOpen(false);
                }}
                className="absolute top-4 right-4 text-black hover:text-[#be000c] font-bold text-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b-2 border-black pb-3 mb-4">
                <Terminal className="w-8 h-8 text-[#0f8925]" />
                <div>
                  <span className="font-press-start text-[8px] bg-black text-white px-2 py-0.5 select-none">
                    SOCIAL CONNECTIONS
                  </span>
                  <h3 className="font-press-start text-xs md:text-sm text-black mt-1">
                    DISCORD ID
                  </h3>
                </div>
              </div>

              <div className="space-y-4 pr-2">
                <div>
                  <h4 className="font-press-start text-[9px] text-[#0f8925] mb-1">USERNAME</h4>
                  <p className="font-mono text-sm bg-zinc-50 p-4 border border-dashed border-zinc-400 text-center font-bold select-all">
                    ma76552
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t-2 border-black flex justify-end">
                <button
                  onClick={() => {
                    triggerBlip();
                    setDiscordModalOpen(false);
                  }}
                  className="bg-[#ffd30a] text-black font-press-start text-[9px] px-4 py-2 border-2 border-black pixel-shadow-sm active:translate-y-0.5 transition-transform"
                >
                  CLOSE
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

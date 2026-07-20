import React, { useState } from "react";
import { INITIAL_QUESTS, INITIAL_STATS } from "./utils/gameData";
import { Quest, CharacterStats, ChatMessage } from "./types";
export default function App() {
  const [score, setScore] = useState(999900);
  const [xp, setXp] = useState(0);
  const [skillPoints, setSkillPoints] = useState(3);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [stats, setStats] = useState<CharacterStats>(INITIAL_STATS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div className="bg-[#5C94FC] text-[#1b1b1b] min-h-screen pb-16 md:pb-0 font-body-md relative overflow-hidden select-none">
      <header className="sticky top-0 z-50 w-full bg-[#0f8925] text-white flex justify-between items-center px-6 h-16 border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <h1 className="font-press-start text-xs md:text-sm tracking-tight text-white select-none">MAHMOUD ALI</h1>
      </header>
      <main className="max-w-6xl mx-auto px-6 pt-6">
        <section className="py-16 px-6 bg-[#f3f3f3]" id="chat">
          <h3 className="font-press-start text-xs">NPC CONSOLE: MAHMOUD ALI</h3>
        </section>
      </main>
      <footer className="border-t-4 border-black bg-[#943100] text-white py-12 px-6 relative mt-12">
        <p className="font-press-start text-[8px] opacity-70 select-none">© 2026 MAHMOUD ALI</p>
      </footer>
    </div>
  );
}
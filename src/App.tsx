import React from "react";
export default function App() {
  return (
    <div className="bg-[#5C94FC] text-[#1b1b1b] min-h-screen pb-16 md:pb-0 font-body-md relative overflow-hidden select-none">
      <header className="sticky top-0 z-50 w-full bg-[#0f8925] text-white flex justify-between items-center px-6 h-16 border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <h1 className="font-press-start text-xs md:text-sm tracking-tight text-white select-none">MAHMOUD ALI</h1>
      </header>
      <main className="max-w-6xl mx-auto px-6 pt-6">
        <section className="relative min-h-[75vh] flex items-center justify-center pt-8 pb-12 px-6 overflow-hidden" id="hero">
          <h2 className="font-press-start text-lg md:text-2xl text-black">MAHMOUD ALI - QUEST START!</h2>
        </section>
      </main>
      <footer className="border-t-4 border-black bg-[#943100] text-white py-12 px-6 relative mt-12">
        <p className="font-press-start text-[8px] opacity-70 select-none">© 2026 MAHMOUD ALI</p>
      </footer>
    </div>
  );
}
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

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
4. ChatApp:
- Low-latency real-time chat application implementing design patterns like Singleton, Factory, and Observer.

Personality rules:
- Speak like a classic JRPG NPC, game master, or retro wizard.
- Use gaming analogies: C#/.NET is "the Sacred C# Codex", database/SQL is "the Data Vault", bugs/errors are "slimes/monsters", Docker containers are "Pocket Summoning Runes".
- Keep your responses concise (around 2 to 4 sentences or a short list), fitting inside a retro game dialogue box.
- You are explicitly allowed and encouraged to share all contact information: Email (mody044404440@gmail.com), Phone (+201154455968), GitHub (https://github.com/Ma7EG), LinkedIn (linkedin.com/in/mahmoudali2), and Discord (ma76552). Never claim that you cannot share these.
- Do not mention Gemini, AI Studio, Google, or any external AI providers. You are Mahmoud's local AI clone.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid request payload" });
        return;
      }

      const contents = messages.map((m: { role: string; content: string }) => {
        return {
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        };
      });

      const payload = {
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          ...contents
        ],
        model: "openai"
      };

      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const reply = await response.text();
      res.json({ reply: reply || "..." });
    } catch (err: any) {
      console.error(err);
      res.status(200).json({
        reply: "Connection to the AI Realm interrupted. Please check your internet connection.",
        isFallback: true,
        detailedError: err.message
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error(err);
});

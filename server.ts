import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface RSVPRecord {
  id: string;
  guestName: string;
  attending: "confirmed" | "declined";
  companionCount: number;
  companionNames?: string;
  adultsCount: number;
  childrenCount: number;
  phone: string;
  message?: string;
  createdAt: string;
  syncedToSheets?: boolean;
}

interface GuestMessageRecord {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

// In-memory data store with initial sample items
const rsvpStore: RSVPRecord[] = [
  {
    id: "rsvp-1",
    guestName: "Carla Santos",
    attending: "confirmed",
    companionCount: 1,
    companionNames: "Roberto Santos",
    adultsCount: 2,
    childrenCount: 0,
    phone: "(11) 98888-7777",
    message: "Desejo toda a felicidade do mundo ao casal lindo!",
    createdAt: new Date().toISOString(),
    syncedToSheets: false,
  }
];

const messageStore: GuestMessageRecord[] = [
  {
    id: "msg-1",
    author: "Família Silva",
    message: "Que a união de vocês seja abençoada com muito amor, cumplicidade e alegrias!",
    createdAt: new Date().toISOString(),
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // API Route: Healthcheck
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route: Get RSVPs
  app.get("/api/rsvp", (req: Request, res: Response) => {
    const totalConfirmed = rsvpStore.filter(r => r.attending === "confirmed");
    const totalDeclined = rsvpStore.filter(r => r.attending === "declined");
    const totalGuestsCount = totalConfirmed.reduce((sum, r) => sum + 1 + (r.companionCount || 0), 0);

    res.json({
      rsvps: rsvpStore,
      summary: {
        totalResponses: rsvpStore.length,
        totalConfirmedCount: totalConfirmed.length,
        totalDeclinedCount: totalDeclined.length,
        totalGuestsCount,
      }
    });
  });

  // API Route: Create RSVP
  app.post("/api/rsvp", async (req: Request, res: Response) => {
    try {
      const { guestName, attending, companionCount, companionNames, adultsCount, childrenCount, phone, message, webhookUrl } = req.body;

      if (!guestName || !attending) {
        res.status(400).json({ error: "Nome e confirmação de presença são obrigatórios." });
        return;
      }

      const newRSVP: RSVPRecord = {
        id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        guestName: String(guestName).trim(),
        attending: attending === "confirmed" ? "confirmed" : "declined",
        companionCount: Number(companionCount) || 0,
        companionNames: companionNames ? String(companionNames).trim() : "",
        adultsCount: Number(adultsCount) || 1,
        childrenCount: Number(childrenCount) || 0,
        phone: phone ? String(phone).trim() : "",
        message: message ? String(message).trim() : "",
        createdAt: new Date().toISOString(),
        syncedToSheets: false,
      };

      rsvpStore.unshift(newRSVP);

      // Attempt optional forward to Google Sheets Webhook URL if provided
      if (webhookUrl && typeof webhookUrl === "string" && webhookUrl.startsWith("http")) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: newRSVP.id,
              nome: newRSVP.guestName,
              confirmacao: newRSVP.attending === "confirmed" ? "CONFIRMADO" : "NÃO IRÁ",
              acompanhantesCount: newRSVP.companionCount,
              acompanhantesNomes: newRSVP.companionNames,
              adultos: newRSVP.adultsCount,
              criancas: newRSVP.childrenCount,
              telefone: newRSVP.phone,
              mensagem: newRSVP.message,
              dataEnvio: newRSVP.createdAt
            }),
          });
          newRSVP.syncedToSheets = true;
        } catch (err) {
          console.error("Erro ao sincronizar webhook com Google Sheets:", err);
        }
      }

      res.status(201).json({
        success: true,
        rsvp: newRSVP,
        message: "Confirmação salva com sucesso!"
      });
    } catch (err) {
      console.error("Erro no endpoint /api/rsvp:", err);
      res.status(500).json({ error: "Falha ao registrar confirmação." });
    }
  });

  // API Route: Delete RSVP
  app.delete("/api/rsvp/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const index = rsvpStore.findIndex(r => r.id === id);
    if (index !== -1) {
      rsvpStore.splice(index, 1);
      res.json({ success: true, message: "Registro removido com sucesso." });
    } else {
      res.status(404).json({ error: "Registro não encontrado." });
    }
  });

  // API Route: Export CSV for Google Sheets import
  app.get("/api/rsvp/export-csv", (req: Request, res: Response) => {
    const headers = ["ID", "Nome do Convidado", "Status", "Acompanhantes", "Nomes Acompanhantes", "Adultos", "Crianças", "Telefone", "Mensagem", "Data de Envio"];
    
    const rows = rsvpStore.map(r => [
      `"${r.id}"`,
      `"${r.guestName.replace(/"/g, '""')}"`,
      `"${r.attending === "confirmed" ? "Confirmado" : "Não Irá"}"`,
      r.companionCount,
      `"${(r.companionNames || "").replace(/"/g, '""')}"`,
      r.adultsCount,
      r.childrenCount,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      `"${r.createdAt}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="confirmacoes_casamento.csv"');
    res.status(200).send(csvContent);
  });

  // API Route: Sync to Google Sheets Webhook
  app.post("/api/rsvp/sync-sheets", async (req: Request, res: Response) => {
    const { webhookUrl } = req.body;
    if (!webhookUrl || typeof webhookUrl !== "string") {
      res.status(400).json({ error: "URL da planilha / Webhook inválida." });
      return;
    }

    let syncedCount = 0;
    for (const rsvp of rsvpStore) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: rsvp.id,
            nome: rsvp.guestName,
            confirmacao: rsvp.attending === "confirmed" ? "CONFIRMADO" : "NÃO IRÁ",
            acompanhantesCount: rsvp.companionCount,
            acompanhantesNomes: rsvp.companionNames,
            adultos: rsvp.adultsCount,
            criancas: rsvp.childrenCount,
            telefone: rsvp.phone,
            mensagem: rsvp.message,
            dataEnvio: rsvp.createdAt
          }),
        });
        rsvp.syncedToSheets = true;
        syncedCount++;
      } catch (e) {
        console.error(`Erro ao enviar rsvp ${rsvp.id} ao webhook:`, e);
      }
    }

    res.json({ success: true, count: syncedCount, total: rsvpStore.length });
  });

  // API Route: Guestbook Messages
  app.get("/api/messages", (req: Request, res: Response) => {
    res.json({ messages: messageStore });
  });

  app.post("/api/messages", (req: Request, res: Response) => {
    const { author, message } = req.body;
    if (!author || !message) {
      res.status(400).json({ error: "Autor e mensagem são obrigatórios." });
      return;
    }

    const newMessage: GuestMessageRecord = {
      id: `msg-${Date.now()}`,
      author: String(author).trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
    };

    messageStore.unshift(newMessage);
    res.status(201).json({ success: true, message: newMessage });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor do Convite Virtual rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();

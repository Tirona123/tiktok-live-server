import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { WebcastPushConnection } from "tiktok-live-connector";

const app = express();
app.use(express.json());

// =======================
// SERVER + WEBSOCKET
// =======================
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Game connected");

  ws.send(JSON.stringify({ type: "connected" }));
});

// =======================
// FAKE API (për test manual)
// =======================
app.post("/gift", (req, res) => {
  const gift = req.body;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({
        type: "gift",
        data: gift
      }));
    }
  });

  res.json({ ok: true });
});

// =======================
// TIKTOK LIVE CONNECT
// =======================

const tiktokUsername = "fotballnews.24"; // 👈 vendose username real

const tiktokLive = new WebcastPushConnection(tiktokUsername);

tiktokLive.connect()
  .then(() => console.log("Connected to TikTok LIVE"))
  .catch((err) => console.error("TikTok connection error:", err));

// =======================
// GIFT EVENTS (REAL LIVE)
// =======================
tiktokLive.on("gift", (data) => {
  // ignore "streak continue" spam
  if (data.repeatEnd === false && data.repeatCount > 1) return;

  const giftEvent = {
    type: "gift",
    data: {
      countryId: mapGiftToCountry(data.giftName),
      points: data.repeatCount || 1,
      emoji: "🎁",
      viewerName: data.uniqueId,
      eventName: data.giftName
    }
  };

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(giftEvent));
    }
  });
});

// =======================
// SIMPLE MAPPING SYSTEM
// =======================
function mapGiftToCountry(giftName) {
  const map = {
    "Rose": "usa",
    "TikTok": "brazil",
    "Heart": "russia",
    "Star": "germany"
  };

  return map[giftName] || "usa";
}

// =======================
// START SERVER
// =======================
server.listen(3001, () => {
  console.log("Server running on port 3001");
});
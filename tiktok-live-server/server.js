const { WebcastPushConnection } = require("tiktok-live-connector");
const WebSocket = require("ws");
const http = require("http");

// =====================
// CONFIG
// =====================
const TIKTOK_USERNAME = "fotballnews.24";
const PORT = process.env.PORT || 3001;

// =====================
// SERVER (RENDER SAFE)
// =====================
const server = http.createServer();
const wss = new WebSocket.Server({ server });

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// =====================
// TIKTOK LIVE
// =====================
const tiktok = new WebcastPushConnection("fotballnews.24");

// STABLE CONNECT (FIX FOR RENDER CRASH)
async function startTikTok() {
  try {
    await tiktok.connect();
    console.log("✅ Connected to TikTok LIVE");
  } catch (err) {
    console.error("❌ TikTok connection failed:", err);

    // retry automatik
    setTimeout(startTikTok, 10000);
  }
}

startTikTok();

// =====================
// GIFT HANDLER
// =====================
tiktok.on("gift", (data) => {
  console.log("🎁 Gift received:", data);

  const payload = {
    type: "gift",
    data: {
      viewerName: data.uniqueId,
      eventName: data.giftName,
      points: data.diamondCount || 1,
      emoji: "🎁",
      countryId: "albania"
    }
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
});

// =====================
// CONNECTION LOG
// =====================
wss.on("connection", (ws) => {
  console.log("🔗 Client connected");
});

// =====================
// GLOBAL ERROR SAFETY
// =====================
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Rejection:", err);
});

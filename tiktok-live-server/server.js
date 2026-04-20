const { WebcastPushConnection } = require("tiktok-live-connector");
const WebSocket = require("ws");
const http = require("http");

// =====================
// CONFIG
// =====================
const TIKTOK_USERNAME = "fotballnews.24";
const PORT = process.env.PORT || 3001;

// =====================
// HTTP + WEBSOCKET SERVER (RENDER FIX)
// =====================
const server = http.createServer();

const wss = new WebSocket.Server({ server });

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ WebSocket running on ws://localhost:${PORT}`);
});

// =====================
// TIKTOK LIVE CONNECTION
// =====================
const tiktok = new WebcastPushConnection(TIKTOK_USERNAME);

tiktok.connect()
  .then(() => {
    console.log("✅ Connected to TikTok LIVE");
  })
  .catch(err => {
    console.error("❌ TikTok connection error:", err);
  });

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
      countryId: "albania" // për momentin fikse
    }
  };

  // broadcast te loja
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
});

// =====================
// CLIENT CONNECTION
// =====================
wss.on("connection", (ws) => {
  console.log("🔗 Client connected to WebSocket");
});

// =====================
// ERROR HANDLING (stability fix)
// =====================
tiktok.on("error", (err) => {
  console.error("⚠️ TikTok error:", err);
});

wss.on("error", (err) => {
  console.error("⚠️ WebSocket error:", err);
});

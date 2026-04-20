const { WebcastPushConnection } = require("tiktok-live-connector");
const WebSocket = require("ws");

// =====================
// CONFIG
// =====================
const TIKTOK_USERNAME = "fotballnews.24";

// Port (IMPORTANT for deploy)
const PORT = process.env.PORT || 3001;

// =====================
// WEB SOCKET SERVER
// =====================
const wss = new WebSocket.Server({ port: PORT });

console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);

// =====================
// TIKTOK LIVE CONNECTION
// =====================
const tiktok = new WebcastPushConnection("fotballnews.24");

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
      countryId: "albania" // për momentin fikse (mund ta bëjmë më pas dynamic)
    }
  };

  // Broadcast to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
});

// =====================
// CONNECTION EVENTS
// =====================
wss.on("connection", (ws) => {
  console.log("🔗 Client connected to WebSocket");
});

wss.on("close", () => {
  console.log("❌ WebSocket client disconnected");
});
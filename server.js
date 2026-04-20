const { WebcastPushConnection } = require("tiktok-live-connector");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

// =====================
// WEB SOCKET SERVER
// =====================
const wss = new WebSocket.Server({ port: PORT });

console.log("✅ Server running on port:", PORT);

// =====================
// TIKTOK LIVE
// =====================
const tiktok = new WebcastPushConnection("fotballnews.24");

tiktok.connect()
  .then(() => {
    console.log("✅ Connected to TikTok LIVE");
  })
  .catch((err) => {
    console.error("❌ TikTok error:", err);
  });

// =====================
// GIFT EVENT
// =====================
tiktok.on("gift", (data) => {
  const payload = {
    type: "gift",
    data: {
      viewerName: data.uniqueId,
      giftName: data.giftName,
      points: data.diamondCount || 1,
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
// CLIENT CONNECT
// =====================
wss.on("connection", () => {
  console.log("🔗 Client connected");
});

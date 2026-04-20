const { WebcastPushConnection } = require("tiktok-live-connector");
const WebSocket = require("ws");
const http = require("http");

const PORT = process.env.PORT || 3001;
const TIKTOK_USERNAME = "fotballnews.24";

const server = http.createServer();
const wss = new WebSocket.Server({ server });

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const tiktok = new WebcastPushConnection(TIKTOK_USERNAME);

async function connectTikTok() {
  try {
    await tiktok.connect();
    console.log("✅ Connected to TikTok LIVE");
  } catch (err) {
    console.error("❌ TikTok connect failed:", err);
    setTimeout(connectTikTok, 10000);
  }
}

connectTikTok();

tiktok.on("gift", (data) => {
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

tiktok.on("streamEnd", () => {
  console.log("⚠️ Stream ended. Reconnecting...");
  setTimeout(connectTikTok, 5000);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Rejection:", err);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AccessToken } from "livekit-server-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// ✅ توليد توكن LiveKit (لكل مستخدم جديد)
app.get("/token", (req, res) => {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: "Missing LiveKit API credentials" });
    }

    const userId = "user-" + Math.floor(Math.random() * 100000);
    const at = new AccessToken(apiKey, apiSecret, { identity: userId });
    at.addGrant({ roomJoin: true, room: "virex-room" });

    const token = at.toJwt();
    res.json({ token });
  } catch (err) {
    console.error("Token generation error:", err);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

// ✅ فحص التشغيل
app.get("/", (req, res) => {
  res.send("✅ Virex Voice server is running!");
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغّال على المنفذ ${PORT}`);
});

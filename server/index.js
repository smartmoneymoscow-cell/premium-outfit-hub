import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
const FASHN_API_KEY = process.env.FASHN_API_KEY || "";
const FASHN_BASE = "https://api.fashn.ai/v1";

// Allowed origins — в проде укажи свой домен
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://smartmoneymoscow-cell.github.io",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error("CORS blocked"));
    },
  })
);

app.use(express.json({ limit: "15mb" }));

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
app.get("/", (_req, res) => res.json({ status: "ok", service: "vton-api" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---------------------------------------------------------------------------
// POST /api/tryon  — запуск виртуальной примерки
// ---------------------------------------------------------------------------
app.post("/api/tryon", upload.fields([
  { name: "model_image", maxCount: 1 },
  { name: "product_image", maxCount: 1 },
]), async (req, res) => {
  try {
    if (!FASHN_API_KEY) {
      return res.status(500).json({ error: "FASHN_API_KEY не настроен на сервере" });
    }

    const modelFile  = req.files?.model_image?.[0];
    const productFile = req.files?.product_image?.[0];

    if (!modelFile || !productFile) {
      return res.status(400).json({ error: "Нужны оба изображения: model_image и product_image" });
    }

    const modelB64   = `data:${modelFile.mimetype};base64,${modelFile.buffer.toString("base64")}`;
    const productB64 = `data:${productFile.mimetype};base64,${productFile.buffer.toString("base64")}`;

    // Запуск задачи в FASHN
    const runRes = await fetch(`${FASHN_BASE}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FASHN_API_KEY}`,
      },
      body: JSON.stringify({
        model_name: "tryon-max",
        inputs: {
          model_image: modelB64,
          product_image: productB64,
        },
      }),
    });

    const runData = await runRes.json();
    if (!runRes.ok) {
      console.error("FASHN /run error:", runData);
      return res.status(runRes.status).json({ error: runData.error || "FASHN API error" });
    }

    res.json({ id: runData.id });
  } catch (err) {
    console.error("POST /api/tryon error:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

// ---------------------------------------------------------------------------
// GET /api/tryon/:id  — проверка статуса
// ---------------------------------------------------------------------------
app.get("/api/tryon/:id", async (req, res) => {
  try {
    if (!FASHN_API_KEY) {
      return res.status(500).json({ error: "FASHN_API_KEY не настроен" });
    }

    const { id } = req.params;
    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${FASHN_API_KEY}` },
    });

    const data = await statusRes.json();
    if (!statusRes.ok) {
      return res.status(statusRes.status).json({ error: data.error || "Status check failed" });
    }

    // Отдаём только нужные поля
    res.json({
      status: data.status,          // "starting" | "processing" | "completed" | "failed"
      output: data.output || null,  // URL результата
      error: data.error || null,
    });
  } catch (err) {
    console.error("GET /api/tryon/:id error:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`VTON API server listening on :${PORT}`);
});

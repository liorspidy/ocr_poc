const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const runPythonOCR = require("./ocr-bridge");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads/"),
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

const app = express();
const PORT = 80;
const DOMAIN = '0.0.0.0'

const allowedOrigins = [
  "http://pama-poc-dev-poc-s3-static-site.s3-website-us-east-1.amazonaws.com/",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.post("/process", upload.single("file"), async (req, res) => {
  console.log("[SERVER] Received file:", req.file?.originalname);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded or invalid format" });
  }

  const filePath = req.file.path;
  const { promise, process: pythonProcess } = runPythonOCR(filePath);

  let clientGone = false;

  res.on("close", () => {
    if (!res.writableEnded) {
      clientGone = true;
      if (!pythonProcess.killed) {
        pythonProcess.kill("SIGKILL");
        console.log("[SERVER] Client disconnected. Python process killed.");
      }
    }
  });

  try {
    const result = await promise;
    if (!clientGone) {
      res.json(result);
    }
  } catch (err) {
    if (!clientGone) {
      console.error("[SERVER ERROR]:", err);
      res.status(500).json({ error: "Failed to process file" });
    }
  } finally {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`[CLEANUP] Deleted uploaded file: ${filePath}`);
      }
    } catch (unlinkErr) {
      console.warn(`[WARN] Failed to delete file ${filePath}:`, unlinkErr);
    }
  }
});

app.listen(PORT, DOMAIN, () => {
  console.log(`🚀 Server is running on http://${DOMAIN}:${PORT}`);
});


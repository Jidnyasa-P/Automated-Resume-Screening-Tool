import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
let pdf: any;
try {
  const pdf_lib = require("pdf-parse");
  // Some versions export as function, some as { default: function }
  pdf = typeof pdf_lib === 'function' ? pdf_lib : (pdf_lib.default || pdf_lib);
  console.log("pdf-parse loaded successfully, type:", typeof pdf);
} catch (err) {
  console.error("Failed to require pdf-parse:", err);
}

const app = express();
const PORT = 3000;

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  console.log("Starting server implementation...");
  
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // API Route for file parsing
  app.post("/api/parse-resume", upload.array("resumes"), async (req, res) => {
    console.log("Received /api/parse-resume request");
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        console.warn("No files in upload");
        return res.status(400).json({ error: "No files uploaded" });
      }

      console.log(`Processing ${files.length} files`);
      const results = await Promise.all(
        files.map(async (file) => {
          let text = "";
          console.log(`Parsing file: ${file.originalname} (${file.mimetype})`);
          
          try {
            if (file.mimetype === "application/pdf") {
              if (typeof pdf !== 'function') {
                console.error("pdf is not a function:", pdf);
                throw new Error("pdf-parse library was not loaded correctly as a function");
              }
              const data = await pdf(file.buffer);
              text = data.text;
            } else if (
              file.mimetype ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              const data = await mammoth.extractRawText({ buffer: file.buffer });
              text = data.value;
            } else if (file.mimetype === "text/plain") {
              text = file.buffer.toString("utf-8");
            } else {
              text = "Unsupported file type: " + file.mimetype;
            }
          } catch (err: any) {
            console.error(`Error parsing ${file.originalname}:`, err);
            text = `Error parsing file: ${err.message}`;
          }

          return {
            fileName: file.originalname,
            text: text.trim(),
          };
        })
      );

      console.log("Parsing completed successfully");
      res.json(results);
    } catch (error: any) {
      console.error("Critical error in /api/parse-resume:", error);
      res.status(500).json({ error: `Failed to parse resumes: ${error.message}` });
    }
  });

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

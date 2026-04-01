const fs = require("fs");
const https = require("https");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { initializeFirebase } = require("./config/firebase");
const authMiddleware = require("./middleware/auth");
const createAuthRoutes = require("./routes/authRoutes");
const { createNotesRoutes, createSharedNotesRoutes } = require("./routes/notesRoutes");
const createUserRoutes = require("./routes/userRoutes");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const PORT = Number(process.env.PORT || 3000);
const { admin, db } = initializeFirebase();
const keyPath = path.resolve(process.cwd(), process.env.SSL_KEY_PATH || "certs/key.pem");
const certPath = path.resolve(process.cwd(), process.env.SSL_CERT_PATH || "certs/cert.pem");
const hasHttpsCertificates = fs.existsSync(keyPath) && fs.existsSync(certPath);
const configuredBaseUrl = (process.env.APP_BASE_URL || "").trim();
const defaultBaseUrl = `${hasHttpsCertificates ? "https" : "http"}://localhost:${PORT}`;

app.locals.baseUrl = configuredBaseUrl || defaultBaseUrl;

app.use(cors());
app.use(bodyParser.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(express.static(path.join(process.cwd(), "frontend")));

app.get("/api/health", (req, res) => {
  res.json({ message: "Diary API is running." });
});

app.use("/api/auth", createAuthRoutes({ admin, db }));
app.use("/api/notes/shared", createSharedNotesRoutes({ db }));
app.use("/api/notes", authMiddleware, createNotesRoutes({ db }));
app.use("/api/user", authMiddleware, createUserRoutes({ db }));

app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend", "index.html"));
});

if (!hasHttpsCertificates) {
  console.warn(`HTTPS certificates not found. Starting with HTTP at ${defaultBaseUrl}.`);
  const server = app.listen(PORT, () => {
    console.log(`Server ready at ${defaultBaseUrl}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Close the existing server or change PORT in .env.`);
      return;
    }

    console.error(error);
  });
} else {
  const server = https.createServer(
    {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    app
  );

  server.listen(PORT, () => {
    console.log(`Server ready at ${defaultBaseUrl}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Close the existing server or change PORT in .env.`);
      return;
    }

    console.error(error);
  });
}

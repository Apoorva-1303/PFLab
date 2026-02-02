import express from "express";
import cors from "cors";
import type { Express } from "express";
import authRoutes from "./routes/auth.js";
import vaultRoutes from "./routes/vaults.js";
import credentialRoutes from "./routes/credentials.js";
import documentRoutes from "./routes/documents.js";

const app: Express = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  exposedHeaders: ['Content-Disposition', 'Content-Type', 'Content-Length']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vaults', vaultRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/documents', documentRoutes);

app.get("/", (req, res) => {
  res.send("Backend OK");
});

app.get("/api/testing", (req, res) => {
  const data = {
    "hello": "hi"
  };
  res.status(200).json(data);
});

export { app };


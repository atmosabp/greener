import express from 'express';

import { router } from "./modules";

export const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(String(origin))) {
    res.setHeader('Access-Control-Allow-Origin', String(origin));
    res.setHeader('Vary', 'Origin');
  }
  next();
});

// localhost:3000/health
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", router);

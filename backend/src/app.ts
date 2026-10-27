import express from 'express';

import { router } from "./modules";

export const app = express();
app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// localhost:3000/health
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", router);

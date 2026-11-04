import express from 'express';

import { router } from "./modules";

export const app = express();
app.use(express.json());

// localhost:3000/health
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", router);

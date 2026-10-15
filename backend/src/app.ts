import express from 'express';
import dotenv from 'dotenv';

const path = require("path");

const router = require("./modules")

const app = express();
app.use(express.json());

dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, "..", ".env")
});

app.use("/", router);

// localhost:3000/health
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});


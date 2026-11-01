import express from 'express';

import cors from "cors";

import { router } from "./modules";

export const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://localhost:5173',
  'http://localhost:8080'
];

app.use(cors({
  origin: function (origin, callback) {
    // permite requisições sem origem (terminal) ou as que estão na lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Caminho bloqueado pelo CORS.'));
    }
  },
  credentials: true
}));

// localhost:3000/health
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", router);

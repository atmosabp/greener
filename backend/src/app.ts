
import express from "express";
import cors from "cors";

import { router } from "./modules";

const FRONT_PORT = Number(process.env.FRONT_PORT ?? 8080);

export const app = express();

const allowedOrigins = [
  `http://localhost:${FRONT_PORT}`,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origem ou origens autorizadas
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origem não permitida pelo CORS."));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// localhost:3000/health
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", router);

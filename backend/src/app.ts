import express from "express";
import cors from "cors";
import { router } from "./modules";

const FRONT_PORT = Number(process.env.FRONT_PORT ?? 3000);

export const app = express();

app.use(cors({
    origin: `http://localhost:${FRONT_PORT}`
}));

app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/", router);
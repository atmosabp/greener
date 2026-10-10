import express from 'express';
import dotenv from 'dotenv';
const path = require("path");

const app = express();

dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, "..", ".env")
});

const PORT = Number(process.env.PORT ?? 3000);

app.get("/", (_req, res) => {
    res.send('<h1>Servidor funcionando!</h1>');
});

// localhost:3000/health
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// localhost:3000/sobre
app.get("/sobre", (_req, res) => {
  res.send('<h3>Esta é a página Sobre.</h3>');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});

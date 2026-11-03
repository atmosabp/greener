import { app } from "./app";
import { historyWorker } from "./worker/worker";
const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
    historyWorker()
});

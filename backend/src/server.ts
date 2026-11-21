import { createApp } from "./app";
import { pool } from "./db/connections";
import { PgCollectionsRepository } from "./modules/collections/collections.repository";
import { historyWorker } from "./worker/worker";
import { runInsert } from "./db/insert";

const PORT = Number(process.env.PORT ?? 3000);

// Cria a aplicação recebendo a conexão com o banco.
const app = createApp(pool);

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
    
    // Adiciona o admin no banco de dados e o worker quando a aplicação inicia
    runInsert(pool);
    historyWorker(new PgCollectionsRepository(pool))
});
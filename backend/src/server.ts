import { app } from "./app";
import { runInsert } from "./db/insert";
const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});

// Adiciona o admin no banco de dados quando a aplicação inicia
runInsert();

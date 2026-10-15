const app = require("./app");
const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});

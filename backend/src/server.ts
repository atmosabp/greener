import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();

// Define a porta onde o servidor vai rodar
const PORT = process.env.PORT;

// Configura uma rota principal (página inicial do site)
app.get('/', (req, res) => {
    res.send('<h1>Servidor funcionando</h1>');
});

// Configura outra rota de exemplo (ex: localhost:3000/sobre)
app.get('/sobre', (req, res) => {
    res.send('<h3>Esta é a página Sobre do meu site.</h3>');
});

// Inicializa o servidor para "escutar" os acessos na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});

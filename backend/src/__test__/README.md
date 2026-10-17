## Testes do Servidor e Banco de dados  
Este diretório possui o arquivo `index.test.ts`, que contém todos os testes de implementação do projeto.  
Os testes contidos aqui servem para garantir sempre que as rotas entre o servidor e o banco de dados da aplicação estejam funcionando corretamente. Para isso, são feitas comparações entre os dados esperados e os dados reais: caso os dois sejam compatíveis, o teste é aceito, caso não, o teste mostra falha.  
Realizar testes previne que erros passem despercebidos no meio de todas as alterações realizadas no código, que não sejam testadas manualmente.

<br>

### Como realizar os testes
Para realizar os testes, sem depender da automatização no GitHub, é necessário ter o Docker Compose rodando, pois os testes fazem interações com o banco de dados que está contido dentro dos containers Docker.  
Aqui está o passo a passo de como realizar os testes:  

1. Inicie o projeto pelo Docker, digitando o seguinte comando no terminal WSL, na raiz do projeto: `docker compose up --build -d`.
2. Nesse mesmo terminal WSL, digite o comando `docker compose exec backend npm install`. Ele serve para instalar as dependências de testes (Jest e Supertest) dentro do próprio container, por garantia de já não ter instalado anteriormente.
3. Após as dependências terem sido instaladas, para *realmente* realizar os testes, digite no terminal: `docker compose exec backend npm test`. Isso rodará os testes, e indicará o que está funcionando corretamente ou não.  

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>

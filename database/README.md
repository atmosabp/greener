## Database

Esse documento tem como objetivo descrever os arquivos `schema.sql` e `Dockerfile` presentes nesse diretório.
Você também pode acessá-los por esses links: [Dockerfile](https://github.com/atmosabp/greener/tree/develop/database/Dockerfile), [Schema.sql](https://github.com/atmosabp/greener/tree/develop/database/schema.sql).

---

### Dockerfile

Será usado junto ao `compose.yaml` que está na raiz do projeto para inicializar o banco quando subir a imagem.

#### Explicação das instruções do Dockerfile:

`FROM postgres:17-alpine`: usa a imagem oficial do PostgreSQL 17, na versão alpine, que é mais leve;  

`COPY schema.sql /docker-entrypoint-initdb.d/01-schema.sql`: copia o `schema.sql` para a pasta que o PostgreSQL executa automaticamente na primeira vez que o banco é criado, e o prefixo `01-` define a ordem de execução dos scripts.  

---

### Schema.sql

Implementa a modelagem lógica do banco.

#### Como está a estrutura de tabelas do arquivo `schema.sql`?

**Tabela Usuário:**

A tabela usuário serve para guardar quais são os usuários cadastrados no site, ela está estruturada da seguinte forma:

 - **id:** serial e primary key;
 - **name:** varchar(100);
 - **email:** varchar(150);
 - **password:** varchar(255);
 - **is_adm:** boolean.

<br>

**Exemplo de visualização:**

<table>
  <caption><strong>Users</strong></caption>
  <thead>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>email</th>
      <th>password</th>
      <th>is_adm</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>'Nome Fictício'</td>
      <td>'fictício@email.com'</td>
      <td>'123456'</td>
      <td>true</td>      
    </tr>
    <tr>
      <td>2</td>
      <td>'Segundo Nome Fictício'</td>
      <td>'fictício.2@email.com'</td>
      <td>'abcdef'</td>     
      <td>false</td>
    </tr>
  </tbody>
</table>

<br>


**Tabela Services:**

A tabela services serve para guardar quais são os serviços que já foram salvos através de requisições nas API auxiliares, ela está estruturada da seguinte forma:

 - **id:** varchar(100) e primary key;
 - **name:** varchar(100);
 - **max_emitted:** float;
 - **min_emitted:** float;

<br>

**Exemplo de visualização:**

<table>
  <caption><strong>services</strong></caption>
  <thead>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>max_emitted</th>
      <th>min_emitted</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>'Nome do Serviço'</td>
      <td>34.2</td>
      <td>2.8</td>   
    </tr>
    <tr>
      <td>2</td>
      <td>'Nome do Segundo Serviço'</td>
      <td>4.1</td>
      <td>0.3</td>
    </tr>
  </tbody>
</table>

<br>

**Tabelas:**

As tabelas minute_data, hour_data, day_data e month_data servem para guardar as métricas brutas de cada serviço. Começa-se com a tabela minute_data e quando atinge uma hora (60 minutos) de dados guardados nessa tabela é feita uma média desses dados e esse valor passa para a tabela hour_data, quando completar um dia a mesma coisa é feita, porém para a tabela day_data, e assim por diante. Elas estão estruturadas da seguinte forma:

 - **id:** serial e primary key;
 - **co2e:** float;
 - **kwh:** float;
 - **date_pull:** timestamp with time zone default current_timestamp;
 - **cpu_percentage:** float;
 - **memory_gb:** float;
 - **disk_gb:** float;
 - **network_gb:** float;
 - **renewable_percent:** integer;
 - **service_id:** varchar(100) e foreign key;

<br>

**Exemplo de visualização (Valores numéricos fictícios):**

<table>
  <caption><strong>minute_data / hour_data / day_data / month_data</strong></caption>
  <thead>
    <tr>
      <th>id</th>
      <th>co2e</th>
      <th>kwh</th>
      <th>date_pull</th>
      <th>cpu_percentage</th>
      <th>memory_gb</th>
      <th>disk_gb</th>
      <th>network_gb</th>
      <th>renewable_percent</th>
      <th>service_id</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>36.3</td>
      <td>6.42</td>
      <td>2026-12-02 12:50:00.213546-03</td>   
      <td>5.78</td>   
      <td>25.61</td>   
      <td>10.8</td>   
      <td>8.4</td>   
      <td>5</td>
      <td>"billing-api"</td>   
    </tr>
    <tr>
      <td>2</td>
      <td>30.5</td>
      <td>12.34</td>
      <td>2026-11-01 12:46:00.123456-03</td>   
      <td>11.10</td>   
      <td>32.13</td>   
      <td>20.4</td>   
      <td>5.9</td>   
      <td>2</td>   
      <td>"checkout-worker"</td> 
    </tr>
  </tbody>
</table>

<br>

**Origem dos dados:** Greener Metrics Aggregator API e Greener Carbon Intensity API

---



### Indexação

Os índices são mantidos internamente pelo banco e servem para evitar que ele precise ler uma enorme quantidade de dados repetidamente. Em vez de ler a tabela inteira, ele apenas consulta o índice e lê a respectiva linha na tabela indicada. Eles estão estruturados da seguinte forma:

 - **nome:** `idx_<tabela>_services_dt`;
 - **tabela:** minute_data, hour_data, day_data ou month_data (um índice para cada uma);
 - **colunas:** service_id, date_pull;
 - **tipo:** composto (B-tree).

<br>

**Por que service_id e date_pull, nessa ordem?**

A ordem das colunas importa. O `service_id` vem primeiro porque é filtrado por igualdade (queremos um serviço específico), o que já reduz muito a busca. O `date_pull` vem depois porque é filtrado por intervalo ou usado para ordenar, e dentro de cada serviço as datas já ficam em ordem. Por isso, consultas que filtram só por `date_pull`, sem informar o `service_id`, não aproveitam bem esses índices.

<br>

**Observação:**

Índices ocupam espaço em disco e deixam as escritas um pouco mais lentas, já que o banco precisa atualizá-los a cada insert. Nesse caso o custo compensa, porque as métricas são gravadas de forma simples e periódica, mas lidas com muita frequência por serviço e período.


---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>

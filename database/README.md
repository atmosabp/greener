## Database

Esse documento tem como objetivo descrever os arquivos `schema.sql`e `Dockerfile` presentes nesse diretório.
Você também pode acessá-los por esses links: [Dockerfile](https://github.com/atmosabp/greener/tree/develop/database/Dockerfile), [Schema.sql](https://github.com/atmosabp/greener/tree/develop/database/schema.sql).

---

### Dockerfile

Será usado junto ao `compose.yaml` que está na raíz do projeto para inicializar o banco quando subir a imagem.

---

### Schema.sql

Implementa a modelagem lógica do banco.

<br>

#### Como está a estrutura de tabelas do arquivo `schema.sql`?

**Tabela Usuário:**

A tabela usuário serve para guardar quais são os usuários cadastrados no site,ela está estruturada da seguinte forma:

 - **id:** serial e primary key;
 - **name:** varchar(100);
 - **email:** varchar(150);
 - **password:** varchar(255);
 - **is_adm:** boolean.

<br>

**Exemplo de vizualização:**

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
 - **min_emitted** float;

<br>

**Exemplo de vizualização:**

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

As tabelas minute_data, hour_data, month_data, serve para guardar as métricas brutas de cada serviço. Começa-se com a tabela minute_data e quando atinge uma hora (60 minutos) de dados guardados nessa tabela é feita uma média desses dados e esse valor passa para a tabela hora, quando completar um dia a mesma coisa é feita, porém para a tabela day_data, e assim por diante. Elas estão estruturadas da seguinte forma:

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

 Colocar as chaves estrangeiras. e definir os valores

<br>

**Exemplo de vizualização:**

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
      <td>2026-12-02 12:50:00.213546-05</td>   
      <td>5.78</td>   
      <td>25.61</td>   
      <td>10.8</td>   
      <td>8</td>   
      <td>5.4</td>
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
      <td>5</td>   
      <td>"checkout-worker"</td> 
    </tr>
  </tbody>
</table>

<br>

**Origem dos dados:** Greener Metrics Aggregator API e Greener Carbon Intensity API

---

### Intensidade de Carbono equivalente(CO2e)

Determina a estimativa de carbono emitido pelo serviço.

<br>

### Indexação

Os índices servem para deixar as consultas nas tabelas de métricas mais rápidas. Funcionam como o índice remissivo de um livro: em vez de o banco ler a tabela inteira para achar os dados de um serviço, ele consulta o índice e vai direto às linhas certas.

<br>

#### Por que usar índices nesse projeto?

As tabelas minute_data, hour_data e month_data só crescem, pois a cada coleta entram novas linhas de todos os serviços. Já as consultas do sistema (dashboard, histórico e ranking) quase sempre pedem a mesma coisa: as métricas de um serviço dentro de um período.

Sem índice, o banco precisa ler a tabela inteira, com dados de todos os serviços e de todas as datas, para devolver só uma parte. Isso fica mais lento a cada registro novo. No PostgreSQL, a chave estrangeira `service_id` não cria índice automaticamente, por isso eles são criados de forma explícita no arquivo `schema.sql`.

<br>

**Índices criados:**

Todos os índices são compostos, ou seja, cobrem duas colunas ao mesmo tempo, e estão estruturados da seguinte forma:

 - **idx_minute_data_services_dt:** tabela minute_data, colunas (service_id, date_pull);
 - **idx_hour_data_services_dt:** tabela hour_data, colunas (service_id, date_pull);
 - **idx_month_data_services_dt:** tabela month_data, colunas (service_id, date_pull).

<br>

**Exemplo de visualização:**

<table>
  <caption><strong>Índices</strong></caption>
  <thead>
    <tr>
      <th>índice</th>
      <th>tabela</th>
      <th>colunas</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>idx_minute_data_services_dt</td>
      <td>minute_data</td>
      <td>service_id, date_pull</td>
    </tr>
    <tr>
      <td>idx_hour_data_services_dt</td>
      <td>hour_data</td>
      <td>service_id, date_pull</td>
    </tr>
    <tr>
      <td>idx_day_data_services_dt</td>
      <td>day_data</td>
      <td>service_id, date_pull</td>
    </tr>
    <tr>
      <td>idx_month_data_services_dt</td>
      <td>month_data</td>
      <td>service_id, date_pull</td>
    </tr>
  </tbody>
</table>

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

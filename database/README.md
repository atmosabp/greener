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

#### Como [...] arquivo `schema.sql`?

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
  <caption><strong>Users</strong></caption>
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

 - **id:** varchar(100) e primary key;
 - **co2e:** varchar(100);
 - **kwh:** varchar(100);
 - **date_pull:** float;
 - **cpu_percentage:** float;
 - **memory_gb:** float;
 - **disk_gb:** float;
 - **network_gb:** float;
 - **renewable_percent:** float;
 - **service_id:** float;

 Colocar as chaves estrangeiras. e definir os valores

<br>

**Exemplo de vizualização:**

<table>
  <caption><strong>Users</strong></caption>
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

**Origem dos dados:** Greener Metrics Aggregator API e cálculo de potência

---

### Intensidade de Carbono equivalente(CO2e)

Determina a estimativa de carbono emitido pelo serviço.

<br>

**Fórmula:** `Energia (KWh) × Intensidade de Carbono (gCO₂e/kWh)`

**Origem dos dados:** Cálculo de energia e Greener Carbon Intensity API

---

### Intensidade de Carbono

Determina a intensidade de carbono no momento da coleta de dados.

<br>

**Fórmula:** `Intensidade de Carbono equivalente(CO2e) / Energia (KWh)`

**Origem dos dados:** Cálculo de energia e Cálculo de Intensidade de Carbono equivalente

---

### Emissão total

Determina a quantidade emitida de carbono em certo período de tempo.

<br>

**Fórmula:** `Intensidade de Carbono equivalente(CO2e) * tempo em horas`

**Origem dos dados:** Cálculo de Intensidade de Carbono equivalente e usuário

---

### Intervalo de coleta de dados

Determina o Intervalo que os dados foram coletados na requisição da API.

<br>

**Fórmula:** `Energia (KWh) * 1000 / Potência Estimada (W)`

**Origem dos dados:** Cálculo de energia e Cálculo de potência

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>

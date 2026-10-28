## Schema SQL
Esse documento tem como objetivo descrever os arquivo `schema.sql`e `Dockerfile` presentes nesse diretório.    
Você também pode acessá-los por esses links: [Dockerfile](https://github.com/atmosabp/greener/tree/develop/database/Dockerfile), [Schema.sql](https://github.com/atmosabp/greener/tree/develop/database/schema.sql).

<br>

### Potência estimada (W) 
Será usado para determinar a estimativa de energia gasta pelo serviço.

<br>

**Fórmula:** `Potência CPU +
Potência Memória +
Potência Disco +
Potência Rede`

**Origem dos dados:** Greener Metrics Aggregator API
 
---

### Estimativa de energia(KWh)  
Determina a estimativa de energia gasta pelo serviço.

<br>

**Fórmula:** `Potência Estimada (W) × Tempo de Coleta (h) / 1000`

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

**Origem dos dados:**  Cálculo de energia e Cálculo de potência

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>

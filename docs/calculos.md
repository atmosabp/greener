## Cálculos
Esse documento tem como objetivo descrever os cálculos realizados pelo servidor da aplicação com as métricas vindas das APIs do GreenER.  
Todos os cálculos descritos abaixo são feitos pela classe `MetricsCalculator`, no arquivo [`backend/src/modules/metrics-calculator.ts`](https://github.com/atmosabp/greener/tree/develop/backend/src/modules), usando os dados obtidos pelos arquivos do diretório [`backend/src/integrations/`](https://github.com/atmosabp/greener/tree/develop/backend/src/integrations).  

Os cálculos de potência, energia e CO₂e são executados a cada coleta de métricas: tanto quando o frontend consulta os serviços (`/collections/all-service-data` e `/collections/service-metrics/:serviceId`) quanto quando o worker grava o histórico (`/collections/add-history`).

| Método da classe | Cálculo |
| ---------------- | ------- |
| `calculateKWh()` | Estimativa de energia (kWh) |
| `calculateCO2e()` | Intensidade de carbono equivalente (CO₂e) |
| `calculateIntensity()` | Intensidade de carbono |
| `calculateTotalEmission(horas)` | Emissão total |
| `calculateTotalUsage(horas)` | Consumo total de energia |
| `calculateInterval()` | Intervalo de coleta de dados |

<br>

### Potência estimada (W) 
Será usado para determinar a estimativa de energia gasta pelo serviço.

<br>

**Fórmula:** `Potência CPU +
Potência Memória +
Potência Disco +
Potência Rede`

**Origem dos dados:** Greener Metrics Aggregator API

*Obs:* No código, a potência é a soma direta dos valores de `cpu_percent`, `memory_gb`, `disk_gb` e `network_gb` devolvidos pela API. O cálculo só é feito se pelo menos uma dessas métricas estiver disponível.
 
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

*Obs:* A intensidade de carbono (gCO₂e/kWh) depende da região do serviço. O backend descobre o `region_code` do serviço (ex.: `br-sudeste`) e consulta a API de carbono para essa região.

---

### Intensidade de Carbono
Determina a intensidade de carbono no momento da coleta de dados.  

<br>

**Fórmula:** `Intensidade de Carbono equivalente(CO2e) / Energia (KWh)`

**Origem dos dados:** Cálculo de energia e Cálculo de Intensidade de Carbono equivalente

---
### Consumo total de energia
Determina a quantidade de energia (kWh) gasta em certo período de tempo.

<br>

**Fórmula:** `Energia (KWh) * tempo em horas`

**Origem dos dados:** Cálculo de energia e usuário

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

---

### Porcentagem de energia renovável
Indica quanto da energia da região do serviço vem de fontes renováveis. Esse valor **não é calculado** pelo servidor: ele é lido diretamente da Greener Carbon Intensity API (`renewable_share_percent`) e gravado no histórico no campo `renewable_percent`.

**Origem dos dados:** Greener Carbon Intensity API

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>

## Cálculos

### Potência estimada (W) 
**Fórmula:** Potência CPU +
Potência Memória +
Potência Disco +
Potência Rede

**Origem dos dados:** Greener Metrics Aggregator API

**Função:** Será usado para determinar a estimativa de energia gasta pelo serviço
 
---

### Estimativa de energia(KWh)  
**Fórmula:** Potência Estimada (W) × Tempo de Coleta (h) / 1000

**Origem dos dados:** Greener Metrics Aggregator API e cálculo de potência

**Função:** Determina a estimativa de energia gasta pelo serviço

---

### Intensidade de Carbono equivalente(CO2e) 
**Fórmula:** Energia (KWh) × Intensidade de Carbono (gCO₂e/kWh)

**Origem dos dados:** Cálculo de energia e Greener Carbon Intensity API 

**Função:** Determina a estimativa de carbono emitido pelo serviço

---

### Intensidade de Carbono
**Fórmula:** Intensidade de Carbono equivalente(CO2e) / Energia (KWh)

**Origem dos dados:** Cálculo de energia e Cálculo de Intensidade de Carbono equivalente

**Função:** Determina a intensidade de carbono no momento da coleta de dados

---
### Emissão total 
**Fórmula:** Intensidade de Carbono equivalente(CO2e) * tempo em horas 

**Origem dos dados:** Cálculo de Intensidade de Carbono equivalente e usúario

**Função:** Determina a quantidade emitida de carbono em certo período de tempo

---
### Intervalo de coleta de dados 
**Fórmula:** Energia (KWh) * 1000 / Potência Estimada (W)

**Origem dos dados:**  Cálculo de energia e Cálculo de potência

**Função:** Determina o Intervalo que os dados foram coletados na requisição da API


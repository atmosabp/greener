## Instruções para as APIs auxiliares
Esse documento tem como objetivo orientar os desenvolvedores no uso das duas APIs auxiliares que foram disponibilizadas pelo cliente e fornecerão os dados necessarios para o funcionamento da aplicação.<br>

A documentação de ambas as APIs estão disponibilizadas nos seguintes links:
- [Greener Metrics Aggregator API](https://metrics.unilaunch.org/docs#/Servicos/getServiceMetrics)
- [Greener Carbon Intensity API](https://carbon.unilaunch.org/docs#/Regioes/getCarbonRegion)

### Greener Metrics Aggregator API
Essa API disponibiliza a localização geografica e o consumo elétrico de cada serviço rastreado pela empresa.
A seguir, estão listados as rotas dessa API.
#### **/services**
Esta rota tem como objetivo listar todos serviços disponiveis no momento da requisição.  
**Link:**  [https://metrics.unilaunch.org/services](https://metrics.unilaunch.org/services)
- **Como usar:** Basta usar o comando fetch e a API retornará o array de serviços disponíveis. Exemplo de uso: `await fetch("https://metrics.unilaunch.org/services")`
- **Resultado esperado:**  Um array de objetos seguindo esse formato: <br>
```
{
    "id": "billing-api",
    "name": "Billing API",
    "location": {
      "region_code": "br-sudeste",
      "country": "Brazil",
      "region": "Sudeste",
      "city": "Sao Paulo",
      "latitude": -23.5505,
      "longitude": -46.6333 },
    "metrics_path": "/metrics/billing-api"
  }, [...]
```
- **Endpoints responsáveis:** `/collections/service-metrics` e `/collections/all-service-data`
#### **/services/{id}**
Esta rota tem como objetivo pegar os dados geológicos e disponibilidade de apenas um serviço específico.  
**Link:**  [https://metrics.unilaunch.org/services/{id}](https://metrics.unilaunch.org/services/{id})
- **Como usar:** Basta descobrir o id do serviço requisitado e substituir a parte do {id} pela variável em um fetch.<br>
Ex: `/services/billing-api`
- **Resultado esperado:** Um objeto seguindo esse formato: <br>
```
{
    "id": "billing-api", 
    "name": "Billing API", 
    "location": { 
      "region_code": "br-sudeste", 
      "country": "Brazil", 
      "region": "Sudeste", 
      "city": "Sao Paulo", 
      "latitude": -23.5505, 
      "longitude": -46.6333 }, 
    "metrics_path": "/metrics/billing-api"
  }
  ```
- **Endpoints responsáveis:** `/collections/service-metrics`

#### **/metrics/{service_id}**
Essa rota tem como objetivo pegar as métricas de consumo energético de um serviço com base no id.  
**Link:**  [https://metrics.unilaunch.org/metrics/{service_id}](https://metrics.unilaunch.org/metrics/{service_id})
- **Como usar:** Basta descobrir o id do serviço requisitado e substituir a parte do {service_id} pela variável em um fetch.<br>
Ex: `/metrics/billing-api`
- **Resultado esperado:** Um objeto seguindo esse formato: <br>
```
{
  "collection_interval_seconds": 27,
  "metrics": {
    "cpu_percent": 62.67,
    "memory_gb": 3.17,
    "disk_gb": 19.26,
    "network_gb": 0.45
    }
}
```
- **Endpoints responsáveis:** `/collections/service-metrics`, `/collections/all-service-data` e `/collections/add-history`

### Greener Carbon Intensity API
Essa API disponibiliza os dados sobre a intensidade de carbono e energia renovável baseada em regiões do mundo
#### **/regions**
Esta rota tem como objetivo listar a quantidade e as regiões disponíveis.  
**Link:** [https://carbon.unilaunch.org/regions](https://carbon.unilaunch.org/regions)
- **Como usar:** Basta usar fetch e a API retornará o array de regiões disponíveis.
- **Resultado esperado:** Um objeto contendo um array de objetos seguindo esse formato: <br>
```
{
      "code": "br-sudeste",
      "country": "Brazil",
      "region": "Sudeste",
      "city": "Sao Paulo",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "carbon_intensity_gco2e_per_kwh": 85,
      "renewable_share_percent": 83
      }, [...]
```
e um atributo total com o número de regiões do array

- **Endpoints responsáveis:** Nenhum até o momento.

#### **/regions/{code}**
Esta rota tem como objetivo listar somente as métricas de uma região referente ao código.  
**Link:** [https://carbon.unilaunch.org/regions/{code}](https://carbon.unilaunch.org/regions/{code})
- **Como usar:** Basta descobrir o code da região requisitada e substituir a parte do {code} pela variável em um fetch.<br>
Ex: `/regions/br-sudeste`
- **Resultado esperado:** Um objeto seguindo esse formato:<br>
```
{
      "code": "br-sudeste",
      "country": "Brazil",
      "region": "Sudeste",
      "city": "Sao Paulo",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "carbon_intensity_gco2e_per_kwh": 85,
      "renewable_share_percent": 83
      }
```

- **Endpoints responsáveis:** Nenhum até o momento.

#### **/regions/{code}/carbon-intensity e /carbon-intensity/{code}**
Esta rota tem como objetivo reduzir o tamanho do objeto da última rota, retirando as métricas de longitude e latitude.  
**Link:** [https://carbon.unilaunch.org/regions/{code}/carbon-intensity](https://carbon.unilaunch.org/regions/{code}/carbon-intensity) e [https://carbon.unilaunch.org/carbon-intensity/{code}](https://carbon.unilaunch.org/carbon-intensity/{code})
- **Como usar:** Basta descobrir o code da região requisitada e substituir a parte do {code} pela variável em um fetch. <br>
Ex: `/regions/br-sudeste/carbon-intensity, /carbon-intensity/br-sudeste`
- **Resultado esperado:** Um objeto seguindo esse formato:<br>
```
{
  "region_code": "br-sudeste",
  "country": "Brazil",
  "region": "Sudeste",
  "city": "Sao Paulo",
  "carbon_intensity_gco2e_per_kwh": 85,
  "renewable_share_percent": 83
  }
```
- **Endpoints responsáveis:** `/collections/add-history`

<br>

---

<br>

<div align="center">
    <i> Desenvolvido por Atmos <br>2026</i>
</div>

## APIs auxiliares
Esse documento tem como objetivo orientar os desenvolvedores no uso das duas APIs auxiliares que foram disponibilizadas pelo cliente e fornecerão os dados necessarios para o funcionamento da aplicação.<br>
A documentação de ambas as APIs estão disponibilizadas nos seguintes links:
- [Greener Metrics Aggregator API](https://metrics.unilaunch.org/docs#/Servicos/getServiceMetrics)
- [Greener Carbon Intensity API](https://carbon.unilaunch.org/docs#/Regioes/getCarbonRegion)

### Greener Metrics Aggregator API
Essa API disponibiliza a localização geografica e o consumo elétrico de cada serviço rastreado pela empresa
#### **/services**
Esta rota tem como objetivo listar todos serviços disponiveis no momento da requisição
- **URL:**  [https://metrics.unilaunch.org/services](https://metrics.unilaunch.org/services)
- **Como usar:** Basta usar fetch e a API retornará o array de serviços disponíveis.
- **Resultado esperado:**  Um array de objetos seguindo esse formato: <br>
{
    "id": "billing-api", <br>
    "name": "Billing API", <br>
    "location": { <br>
      "region_code": "br-sudeste", <br>
      "country": "Brazil", <br>
      "region": "Sudeste", <br>
      "city": "Sao Paulo",  <br>
      "latitude": -23.5505,  <br>
      "longitude": -46.6333 }, <br>
    "metrics_path": "/metrics/billing-api"
  },
- **Endpoints responsáveis:**
#### **/services/{id}**
Esta rota tem como objetivo pegar os dados geológicos e disponibilidade de apenas um serviço específico.

- **URL:**  [https://metrics.unilaunch.org/services/{id}](https://metrics.unilaunch.org/services/{id})
- **Como usar:** Basta descobrir o id do serviço requisitado e substituir a parte do {id} pela variável em um fetch.<br>
Ex: /services/billing-api
- **Resultado esperado:** Um objeto seguindo esse formato: <br>
{
    "id": "billing-api", <br>
    "name": "Billing API", <br>
    "location": { <br>
      "region_code": "br-sudeste", <br>
      "country": "Brazil", <br>
      "region": "Sudeste", <br>
      "city": "Sao Paulo",  <br>
      "latitude": -23.5505,  <br>
      "longitude": -46.6333 }, <br>
    "metrics_path": "/metrics/billing-api"
  },
- **Endpoints responsáveis:**
#### **/metrics/{service_id}**
Essa rota tem como objetivo pegar as métricas de consumo energético de um serviço com base no id
- **URL:**  [https://metrics.unilaunch.org/metrics/{service_id}](https://metrics.unilaunch.org/metrics/{service_id})
- **Como usar:** Basta descobrir o id do serviço requisitado e substituir a parte do {service_id} pela variável em um fetch.<br>
Ex: /metrics/billing-api
- **Resultado esperado:** Um objeto seguindo esse formato: <br>{
  "collection_interval_seconds": 27,<br>
  "metrics": {<br>
    "cpu_percent": 62.67,<br>
    "memory_gb": 3.17,<br>
    "disk_gb": 19.26,<br>
    "network_gb": 0.45}<br>
}
- **Endpoints responsáveis:**

### Greener Carbon Intensity API
Essa API disponibiliza os dados sobre a intensidade de carbono e energia renovável baseada em regiões do mundo
#### **/regions**
Esta rota tem como objetivo listar a quantidade e as regiões disponíveis.  
- **URL:** [https://carbon.unilaunch.org/regions](https://carbon.unilaunch.org/regions)
- **Como usar:** Basta usar fetch e a API retornará o array de regiões disponíveis.
- **Resultado esperado:** Um objeto contendo um array de objetos seguindo esse formato: <br>
{
      "code": "br-sudeste",<br>
      "country": "Brazil",<br>
      "region": "Sudeste",<br>
      "city": "Sao Paulo",<br>
      "latitude": -23.5505,<br>
      "longitude": -46.6333,<br>
      "carbon_intensity_gco2e_per_kwh": 85,<br>
      "renewable_share_percent": 83},<br>
      e um atributo total com o número de regiões do array
- **Endpoints responsáveis:**
#### **/regions/{code}**
Esta rota tem como objetivo listar somente as métricas de uma região referente ao código.
- **URL:** [https://carbon.unilaunch.org/regions/{code}](https://carbon.unilaunch.org/regions/{code})
- **Como usar:** Basta descobrir o code da região requisitada e substituir a parte do {code} pela variável em um fetch.<br>
Ex: 
- **Resultado esperado:** Um objeto seguindo esse formato:<br>
{
      "code": "br-sudeste",<br>
      "country": "Brazil",<br>
      "region": "Sudeste",<br>
      "city": "Sao Paulo",<br>
      "latitude": -23.5505,<br>
      "longitude": -46.6333,<br>
      "carbon_intensity_gco2e_per_kwh": 85,<br>
      "renewable_share_percent": 83},<br>

- **Endpoints responsáveis:**
#### **/regions/{code}/carbon-intensity e /carbon-intensity/{code}**
Esta rota tem como objetivo reduzir o tamanho do objeto da última rota, retirando as métricas de longitude e latitude.
- **URL:** [https://carbon.unilaunch.org/regions/{code}/carbon-intensity](https://carbon.unilaunch.org/regions/{code}/carbon-intensity)
- **Como usar:** Basta descobrir o code da região requisitada e substituir a parte do {code} pela variável em um fetch. <br>
Ex: /regions/br-sudeste/carbon-intensity, /carbon-intensity/br-sudeste
- **Resultado esperado:** Um objeto seguindo esse formato:<br>
{
  "region_code": "br-sudeste",<br>
  "country": "Brazil",<br>
  "region": "Sudeste",<br>
  "city": "Sao Paulo",<br>
  "carbon_intensity_gco2e_per_kwh": 85,<br>
  "renewable_share_percent": 83}<br>
- **Endpoints responsáveis:**

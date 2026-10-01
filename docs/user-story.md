| ID | Descrição | User Story |
| RF01 | O sistema deve consultar o Agregador de Métricas para identificar os serviços disponíveis. | Como usuário quero poder ver quais serviços estão disponíveis, para que eu possa identificar serviços disponíveis e suas informações. |
| RF02 | O sistema deve reconhecer a inclusão, remoção, indisponibilidade e retorno de serviços durante
sua execução, atualizando as informações apresentadas ao usuário. |  Como usuário quero que meu sistema tenha uma atualização dinâmica e inclua novos serviços, remova os que forem descontinuados e os quais estão com indisponibilidades e me atualize sobres essas mudanças, para que eu saiba quais deles terei acesso e poderei consultar suas métricas sem reiniciar a aplicação. |
| RF03 | O sistema deve consultar periodicamente o endpoint /metrics/{id_servico} para cada serviço
disponível. | Como usuário quero que meu sistema sempre consulte o endpoint (metrics/{id_serviço}) de cada serviço, para que minha aplicação sempre consiga obter dados brutos de consumo. |
| RF4 | O sistema deve considerar que os valores retornados pela API podem mudar a cada requisição. | Como usuário quero que meu sistema possa tratar cada resposta da API de métricas de forma independente, para que seja garantido o registro de forma correta das variações de valores das diferentes requisições. |
| RF5 | O sistema deve identificar e sinalizar quando um serviço monitorado não responder à consulta ou
estiver indisponível. | Como usuário quero que minha aplicação identifique os serviços estão indisponíveis e apresente essa informação para mim, para que eu possa saber quais serviços eu não porei consultar. |
| RF6 | O sistema deve identificar quando um serviço estiver ativo, mas deixar de exportar métricas. Ou
seja, está listado em /services mas não está enviando métricas. | Como usuário quero que minha aplicação analise as condições da interceptação das métricas e me informe se houver falha na exportação de alguma métrica, para que eu possa saber que houve algum erro na captura daquela informação. |
| RF7 | O sistema deve calcular consumo energético e emissão de CO₂e para cada serviço monitorado. | Como usuário quero que meu sistema calcule a emissão de CO2e e o consumo energético  para cada serviço listado, para que assim possa ter ciência das métricas e impactos dessas emissões de serviços do meu interesse. |
| RF8 | O sistema deve calcular indicadores consolidados, como consumo total, emissão total, serviços
ativos e serviços indisponíveis. | Como usuário quero que meu sistema me mostre os indicadores consolidados como consumo total, emissão totais, serviços ativos e indisponíveis, para que eu possa ter um panorama gera dos impactos ambientais e das situações dos meus serviços. |
| RF9 | O sistema deve apresentar, para cada serviço, seu estado de monitoramento, localização, métricas
disponíveis, consumo energético estimado e emissão estimada de CO₂e. | Como usuário quero que meu sistema possua uma tela onde mostre detalhes e informações fundamentais de cada serviço, para que eu possa analisar e manipular as suas informações de forma rápida. |
| RF10 | O sistema deve armazenar o histórico das coletas realizadas para permitir análise temporal. |  Como usuário quero que meu sistema armazene todos os dados coletados, para que posteriormente eu possa visualizar os dados coletados anteriormente. |
| RF11 | O dashboard deve atualizar periodicamente suas informações, sem exigir que o usuário recarregue
a página. | Como usuário quero que meu sistema atualize minha dashboard continuamente e de forma automática, para que eu observe as mudanças das informações sem precisar atualizar manualmente a pagina. |
| RF12 | O sistema deve exibir país, região e, quando disponível, cidade onde o serviço está hospedado. | Como usuário quero que meu sistema apresente o pais, a região e a cidade de onde meu serviço esta hospedado, para entender as dependência geográficas. |
| RF13 | O sistema poderá apresentar em um mapa a posição aproximada dos serviços para os quais a API
fornecer latitude e longitude. A ausência dessas coordenadas não deve impedir a visualização das
demais informações do serviço | Como usuário que meu sistema me forneça a posição aproximada da altitude e a latitude através de um mapa interativo quando essas informações estiverem disponíveis, para facilitar o entendimento de onde estão vindo as métricas. |
| RF14 | O sistema deve permitir ordenar os serviços por consumo energético estimado ou por emissão
estimada de CO₂e, indicando o período considerado na comparação. | Como usuário quero que meu sistema possua uma sistema de filtro e ordenação, para que eu possa visualizar quais serviços estão degradando mais o ambiente e quais estão consumindo mais recursos. |
| RF15 | O sistema deve permitir comparar dois ou mais serviços por métricas e indicadores ambientais
referentes ao mesmo período. | Como usuário eu quero que meu sistema me permita fazer comparações entre métricas e posições de dois ou mais serviços, para que eu possa entender como cada serviço funciona e quais possuem os níveis de uma determinada métrica maior ou menor que outro. |
import type { ApiCarbon } from "../types/carbon";

const urlApi = "https://carbon.unilaunch.org/carbon-intensity/br-sudeste";

async function reqValorCarbono() {
  try {
    const resp = await fetch(urlApi);

    if (resp.ok) {
      const obj: ApiCarbon = await resp.json();

      const valorCarbono = obj.carbon_intensity_gco2e_per_kwh;
      return valorCarbono;
    }
  } catch (error: any) {
    throw new Error(
      error.message || "Não foi possivel buscar a métrica de carbono",
    );
  }
}

//Pra testar
async function inicia() {
  const valor = await reqValorCarbono();
  console.log(valor);
}

reqValorCarbono();
inicia();

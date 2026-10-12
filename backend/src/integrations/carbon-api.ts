import type { ApiCarbon, ApiErrorResponse } from "../types/carbon";

const urlApi = 'https://carbon.unilaunch.org/carbon-intensity/br-sudeste'

async function reqValorCarbono(){
    const resp = await fetch(urlApi);
    
    try{
        if(resp.status === 200){
        const obj: ApiCarbon = await resp.json();

        const valorCarbono = obj.carbon_intensity_gco2e_per_kwh;
        return valorCarbono
        }
    } catch (erro){
        const error:ApiErrorResponse = await resp.json();
        throw new Error(error.message || "Não foi possivel buscar a métrica de carbono");
    }
}

//Pra testar
async function inicia(){
    const valor = await reqValorCarbono()
    console.log(valor)
}

reqValorCarbono();
inicia();
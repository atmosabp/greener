import type {ServiceTypes, ServiceStatus} from "../types/services-types"

const serviceURL = "https://metrics.unilaunch.org/services"

async function reqServices() {
    try{
        const response = await fetch(serviceURL)

        if(response.status == 200){
            const serviceList : ServiceTypes[] = await response.json()
            var avaliableList = []
            for(let i of serviceList){
                avaliableList.push(await checkAvaliabity(i))
            }

            return avaliableList

        }
    }catch(erro){
        //const error = await response.json();
        throw new Error( "API não disponível");
    }
}

async function checkAvaliabity(service:ServiceTypes){
    try{
        console.log(service)
        const response = await fetch(serviceURL + `/${service.id}`)

        if (response.status == 200){
            service.status = "disponível"
        }

        if (response.status == 404){
            service.status = "indisponível"
        }
    }catch(erro){
        service.status = "indisponível"
    }
    finally{
        return service
    }
}




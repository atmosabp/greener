import { searchHistory, searchServiceHistory } from "./collections.service";

export async function findAllHistoryController(req: any, res: any){
    const { periodType, datePull } = req.body;

    try{
        const result = await searchHistory(periodType, datePull);
        return res.status(200).json(result);
    } catch(error: any){
        return res.status(400).json({message: error.message || "Ocorreu um erro ao buscar o histórico. Tente novamente mais tarde."});
    }
}

export async function findServiceHistoryController(req: any, res: any){
    const { periodType, datePull, serviceId } = req.body;
    
    try{
        const result = await searchServiceHistory(periodType, datePull, serviceId);
        return res.status(200).json(result);
    } catch(error: any){
        return res.status(400).json({message: error.message || "Ocorreu um erro ao buscar o histórico do serviço. Tente novamente mais tarde."});
    }
}
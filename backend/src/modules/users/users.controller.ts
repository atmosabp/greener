import { createUser } from "./users.repository";

export async function createUserController(req: any, res: any){
    const {name, email, password} = req.body;

    try{
        const result = await createUser(name, email, password);
        return res.status(201).json(result);
    } catch(error: any){
        return res.status(400).json({message: error.message || "Ocorreu um erro ao cadastrar o usuário."});
    }
}
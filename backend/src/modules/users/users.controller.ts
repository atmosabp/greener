import { searchUsers, createNewUser } from "./users.service";

export async function createUserController(req: any, res: any){
    const {name, email, password, isAdm} = req.body;

    try{
        const result = await createNewUser(name, email, password, isAdm);
        return res.status(201).json(result);
    } catch(error: any){
        return res.status(400).json({message: error.message || "Ocorreu um erro ao cadastrar o usuário."});
    }
}

export async function listUsersController(_req: any, res: any){
    try{
        const result = await searchUsers();
        console.log(result)
        return res.status(200).json(result);
    } catch(error: any){
        return res.status(400).json({message: error.message || "Ocorreu um erro ao listar os usuários."});
    }
}

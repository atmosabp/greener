import {findUsers, createUser} from "./users.repository";

export async function createNewUser(name: string, email: string, password: string, isAdm: boolean){
    const result = await createUser(name, email, password, isAdm);

    if (!result) return null;

    return result;
}

export async function searchUsers(){
    const result = await findUsers();

    if (!result) return null;

    return result;
}

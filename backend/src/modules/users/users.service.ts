import {findUsers, findUserById, createUser, updateUser} from "./users.repository";

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

export async function searchUserById(id: number){
    const result = await findUserById(id);

    if(!result) return null;

    return result;
}

export async function editUser(id: number){
    const result = await updateUser(id);

    if(!result) return null;

    return result;
}
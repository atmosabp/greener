import bcrypt from "bcrypt";
import { UserEditValues } from "../../types/user-types";
import {
    findUsers,
    findUserById,
    createUser,
    updateUser,
    deleteUserById
} from "./users.repository";

export async function createNewUser(name: string, email: string, password: string, isAdm: boolean) {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await createUser(name, email, passwordHash, isAdm);

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

export async function editUser(id: number, values: UserEditValues) {
    const updatedValues = { ...values };

    if (updatedValues.password) {
        updatedValues.password = await bcrypt.hash(updatedValues.password, 12);
    }

    const result = await updateUser(id, updatedValues);

    if (!result) return null;

    return result;
}

export async function removeUserById(id: number){
    const result = await deleteUserById(id);

    if(!result) return null;

    return result;
}

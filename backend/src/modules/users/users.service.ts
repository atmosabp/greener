import bcrypt from "bcrypt";
import { UserEditValues } from "../../types/user-types";
import type { UsersRepository } from "./users.repository";
import type { User } from "../../types/user-types";

export interface IUsersService {
    createNewUser(name: string, email: string, password: string, isAdm: boolean): Promise<User | null>;
    searchUsers(): Promise<User[] | null>;
    searchUserById(id: number): Promise<User[] | null>;
    editUser(id: number, values: UserEditValues): Promise<User | null>;
    removeUserById(id: number): Promise<{ id: number } | null>;
}

export class UsersService implements IUsersService {
    constructor(private readonly repository: UsersRepository) {}

    async createNewUser(name: string, email: string, password: string, isAdm: boolean) {
        const passwordHash = await bcrypt.hash(password, 12);

        const result = await this.repository.createUser(name, email, passwordHash, isAdm);

        if (!result) return null;

        return result;
    }

    async searchUsers() {
        const result = await this.repository.findUsers();

        if (!result) return null;

        return result;
    }

    async searchUserById(id: number) {
        const result = await this.repository.findUserById(id);

        if (!result) return null;

        return result;
    }

    async editUser(id: number, values: UserEditValues) {
        const updatedValues = { ...values };

        if (updatedValues.password) {
            updatedValues.password = await bcrypt.hash(updatedValues.password, 12);
        }

        const result = await this.repository.updateUser(id, updatedValues);

        if (!result) return null;

        return result;
    }

    async removeUserById(id: number) {
        const result = await this.repository.deleteUserById(id);

        if (!result) return null;

        return result;
    }
}
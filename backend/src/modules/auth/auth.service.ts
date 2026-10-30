
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../users/users.repository";

export async function authenticateUser(email: string, password: string) {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatches) {
        return null;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET não configurado.");
    }

const token = jwt.sign(
    { id: user.id, isAdm: user.is_adm },
    secret,
    { expiresIn: "8h" }
);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdm: user.is_adm
        }
    };
}

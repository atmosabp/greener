
import { Request, Response } from "express";
import { authenticateUser } from "./auth.service";

export async function loginController(req: Request, res: Response) {
    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: "Informe um email e uma senha válidos."
        });
    }

    try {
        const result = await authenticateUser(
            email.trim(),
            password
        );

        if (!result) {
            return res.status(401).json({
                message: "Email ou senha incorretos."
            });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Erro ao realizar login:");
        console.error(error);

        return res.status(500).json({
            message: "Ocorreu um erro interno ao realizar o login."
        });
    }
}


import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthTokenPayload extends JwtPayload {
    id: number;
    isAdm: boolean;
}

// Verifica se o usuário está autenticado
export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token de autenticação não informado."
        });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error("JWT_SECRET não configurado.");

        return res.status(500).json({
            message: "Erro interno de configuração."
        });
    }

    try {
        const decoded = jwt.verify(token, secret);

        if (
            typeof decoded === "string" ||
            typeof decoded.id !== "number" ||
            typeof decoded.isAdm !== "boolean"
        ) {
            return res.status(401).json({
                message: "Token inválido."
            });
        }

        res.locals.authUser = decoded as AuthTokenPayload;

        next();

    } catch {
        return res.status(401).json({
            message: "Token inválido ou expirado."
        });
    }
}

// Verifica se o usuário autenticado é administrador
export function requireAdmin(
    _req: Request,
    res: Response,
    next: NextFunction
) {
    const user = res.locals.authUser as AuthTokenPayload | undefined;

    if (!user || !user.isAdm) {
        return res.status(403).json({
            message: "Acesso permitido somente para administradores."
        });
    }

    next();
}

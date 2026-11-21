import { Request, Response } from "express";
import type { IAuthService } from "./auth.service";

export interface IAuthController {
  login(req: Request, res: Response): Promise<Response>;
  currentUser(req: Request, res: Response): Response;
}

export class AuthController implements IAuthController {
  constructor(private readonly service: IAuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Informe um email e senha válidos.",
      });
    }

    try {
      const result = await this.service.authenticateUser(email.trim(), password);

      if (!result) {
        return res.status(401).json({
          message: "Email ou senha incorretos.",
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Ocorreu um erro interno ao realizar o login. Tente novamente.",
      });
    }
  }

  currentUser(_req: Request, res: Response) {
    const user = res.locals.authUser;

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        isAdm: user.isAdm,
      },
    });
  }
}
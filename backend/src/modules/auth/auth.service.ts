import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { UsersRepository } from "../users/users.repository";

export interface AuthResult {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    isAdm: boolean;
  };
}

export interface IAuthService {
  authenticateUser(email: string, password: string): Promise<AuthResult | null>;
}

export class AuthService implements IAuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtSecret: string | undefined,
  ) {}

  async authenticateUser(email: string, password: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return null;
    }

    const secret = this.jwtSecret;

    if (!secret) {
      throw new Error("JWT_SECRET não configurado.");
    }

    const token = jwt.sign({ id: user.id, name: user.name, isAdm: user.is_adm }, secret, {
      expiresIn: "8h",
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdm: user.is_adm,
      },
    };
  }
}
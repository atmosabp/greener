import { Request, Response } from "express";
import {
  searchUsers,
  searchUserById,
  createNewUser,
  editUser,
  removeUserById,
} from "./users.service";

export async function createUserController(req: Request, res: Response) {
  const { name, email, password, isAdm } = req.body;

  try {
    const result = await createNewUser(name, email, password, isAdm);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Ocorreu um erro ao cadastrar o usuário.",
    });
  }
}

export async function listUsersController(_req: Request, res: Response) {
  try {
    const result = await searchUsers();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Ocorreu um erro ao listar os usuários.",
    });
  }
}

export async function listUserByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const result = await searchUserById(id);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Ocorreu um erro ao listar o usuário.",
    });
  }
}

export async function editUserController(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, email, password, isAdm } = req.body;

  if (!name && !email && !password && isAdm == undefined) {
    return res.status(400).json({
      message: "Informe ao menos um campo para atualizar.",
    });
  }

  if (password && password.trim().length < 6) {
    return res.status(400).json({
      message: "A senha deve ter pelo menos 6 caracteres.",
    });
  }

  try {
    const result = await editUser(id, {
      name,
      email,
      password,
      isAdm
    });

    return res.status(200).json(result);
  } catch (error: any) {
    if (error && error.code == "23505") {
      return res.status(409).json({
        message: error.message || "Já existe um usuário com o email informado.",
      });
    } else {
      return res.status(500).json({
        message:
          error.message ||
          "Erro interno do servidor. Tente novamente mais tarde.",
      });
    }
  }
}

export async function deleteUserByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ message: "Não foi recebido nenhum id." });
  }
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "O id deve ser do tipo number." });
  }

  try {
    const result = await removeUserById(id);

    if (!result) {
      return res
        .status(404)
        .json({
          message: "Não foi encontrado nenhum usuário com o id informado.",
        });
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      message:
        error.message ||
        "Ocorreu um erro interno ao tentar deletar o(s) usuário(s).",
    });
  }
}

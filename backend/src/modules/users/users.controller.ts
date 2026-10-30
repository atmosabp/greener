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

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Nome, email e senha são obrigatórios."
    });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    (isAdm !== undefined && typeof isAdm !== "boolean")
  ) {
    return res.status(400).json({
      message: "Os dados informados são inválidos."
    });
  }

  if (password.trim().length < 6) {
    return res.status(400).json({
      message: "A senha deve ter pelo menos 6 caracteres."
    });
  }

  try {
    const result = await createNewUser(
      name.trim(),
      email.trim(),
      password,
      isAdm ?? false
    );

    return res.status(201).json(result);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Já existe um usuário com o email informado."
      });
    }

    return res.status(500).json({
      message: "Ocorreu um erro ao cadastrar o usuário."
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

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "O ID informado é inválido."
    });
  }

  try {
    const result = await searchUserById(id);

    if (!result) {
      return res.status(404).json({
        message: "Usuário não encontrado."
      });
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: "Ocorreu um erro ao buscar o usuário."
    });
  }
}

export async function editUserController(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, email, password, isAdm } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "O ID informado é inválido."
    });
  }

  if (
    name === undefined &&
    email === undefined &&
    password === undefined &&
    isAdm === undefined
  ) {
    return res.status(400).json({
      message: "Informe ao menos um campo para atualizar."
    });
  }

  if (password !== undefined) {
    if (typeof password !== "string" || password.trim().length < 6) {
      return res.status(400).json({
        message: "A senha deve ter pelo menos 6 caracteres."
      });
    }
  }

  try {
    const result = await editUser(id, {
      name: name?.trim(),
      email: email?.trim(),
      password,
      isAdm
    });

    if (!result) {
      return res.status(404).json({
        message: "Usuário não encontrado ou nenhum campo válido para atualizar."
      });
    }

    return res.status(200).json(result);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Já existe um usuário com o email informado."
      });
    }

    return res.status(500).json({
      message: "Erro interno ao atualizar o usuário."
    });
  }
}

export async function deleteUserByIdController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ message: "Não foi recebido nenhum id." });
  }
  if (!Number.isInteger(id) || id <= 0) {
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

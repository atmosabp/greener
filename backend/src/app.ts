import express from "express";
import cors from "cors";

import type { Database } from "./db/connections";

import { PgUsersRepository } from "./modules/users/users.repository";
import { UsersService } from "./modules/users/users.service";
import { UsersController } from "./modules/users/users.controller";
import { usersRoutes } from "./modules/users/users.routes";

import { AuthService } from "./modules/auth/auth.service";
import { AuthController } from "./modules/auth/auth.controller";
import { authRoutes } from "./modules/auth/auth.routes";

import { PgCollectionsRepository } from "./modules/collections/collections.repository";
import { CollectionsService } from "./modules/collections/collections.service";
import { CollectionsController } from "./modules/collections/collections.controller";
import { collectionsRoutes } from "./modules/collections/collections.routes";

export function createApp(db: Database) {
  const app = express();

  app.use(express.json());

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080'
  ];

  app.use(cors({
    origin: function (origin, callback) {
      // permite requisições sem origem (terminal) ou as que estão na lista
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Caminho bloqueado pelo CORS.'));
      }
    },
    credentials: true
  }));

  // localhost:PORT/health
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Raiz de composição: aqui os objetos são criados e recebem suas dependências.
  // banco -> repository -> service -> controller -> rotas
  const usersRepository = new PgUsersRepository(db);
  const collectionsRepository = new PgCollectionsRepository(db);

  const usersService = new UsersService(usersRepository);
  const authService = new AuthService(usersRepository);
  const collectionsService = new CollectionsService(collectionsRepository);

  const usersController = new UsersController(usersService);
  const authController = new AuthController(authService);
  const collectionsController = new CollectionsController(collectionsService);

  app.use("/auth", authRoutes(authController));
  app.use("/users", usersRoutes(usersController));
  app.use("/collections", collectionsRoutes(collectionsController));

  app.use((_req, res) => {
    res.status(404).json({
      message: "Rota inexistente!"
    });
  });

  return app;
}
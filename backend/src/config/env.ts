const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    quiet: true,
    path: path.resolve(__dirname, "..", "..", "..", ".env"),
});

export const connection = {
  ports:process.env.PORT,

  database: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
  },
}
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    quiet: true,
    path: path.resolve(__dirname, "..","..", ".env"),
});

module.exports = {
    ports:process.env.PORT,

    database: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: process.env.POSTGRES_PORT,
    },

    jwt: {
      secret: process.env.JWT_SECRET,
      expiresInSeconds: Number(process.env.DEFAULT_EXPIRES_IN_SECONDS)
    }
};
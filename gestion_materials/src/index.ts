import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import * as dotenv from "dotenv";
import * as express from "express";
import { json } from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import Router from "./routes";

const app = express();

app.use(json());
app.use(cors());
app.use(morgan("dev"));
dotenv.config();

app.use(Router);

createConnection()
  .then(async (_connection: Connection) => {
    const server = app.listen(process.env.SERVICE_PORT || 8080, () => {
      console.log(
        `🚀 Materials Up --> 🏠 LocalHost:${
          process.env.SERVICE_PORT || 8080
        } || 🐳 Docker:8002 `
      );
    });
    module.exports = server;
  })
  .catch((error) => console.log(error));

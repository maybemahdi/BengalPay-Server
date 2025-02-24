/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { Server } from "http";
import seedAdmin from "./app/DB";

let server: Server;

async function main() {
  await mongoose.connect(config.db_uri as string);
  seedAdmin();
  server = app.listen(config.port, () => {
    console.log(`App is listening on port ${config.port}`);
  });
}

main();

process.on("unhandledRejection", () => {
  console.log("👿 Unhandled Rejection is detected, Shutting Down!");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("👿 Uncaught Rejection is detected, Shutting Down!");
  process.exit(1);
});

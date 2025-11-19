import "dotenv/config";
import http from "http";
import app from "./app";

// Setup http server
const httpServer = http.createServer(app);

httpServer.listen(process.env.HTTP_PORT, () => {
  console.log(
    `HTTP server listening: http://localhost:${process.env.HTTP_PORT}`,
  );
});
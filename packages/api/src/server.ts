import "dotenv/config";
import http from "http";
import app from "./app";

// Setup http server
const httpServer = http.createServer(app);

const port = process.env.HTTP_PORT || 5000
httpServer.listen(port, () => {
  console.log(
    `HTTP server listening: http://localhost:${port}`,
  );
});
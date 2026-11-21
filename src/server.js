
import "dotenv/config";
import { createServer } from "node:http";
import app from "./app.js";
import { initSocket } from "./socket/index.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = initSocket(httpServer);

app.set("io", io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

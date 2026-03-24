import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev  = process.env.NODE_ENV !== "production";
const app  = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // ── Socket.io Events ──────────────────────────────────────

  io.on("connection", (socket) => {
    console.log(`✓ Connected: ${socket.id}`);

    // Channel join
    socket.on("join:channel", (channelId: number) => {
      socket.join(`channel:${channelId}`);
    });

    // Channel leave
    socket.on("leave:channel", (channelId: number) => {
      socket.leave(`channel:${channelId}`);
    });

    // Channel message
    socket.on("message:channel", (data: {
      channelId: number;
      message: any;
    }) => {
      io.to(`channel:${data.channelId}`).emit("message:channel", data.message);
    });

    // DM room join
    socket.on("join:dm", (roomId: string) => {
      socket.join(`dm:${roomId}`);
    });

    // Direct message
    socket.on("message:dm", (data: {
      roomId: string;
      message: any;
    }) => {
      io.to(`dm:${data.roomId}`).emit("message:dm", data.message);
    });

    socket.on("disconnect", () => {
      console.log(`✗ Disconnected: ${socket.id}`);
    });
  });

  // ── Start Server ──────────────────────────────────────────

  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(`▲ Next.js + Socket.io ready on http://localhost:${PORT}`);
  });
});
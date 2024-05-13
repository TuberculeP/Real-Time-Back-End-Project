import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";

const allRooms: { [key: string]: { players: Record<string, any>[] } } = {};

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server({
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
  });

  io.bind(engine);

  io.on("connection", (socket) => {
    let currentRoom: string;
    console.log("A user connected");
    socket.on("createOrJoinRoom", ({ id: roomId, name }) => {
      if (!allRooms[roomId])
        allRooms[roomId] = { players: [{ name, id: socket.id }] };
      else if (allRooms[roomId].players.length === 2) {
        socket.emit("error", "Room is full");
        return;
      } else {
        allRooms[roomId].players.push({ name, id: socket.id });
      }
      socket.join(roomId);
      io.to(roomId).emit("room-joined", {
        roomId,
        players: allRooms[roomId].players,
      });
      io.to(roomId).emit("chat:join", { name });
    });
    socket.on("chat:message", ({ message, roomId, player }) => {
      socket.to(roomId).emit("chat:message", { message, player });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      if (currentRoom) {
        allRooms[currentRoom].players = allRooms[currentRoom].players.filter(
          (player) => player.id !== socket.id
        );
      }
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          const nodeContext = peer.ctx.node;
          const req = nodeContext.req;

          // @ts-expect-error private method
          engine.prepare(req);

          const rawSocket = nodeContext.req.socket;
          const websocket = nodeContext.ws;

          // @ts-expect-error private method
          engine.onWebSocket(req, rawSocket, websocket);
        },
      },
    })
  );
});

// Client Side Websocket

import { io } from "socket.io-client";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { useChat } from "./chat";

const room = reactive({
  connected: false,
  players: [],
  id: "",
  ctxId: 0,
});

export const useWebsocket = () => {
  const socket = io();
  const toast = useToast();
  const { addMessage } = useChat();

  socket.on("room-joined", ({ players, roomId }) => {
    room.connected = true;
    room.players = players;
    room.ctxId = players.findIndex((player: any) => player.id === socket.id);
    room.id = roomId;
  });

  socket.on("error", () => {
    console.error("Error joining room");
    toast.add({
      title: "Error joining room",
      description: "Room is full",
    });
  });

  const createOrJoinRoom = (roomId: string) => {
    const randomName = uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: "",
      style: "capital",
    });
    socket.emit("createOrJoinRoom", {
      id: roomId,
      name: randomName,
    });

    // Chat events
    socket.on("chat:join", ({ name }) => {
      toast.add({
        title: `${name} joined the room !`,
      });
      addMessage({
        isServer: true,
        message: `${name} joined the room !`,
      });
    });
    socket.on("chat:message", ({ message, player }) => {
      addMessage({ isServer: false, message, name: player.name });
    });
  };

  const sendChatMessage = (message: string) => {
    socket.emit("chat:message", {
      message,
      roomId: room.id,
      player: room.players[room.ctxId],
    });
  };

  return {
    socket,
    createOrJoinRoom,
    sendChatMessage,
    room,
  };
};

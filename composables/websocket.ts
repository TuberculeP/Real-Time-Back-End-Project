// Client Side Websocket

import { io } from "socket.io-client";

export const useWebsocket = () => {
  const socket = io();

  const hooks = reactive<{
    connect: () => void;
    disconnect: () => void;
    message: (message: any) => void;
    custom: Record<string, (...args: any) => void>;
  }>({
    connect: () => {},
    disconnect: () => {},
    message: () => {},
    custom: {},
  });

  socket.on("connect", () => {
    hooks.connect();
  });

  socket.on("disconnect", () => {
    hooks.disconnect();
  });

  socket.on("message", (message) => {
    hooks.message(message);
  });

  const onConnect = (callback: () => void) => {
    hooks.connect = callback;
  };

  const onDisconnect = (callback: () => void) => {
    hooks.disconnect = callback;
  };

  const onMessage = (callback: (message: any) => void) => {
    hooks.message = callback;
  };

  const onCustom = (event: string, callback: (...args: any) => void) => {
    hooks.custom[event] = callback;
    socket.on(event, callback);
  };

  const createOrJoinRoom = () => {
    console.log("oziegzogib");
    socket.emit("createOrJoinRoom", "room");
  };

  return {
    socket,
    onConnect,
    onDisconnect,
    onMessage,
    onCustom,
    createOrJoinRoom,
  };
};

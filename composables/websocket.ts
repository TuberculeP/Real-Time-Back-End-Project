// Client Side Websocket

import { io } from "socket.io-client";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { useChat } from "./chat";

const room = reactive<{
  connected: boolean;
  players: {
    name: string;
    id: string;
    color: number;
  }[];
  id: string;
  ctxId: number;
}>({
  connected: false,
  players: [],
  id: "",
  ctxId: 0,
});

const game = reactive<{
  started: boolean;
  lastMove?: number;
  board?: number[][];
}>({ started: false });

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

  socket.on("disconnect", () => {
    game.started = false;
    room.connected = false;
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
    socket.on("chat:leave", ({ name, players }) => {
      toast.add({
        title: `${name} left the room...`,
      });
      addMessage({
        isServer: true,
        message: `${name} left the room...`,
      });
      room.players = players;
    });
    socket.on("chat:message", ({ message, player }) => {
      addMessage({ isServer: false, message, name: player.name });
    });

    // Game events
    socket.on("game:start", () => {
      // If game already started, send game infos to the new player
      if (game.started) {
        socket.emit("game:move", {
          board: game.board,
          roomId: room.id,
          lastMove: game.lastMove,
        });
      } else {
        game.started = true;
        game.lastMove = 2;
        game.board = [
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
        ];
      }
    });
    socket.on("game:move", ({ lastMove, board }) => {
      game.lastMove = lastMove;
      game.board = board;
    });
  };

  const sendChatMessage = (message: string) => {
    socket.emit("chat:message", {
      message,
      roomId: room.id,
      player: room.players[room.ctxId],
    });
  };

  const gameMove = (column: number) => {
    if (!game.board) return;
    game.board[column].every((cell: number, i) => {
      if (cell == 0) {
        (game.board as number[][])[column][i] = room.players[room.ctxId].color;
      }
      return !!cell;
    });

    game.lastMove = game.lastMove === 1 ? 2 : 1;
    socket.emit("game:move", {
      board: game.board,
      roomId: room.id,
      lastMove: game.lastMove,
    });
  };

  return {
    socket,
    room,
    game,
    createOrJoinRoom,
    sendChatMessage,
    gameMove,
  };
};

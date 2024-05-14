import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";

const allRooms: { [key: string]: { players: Record<string, any>[] } } = {};

export default defineNitroPlugin((nitroApp: NitroApp) => {
	const engine = new Engine();
	const io = new Server();

	io.bind(engine);

	io.on("connection", (socket) => {
		let currentRoom: string;
		console.log("A user connected");
		socket.on("createOrJoinRoom", ({ id: roomId, name }) => {
			let isFirst = false;

			// First player to join
			if (!allRooms[roomId]) {
				allRooms[roomId] = { players: [{ name, id: socket.id, color: 1 }] };
				isFirst = true;
			}

			// Enough players in room
			else if (allRooms[roomId].players.length === 2) {
				socket.emit("error", "Room is full");
				return;

				// Second player to join
			} else {
				allRooms[roomId].players.push({
					name,
					id: socket.id,
					color: allRooms[roomId].players[0].color === 2 ? 1 : 2,
				});
			}

			// Join the room
			socket.join(roomId);
			currentRoom = roomId;
			io.to(roomId).emit("room-joined", {
				roomId,
				players: allRooms[roomId].players,
			});
			io.to(roomId).emit("chat:join", { name });

			// Game infos
			if (!isFirst) {
				io.to(roomId).emit("game:start");
			}
		});
		socket.on("chat:message", ({ message, roomId, player }) => {
			socket.to(roomId).emit("chat:message", { message, player });
		});

		socket.on("game:move", ({ board, roomId, lastMove }) => {
			socket.to(roomId).emit("game:move", { board, lastMove });
		});

		socket.on("disconnect", () => {
			console.log("A user disconnected");
			if (currentRoom) {
				const player = allRooms[currentRoom].players.find(
					(player) => player.id === socket.id
				);
				allRooms[currentRoom].players = allRooms[currentRoom].players.filter(
					(player) => player.id !== socket.id
				);
				io.to(currentRoom).emit("chat:leave", {
					name: player?.name,
					players: allRooms[currentRoom].players,
				});
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

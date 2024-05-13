// Pas Client Side Websocket

export default defineWebSocketHandler({
  open(peer) {
    console.log("WebSocket connection opened");
    peer.subscribe("");
    peer.publish("", "Hello from Nitro!");
  },
  close(peer) {
    console.log("WebSocket connection closed");
  },
  error(peer, error) {
    console.error("WebSocket error:", error);
  },
  message(peer, message) {
    console.log("WebSocket message:", message, { ...peer });
    peer.publish("", message.text());
  },
});

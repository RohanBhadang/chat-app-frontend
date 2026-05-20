import { io } from "socket.io-client";

const URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:9000";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});
export const connectSocket = (token) => {
  socket.auth = { token };
  socket.connect();
};
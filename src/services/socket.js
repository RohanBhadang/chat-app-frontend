import { io } from "socket.io-client";

const URL = "http://localhost:9000"; // backend URL

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});
export const connectSocket = (token) => {
  socket.auth = { token };
  socket.connect();
};
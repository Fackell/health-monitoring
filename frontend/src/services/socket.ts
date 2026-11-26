import { io, type Socket } from 'socket.io-client';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const socketUrl = import.meta.env.VITE_SOCKET_URL || new URL(apiUrl).origin;

export const socket: Socket = io(socketUrl, {
  autoConnect: false,
  auth: {},
});

export function connectSocket(token: string) {
  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket.connected || socket.active) {
    socket.disconnect();
  }
}

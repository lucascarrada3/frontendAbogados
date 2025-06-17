// src/utils/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
  auth: {
    token: localStorage.getItem('token'), // Opcional si tenés auth
  },
});

export default socket;

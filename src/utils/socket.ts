// src/utils/socket.ts
import { io } from 'socket.io-client';
import { API_URL } from './api';


//local

// const socket = io('http://localhost:3001', {
//   transports: ['websocket'],
//   auth: {
//     token: localStorage.getItem('token'), // Opcional si tenés auth
//   },
// });


//produccion

const socket = io(`${API_URL}`, {
  transports: ['websocket'],
  auth: {
    token: localStorage.getItem('token'), // Opcional si tenés auth
  },
});

export default socket;

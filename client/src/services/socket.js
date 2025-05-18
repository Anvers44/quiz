// client/src/services/socket.js
import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
        autoConnect: false,
        withCredentials: true
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initSocket();
    }
    return socket;
};

export const connectSocket = () => {
    if (socket) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export const joinRoom = (roomId) => {
    if (socket) {
        socket.emit('join_room', roomId);
    }
};

export const leaveRoom = (roomId) => {
    if (socket) {
        socket.emit('leave_room', roomId);
    }
};

export const sendMessage = (data) => {
    if (socket) {
        socket.emit('send_message', data);
    }
};
import { Server } from 'socket.io';
import redis from './redisService';

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Socket Connected!");
        this._io = new Server({
            cors: {
                origin: "*",
                allowedHeaders: ["*"],
            }
        });
    }

    public initListener() {
        const io = this._io;
        io.on("connect", (socket) => {
            console.log("Socket Connected!");
            socket.on("disconnect", (roomId) => {
                console.log("Socket Disconnected!");
                socket.disconnect()
            });

            socket.on("joinRoom", ({ roomId, username }) => {
                console.log("User " + username + " joined room " + roomId);
            });
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;
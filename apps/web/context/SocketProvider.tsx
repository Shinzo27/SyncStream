"use client";
import { redirect, useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: React.ReactNode;
}

interface iSocketContext {
    socket: Socket | undefined;
    joinRoom: ({roomId, username}: { roomId: string, username: string }) => any;
    leaveRoom: ({ roomId, username }: { roomId: string, username: string }) => any;
    addSong: ({roomId, song}: { roomId: string, song:{ title: string, youtubeId: string } }) => any;
    upvote: ({roomId, songtitle}: { roomId: string, songtitle: any }) => any;
    downvote: ({roomId, songtitle}: { roomId: string, songtitle: any }) => any;
}

const SocketContext = React.createContext<iSocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return state;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = React.useState<Socket>();
    const router = useRouter();
    
    const joinRoom = useCallback(({roomId, username}: { roomId: string, username: string }) => {
        if (socket) {
            socket.emit("joinRoom", { roomId: roomId, username: username });
            router.push(`/room/${roomId}`);
        }
    }, [socket]);

    const leaveRoom = useCallback(({roomId, username}: { roomId: string, username: string }) => {
        if (socket) {
            socket.emit("leaveRoom", { roomId: roomId, username: username });
            localStorage.removeItem("username")
        }
    }, [socket]);

    const addSong = useCallback(({song, roomId} : { song: { title: string, youtubeId: string }, roomId: string }) => {
        if (socket) {
            socket.emit("addSong", { roomId: roomId, song: JSON.stringify(song) });
        }
    }, [socket]);

    const upvote = useCallback(({roomId, songtitle}: { roomId: string, songtitle: string }) => {
        if (socket) {
            socket.emit("upvote", { roomId: roomId, songTitle: songtitle });
        }
    }, [socket]);

    const downvote = useCallback(({roomId, songtitle}: { roomId: string, songtitle: string }) => {
        if (socket) {
            socket.emit("downvote", { roomId: roomId, songTitle: songtitle });
        }
    }, [socket]);

    useEffect(() => {
        const _socket = io("http://localhost:8000");
        setSocket(_socket)
        
        return () => {
            _socket.disconnect()
            setSocket(undefined)
        }
    },[])
    
    return (
        <SocketContext.Provider value={{ joinRoom: joinRoom, leaveRoom: leaveRoom, socket: socket, addSong: addSong, upvote: upvote, downvote: downvote }}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
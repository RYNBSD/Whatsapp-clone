import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./Auth";

type SocketValue = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketValue | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth()!;

  useEffect(() => {
    if (user === null && socket === null) return;
    if (user === null && socket !== null) {
      if (!socket.disconnected) socket.disconnect();
      return setSocket(null);
    }
    if (socket === null) setSocket(io("http://localhost:8000"));
    return () => {
      socket?.disconnect();
    };
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./Auth";
import { request } from "../util";

type SocketValue = {
  socket: Socket | null;
  connectedContacts: number[];
};

const SocketContext = createContext<SocketValue | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectedContacts, setConnectedContacts] = useState<number[]>([]);
  const { user } = useAuth()!;

  useEffect(() => {
    if (user === null && socket === null) return;
    if (user === null && socket !== null) {
      if (!socket.disconnected) socket.disconnect();
      return setSocket(null);
    }
    if (socket === null) setSocket(io(BASE_URL, { withCredentials: true }));
    return () => {
      socket?.disconnect();
    };
  }, [socket, user]);

  useEffect(() => {
    if (socket === null) return;

    socket.once("connected-contacts", (contacts: number[]) => {
      setConnectedContacts(contacts);
    });

    socket.on(
      "contact-status",
      async (args: { userId: number; status: boolean }) => {
        if (args.status)
          return setConnectedContacts((prev) => {
            return prev.filter((contact) => contact !== args.userId);
          });

        const res = await request(
          `/user/is-contact?contactId=${encodeURIComponent(args.userId)}`,
        );
        if (!res.ok) return;

        setConnectedContacts((prev) => [...prev, args.userId]);
      },
    );

    return () => {
      socket.off("connected-contacts");
      socket.off("contact-status");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connectedContacts }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

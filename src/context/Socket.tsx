// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";

type SocketValue = {
  socket: Socket;
  connectedContacts: number[];
};

const SocketContext = createContext<SocketValue | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [connectedContacts, setConnectedContacts] = useState<number[]>([]);
  const socket = useMemo(() => io(BASE_URL, { withCredentials: true }), []);

  useEffect(() => {
    socket.once("connected-contacts", (contacts: number[]) => {
      setConnectedContacts(contacts);
    });

    socket.on(
      "contact-status",
      async (args: { userId: number; status: boolean }) => {
        setConnectedContacts((prev) =>
          args.status
            ? [...prev, args.userId]
            : prev.filter((id) => id !== args.userId),
        );
      },
    );

    return () => {
      socket.off("connected-contacts");
      socket.off("contact-status");
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connectedContacts }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

import type { Message } from "../../../types";
import { create } from "zustand";

// Chat messages
export const useMessages = create<{
  messages: Message[];
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  reset: () => void;
}>((set, get) => ({
  messages: [],
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) =>
    set({
      messages:
        typeof messages === "function" ? messages(get().messages) : messages,
    }),
  reset: () => set({ messages: [] }),
}));

// Chat message to send
export const useMessage = create<{
  message: string;
  setMessage: (message: string) => void;
  reset: () => void;
}>((set) => ({
  message: "",
  setMessage: (message: string) => set({ message }),
  reset: () => set({ message: "" }),
}));

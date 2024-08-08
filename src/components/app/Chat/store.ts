import type { Message } from "../../../types";
import { create } from "zustand";

// Chat messages
export const useMessages = create<{
  messages: Message[];
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reset: () => void;
}>((set) => ({
  messages: [],
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) =>
    set((state) => ({
      ...state,
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  reset: () => set((state) => ({ ...state, messages: [] })),
}));

// Chat message to send
export const useMessage = create<{
  message: string;
  setMessage: (message: string) => void;
  reset: () => void;
}>((set) => ({
  message: "",
  setMessage: (message: string) => set((state) => ({ ...state, message })),
  reset: () => set((state) => ({ ...state, message: "" })),
}));

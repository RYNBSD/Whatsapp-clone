export type MessageType = "text" | "video" | "audio" | "image" | "file";

export type Message = {
  id: number;
  message: string;
  sender: number;
  receiver: number;
  type: MessageType;
  createdAt: string;
};

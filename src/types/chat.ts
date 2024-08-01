export type User = {
  id: number;
  username: string;
  image: string;
  email: string;
  phone: string;
  password: string;
};

export type MessageType = "text" | "video" | "audio" | "image" | "file";

export type Message = {
  id: number;
  message: string;
  sender: number;
  receiver: number;
  type: MessageType;
  createdAt: string;
};

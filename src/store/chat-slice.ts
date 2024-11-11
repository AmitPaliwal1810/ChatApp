import { create } from "zustand";

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string;
  profileSetup: boolean;
  color: number;
  __v: number;
}

interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface ChatSliceState {
  selectedChatType: string | undefined;
  selectedChatData: IUser | undefined;
  selectedChatMessages: IMessage[];
  setSelectedChatType: (selectedChatType: string) => void;
  setSelectedChatData: (selectedChatData: IUser | undefined) => void;
  setSelectedChatMessages: (selectedChatMessages: IMessage[]) => void;
  closeChat: () => void;
  addMessages: (message: IMessage) => void;
}

export const useChatStore = create<ChatSliceState>((set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessages: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    set({
      selectedChatMessages: [...selectedChatMessages, message],
    });
  },
}));

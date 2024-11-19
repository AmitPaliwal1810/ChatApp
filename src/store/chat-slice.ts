import { create } from "zustand";

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  profileSetup?: boolean;
  color: number;
}

interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export interface IDirectMessageContacts {
  color: number;
  email: string;
  firstName: string;
  lastMessageTime: string;
  lastName: string;
  _id: string;
  image: string;
  profileSetup?: boolean;
}

interface ChatSliceState {
  selectedChatType: string | undefined;
  selectedChatData: IUser | undefined;
  selectedChatMessages: IMessage[];
  directMessageContacts: IDirectMessageContacts[];
  setSelectedChatType: (selectedChatType: string) => void;
  setSelectedChatData: (selectedChatData: IUser | undefined) => void;
  setSelectedChatMessages: (selectedChatMessages: IMessage[]) => void;
  setDirectMessageContact: (
    directMessageContacts: IDirectMessageContacts[]
  ) => void;
  closeChat: () => void;
  addMessages: (message: IMessage) => void;
}

export const useChatStore = create<ChatSliceState>((set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessageContacts: [],
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessageContact: (directMessageContacts) =>
    set({ directMessageContacts }),
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

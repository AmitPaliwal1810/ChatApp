import { create } from "zustand";

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  profileSetup?: boolean;
  color: number;
  name?: string;
  members?: string[];
  admin?: string;
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
  name?: string;
  members?: string[];
  admin?: string;
}

interface ChatSliceState {
  selectedChatType: string | undefined;
  selectedChatData: IUser | undefined;
  selectedChatMessages: IMessage[];
  directMessageContacts: IDirectMessageContacts[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  channels: any[];
  setChannels: (channels: IDirectMessageContacts[]) => void;
  setSelectedChatType: (selectedChatType: string) => void;
  setSelectedChatData: (selectedChatData: IUser | undefined) => void;
  setSelectedChatMessages: (selectedChatMessages: IMessage[]) => void;
  setDirectMessageContact: (
    directMessageContacts: IDirectMessageContacts[]
  ) => void;
  closeChat: () => void;
  addMessages: (message: IMessage) => void;
  addChannels: (channel: IDirectMessageContacts[]) => void;
}

//-------------------------------- main function - store ------------------------------------------------------

export const useChatStore = create<ChatSliceState>((set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessageContacts: [],
  channels: [],
  setChannels: (channels) => set({ channels }),
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
  addChannels: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
}));

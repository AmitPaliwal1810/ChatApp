import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { useUserInfoStore } from "../store";
import { io, Socket } from "socket.io-client";
import { HOST } from "../utlis/constant";
import { useChatStore } from "../store/chat-slice";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useRef<Socket | null>(null);
  const { userInfo } = useUserInfoStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleReceiveMessage = (message: any) => {
      const { selectedChatData, selectedChatType, addMessages } =
        useChatStore.getState();

      if (
        (selectedChatType !== undefined &&
          selectedChatData?._id === message?.sender?._id) ||
        selectedChatData?._id === message?.receipent?._id
      ) {
        addMessages(message);
        console.log("message receive", message);
      }
    };

    socket?.current?.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.current?.disconnect();
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

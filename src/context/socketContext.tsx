import {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  useState,
} from "react";
import { useUserInfoStore } from "../store";
import { io, Socket } from "socket.io-client";
import { useChatStore } from "../store/chat-slice";
import { HOST } from "../utlis/constant";

const SocketContext = createContext<Socket | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const socket = useRef<Socket | null>(null);
  const { userInfo } = useUserInfoStore();

  useEffect(() => {
    if (userInfo && !isSocketInitialized) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
        setIsSocketInitialized(true);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleReceiveMessage = (message: any) => {
        const { selectedChatData, selectedChatType, addMessages } =
          useChatStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData?._id === message?.sender?._id ||
            selectedChatData?._id === message?.recipient?._id)
        ) {
          console.log("Message received:", message);
          addMessages(message);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleReceiveChannelMessage = (message: any) => {
        const { selectedChatData, selectedChatType, addMessages } =
          useChatStore.getState();
        if (
          selectedChatType !== undefined &&
          selectedChatData?._id === message?.channelId
        ) {
          addMessages(message);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);

      return () => {
        // socket.current?.off("receiveMessage", handleReceiveMessage);
        // socket.current?.disconnect();
      };
    }
  }, [userInfo, isSocketInitialized]);

  // Log socket to ensure it's defined and connected
  useEffect(() => {
    if (socket.current) {
      console.log("Socket instance initialized:", socket.current);
    }
  }, [isSocketInitialized]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

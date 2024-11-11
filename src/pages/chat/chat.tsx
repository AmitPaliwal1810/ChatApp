import { useEffect } from "react";
import { useUserInfoStore } from "../../store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ContactContainer from "./components/contact-container";
import ChatContainer from "./components/chat-container";
import EmptyChatContainer from "./components/empty-chat-container";
import { useChatStore } from "../../store/chat-slice";

export const Chat = () => {
  const { userInfo } = useUserInfoStore();
  const { selectedChatType } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && !userInfo?.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [navigate, userInfo]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer />
      {selectedChatType ? <ChatContainer /> : <EmptyChatContainer />}
    </div>
  );
};

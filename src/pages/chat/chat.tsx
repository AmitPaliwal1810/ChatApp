import { useEffect } from "react";
import { useUserInfoStore } from "../../store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ContactContainer from "./components/contact-container";
import ChatContainer from "./components/chat-container";
import EmptyChatContainer from "./components/empty-chat-container";

export const Chat = () => {
  const { userInfo } = useUserInfoStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [navigate, userInfo?.profileSetup]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden" >
      <ContactContainer />
      {/* <EmptyChatContainer /> */}
      <ChatContainer />
    </div>
  );
};

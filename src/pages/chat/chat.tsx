import { useEffect } from "react";
import { useUserInfoStore } from "../../store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const Chat = () => {
  const { userInfo } = useUserInfoStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [navigate, userInfo?.profileSetup]);

  return <div>chat</div>;
};

import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "../../../../../../components/ui/avatar";
import { useUserInfoStore } from "../../../../../../store";
import { HOST, LOGOUT } from "../../../../../../utlis/constant";
import { getColor } from "../../../../../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../components/ui/tooltip";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { useCallback } from "react";
import { apiClient } from "../../../../../../lib/api-client";

const ProfileInfo = () => {
  const naviagte = useNavigate();
  const { userInfo } = useUserInfoStore();

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.post(LOGOUT, {}, { withCredentials: true });
      naviagte("/auth");
    } catch (error) {
      console.error(error);
    }
  }, [naviagte]);

  return (
    <div className="absolute h-16 bottom-0 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative ">
          <Avatar className="relative h-12 w-12 rounded-full overflow-hidden">
            {userInfo?.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo?.image}`}
                alt="profile"
                className="object-cover h-full bg-black rounded-full"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg  flex justify-center items-center border-[1px] rounded-full ${getColor(
                  userInfo?.color || 0
                )} `}
              >
                {userInfo?.firstName
                  ? userInfo?.firstName.split("").shift()
                  : userInfo?.email?.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo?.firstName} {userInfo?.lastName}
        </div>
      </div>
      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaEdit
                className="text-purple-500 text-xl font-medium"
                onClick={() => naviagte("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] text-white border-none">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-600 text-xl font-medium"
                onClick={handleLogout}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] text-white border-none">
              <p>LogOut</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;

import { RiCloseFill } from "react-icons/ri";
import { useChatStore } from "../../../../../../store/chat-slice";
import { Avatar, AvatarImage } from "../../../../../../components/ui/avatar";
import { getColor } from "../../../../../../lib/utils";
import { HOST } from "../../../../../../utlis/constant";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useChatStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-10">
      <div className="w-full flex gap-5 items-center justify-between">
        <div className="flex gap-3 items-center justify-center ">
          <div className="flex gap-3 items-center justify-center">
            <div className="w-12 h-12 relative ">
              {selectedChatType === "contact" ? (
                <Avatar className="relative h-12 w-12 rounded-full overflow-hidden">
                  {selectedChatData?.image ? (
                    <AvatarImage
                      src={`${HOST}/${selectedChatData?.image}`}
                      alt="profile"
                      className="object-cover h-full bg-black rounded-full"
                    />
                  ) : (
                    <div
                      className={`uppercase h-12 w-12 text-lg  flex justify-center items-center border-[1px] rounded-full ${getColor(
                        selectedChatData?.color || 0
                      )} `}
                    >
                      {selectedChatData?.firstName
                        ? selectedChatData?.firstName.split("").shift()
                        : selectedChatData?.email?.split("").shift()}
                    </div>
                  )}
                </Avatar>
              ) : (
                <div
                  className={`uppercase h-10 w-10 text-lg  flex justify-center items-center border-[1px] rounded-full bg-[#ffffff22]} `}
                >
                  #
                </div>
              )}
            </div>
            {selectedChatType === "channel" ? (
              <div>{selectedChatData?.name}</div>
            ) : (
              <div>
                {selectedChatData?.firstName || selectedChatData?.lastName
                  ? `${selectedChatData?.firstName} ${selectedChatData?.lastName}`
                  : selectedChatData?.email}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

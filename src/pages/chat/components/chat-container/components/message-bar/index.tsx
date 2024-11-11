import { useCallback, useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { useChatStore } from "../../../../../../store/chat-slice";
import { useSocket } from "../../../../../../context/socketContext";
import { useUserInfoStore } from "../../../../../../store";

interface IEmojiData {
  activeSkinTone: string;
  emoji: string;
  getImageUrl: (emojiStyle?: EmojiStyle) => string;
  imageUrl: string;
  isCustom: boolean;
  names: string[];
  unified: string;
  unifiedWithoutSkinTone: string;
}

const MessageBar = () => {
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const Socket = useSocket();
  const { selectedChatType, selectedChatData } = useChatStore();
  const { userInfo } = useUserInfoStore();
  const [message, setMessage] = useState<string>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);

  const handleSendMessage = useCallback(() => {
    console.log({type: selectedChatType })
    if (selectedChatType === "contact") {
      Socket?.emit("sendMessage", {
        sender: userInfo?.id,
        content: message,
        recipient: selectedChatData?._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  }, [Socket, message, selectedChatData?._id, selectedChatType, userInfo?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef?.current?.contains(event.target as Node)
      ) {
        setIsEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = useCallback((emoji: IEmojiData) => {
    setMessage((msg) => msg + emoji.emoji);
  }, []);

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] items-center rounded-md gap-5 pr-5">
        <input
          type="text"
          className="flex-1 flex p-5 bg-transparent foucs:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setIsEmojiPickerOpen(true);
            }}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              open={isEmojiPickerOpen}
              onEmojiClick={handleAddEmoji}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:border-none focus:outline-none focus:text-white transition-all duration-300"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;

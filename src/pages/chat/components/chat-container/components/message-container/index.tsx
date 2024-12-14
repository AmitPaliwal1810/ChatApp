/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react";
import { useChatStore } from "../../../../../../store/chat-slice";
import { useUserInfoStore } from "../../../../../../store";
import moment from "moment";
import { apiClient } from "../../../../../../lib/api-client";
import {
  GET_ALL_MESSAGES_ROUTES,
  HOST,
} from "../../../../../../utlis/constant";
import { Download, Folder } from "lucide-react";
import { toast } from "sonner";
// import { ImageIcon } from "lucide-react";

const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico)$/i;

const MessageContainer = () => {
  const scrollRef = useRef<any>();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useChatStore();
  const { userInfo } = useUserInfoStore();
  console.log(userInfo);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const getMessages = useCallback(async () => {
    try {
      const response = await apiClient.post(
        GET_ALL_MESSAGES_ROUTES,
        { id: selectedChatData?._id },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.messages) {
        setSelectedChatMessages(response?.data?.messages);
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedChatData?._id, setSelectedChatMessages]);

  useEffect(() => {
    if (selectedChatData?._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType, getMessages]);

  const handleDownloadFile = useCallback(
    async (fileUrl: string, fileName: string) => {
      try {
        const response = await apiClient.get(`${HOST}/${fileUrl}`, {
          responseType: "blob",
        });

        if (response.status === 200) {
          const urlBlob = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = urlBlob;
          link.download = fileName;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.URL.revokeObjectURL(urlBlob);
        } else {
          throw new Error("Failed to fetch the file.");
        }
      } catch (error) {
        console.error("Error downloading file:", error);
        toast.error("Failed to download the file. Please try again.");
      }
    },
    []
  );

  const renderDmMessages = (messages: any) => {
    console.log({ sender: messages.sender });
    return (
      <div
        className={`flex flex-col gap-1  ${
          messages.sender._id === selectedChatData?._id ||
          messages.sender === selectedChatData?._id
            ? "items-start"
            : "items-end"
        } `}
      >
        {messages.messageType === "text" && (
          <div
            className={`${
              messages.sender._id !== selectedChatData?._id &&
              messages.sender !== selectedChatData?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-[#fff]/80 border-[#fff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {messages?.content}
          </div>
        )}
        {messages.messageType === "file" && (
          <div
            className={`${
              messages.sender._id !== selectedChatData?._id &&
              messages.sender !== selectedChatData?._id
                ? "bg-[#8417ff]/70  border-[#8417ff]/50"
                : "bg-[#2a2b33]/70  border-[#fff]/20"
            }  rounded-lg p-2`}
          >
            {imageRegex.test(messages?.fileUrl) ? (
              <div className="cursor-pointer rounded-lg overflow-hidden ">
                <img
                  src={`${HOST}/${messages?.fileUrl}`}
                  alt="image"
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="h-full w-full flex justify-center items-center gap-4">
                <span
                  className="bg-black/20 p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 "
                  onClick={() =>
                    handleDownloadFile(
                      messages?.fileUrl,
                      messages?.fileUrl?.split("/")?.pop()
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                </span>
                <div className="flex pl-10 items-center gap-5">
                  <span className="text-white/80 text-3xl bg-black/20 rounded-full p-6">
                    <Folder />
                  </span>
                  <span className="text-xs">
                    {messages?.fileUrl?.split("/")?.pop()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-green-600">
          {moment(messages.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate: any = null;
    return selectedChatMessages.map((messages, index) => {
      const messageDate = moment(messages.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-green-500 my-2 ">
              {moment(messages?.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDmMessages(messages)}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;

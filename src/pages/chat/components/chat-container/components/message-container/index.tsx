/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react";
import { useChatStore } from "../../../../../../store/chat-slice";
import { useUserInfoStore } from "../../../../../../store";
import moment from "moment";
import { apiClient } from "../../../../../../lib/api-client";
import { GET_ALL_MESSAGES_ROUTES } from "../../../../../../utlis/constant";

const MessageContainer = () => {
  const scrollRef = useRef<any>();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useChatStore();
  const { userInfo } = useUserInfoStore();
  console.log(userInfo)

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

  const renderDmMessages = (messages: any) => {
    console.log({ sender: messages.sender });
    return (
      <div
        className={`${
          messages.sender._id === selectedChatData?._id
            ? "text-left"
            : "text-right"
        } `}
      >
        {messages.messageType === "text" && (
          <div
            className={`${
              messages.sender._id !== selectedChatData?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-[#fff]/80 border-[#fff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {messages?.content}
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

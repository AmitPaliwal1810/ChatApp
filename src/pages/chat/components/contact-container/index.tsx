import { useCallback, useEffect } from "react";
import NewDm from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "../../../../lib/api-client";
import { GET_DM_CONTACT_ROUTES } from "../../../../utlis/constant";
import {
  IDirectMessageContacts,
  useChatStore,
} from "../../../../store/chat-slice";
import ContactList from "../../../../components/contact-list";

const ContactContainer = () => {
  const { setDirectMessageContact, directMessageContacts } = useChatStore();

  const getContact = useCallback(async () => {
    try {
      const response = await apiClient.get(GET_DM_CONTACT_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        console.log({ data: response.data.contacts });
        setDirectMessageContact(
          response.data.contacts as IDirectMessageContacts[]
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [setDirectMessageContact]);

  useEffect(() => {
    getContact();
  }, [getContact]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="flex p-5 justify-center items-center gap-2"> LOGO </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Direct Messages"} />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessageContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Channels"} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactContainer;

const Title = ({ text }: { text: string }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

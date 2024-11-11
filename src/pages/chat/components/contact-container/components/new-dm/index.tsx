import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../components/ui/tooltip";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import { Input } from "../../../../../../components/ui/input";
import { animationDefaultOptions, getColor } from "../../../../../../lib/utils";
import { apiClient } from "../../../../../../lib/api-client";
import { HOST, SEARCH_CONTACT } from "../../../../../../utlis/constant";
import { ScrollArea } from "../../../../../../components/ui/scroll-area";
import { Avatar, AvatarImage } from "../../../../../../components/ui/avatar";
import { useChatStore } from "../../../../../../store/chat-slice";

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string;
  profileSetup: boolean;
  color: number;
  __v: number;
}

const NewDm = () => {
  const { setSelectedChatData, setSelectedChatType } = useChatStore();
  const [openNewContactModal, setOpenNewContactModal] =
    useState<boolean>(false);
  const [searchContacts, setSearchContacts] = useState<IUser[]>([]);

  const handleSearchContacts = useCallback(async (search: string) => {
    try {
      if (search.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACT,
          { searchTerm: search },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setSearchContacts(response?.data?.contacts);
        }
      } else {
        setSearchContacts([]);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSearchContacts([]);
    setOpenNewContactModal(false);
  }, []);

  const selectNewContact = useCallback(
    (contact: IUser) => {
      setOpenNewContactModal(false);
      setSearchContacts([]);
      setSelectedChatType("contact");
      setSelectedChatData(contact);
    },
    [setSelectedChatData, setSelectedChatType]
  );

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-sm text-neutral-400 font-light text-opacity-90 cursor-pointer"
              onClick={() => {
                setOpenNewContactModal(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white mb-2 p-3">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-[#181920] border-none rounded-lg text-white w-[400px] h-[400px] flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Please Select the Contact</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search Contact"
            className="w-full rounded-lg p-6 bg-[#2c2e3b] border-none"
            onChange={(e) => handleSearchContacts(e.target.value)}
          />
          <ScrollArea className="h-[250px] w-full">
            <div className="flex flex-col gap-5">
              {searchContacts.map((contact: IUser) => (
                <div
                  key={contact?._id}
                  className="flex cursor-pointer gap-4 items-center justify-start w-full"
                  onClick={() => selectNewContact(contact)}
                >
                  <div className="w-12 h-12 relative ">
                    <Avatar className="relative h-12 w-12 rounded-full overflow-hidden">
                      {contact?.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact?.image}`}
                          alt="profile"
                          className="object-cover h-full bg-black rounded-full"
                        />
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 text-lg  flex flex-col justify-center items-center border-[1px] rounded-full ${getColor(
                            contact?.color || 0
                          )} `}
                        >
                          {contact?.firstName
                            ? contact?.firstName.split("").shift()
                            : contact?.email?.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col ">
                    <span>
                      {contact.firstName || contact.lastName
                        ? `${contact?.firstName} ${contact?.lastName}`
                        : contact.email}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {searchContacts?.length <= 0 && (
            <div className="flex-1 flex flex-col justify-center items-center duration-1000 transition-all gap-10">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col items-center lg:text-2xl text-2xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span> Search New{" "}
                  <span className="text-purple-500">Contact</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;

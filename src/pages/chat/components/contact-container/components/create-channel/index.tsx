import { FaPlus } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../components/ui/tooltip";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import { Input } from "../../../../../../components/ui/input";
import { apiClient } from "../../../../../../lib/api-client";
import {
  CREATE_CHANNEL_ROUTES,
  GET_ALL_CONTACTS_ROUTES,
} from "../../../../../../utlis/constant";
import { Button } from "../../../../../../components/ui/button";
import MultipleSelector from "../../../../../../components/ui/multipleselect";
import {
  IDirectMessageContacts,
  useChatStore,
} from "../../../../../../store/chat-slice";

const CreateChannel = () => {
  const {
    // channels, setChannels,
    addChannels,
  } = useChatStore();
  const [newChannelModal, setNewChannelModal] = useState<boolean>(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedConatct, setSelectedContact] = useState<
    { label: string; value: string }[]
  >([]);
  const [channelName, setChannelName] = useState<string>("");

  const getData = useCallback(async () => {
    try {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      setAllContacts(response?.data?.contacts);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleCreateChannel = useCallback(async () => {
    if (!channelName?.length || !selectedConatct?.length) return;
    try {
      const response = await apiClient.post(
        CREATE_CHANNEL_ROUTES,
        {
          name: channelName,
          members: selectedConatct,
        },
        {
          withCredentials: true,
        }
      );
      setChannelName("");
      setSelectedContact([]);
      setNewChannelModal(false);
      addChannels(response?.data?.channel as IDirectMessageContacts[]);
    } catch (error) {
      console.error(error);
    }
  }, [addChannels, channelName, selectedConatct]);

  const handleCloseDialog = useCallback(() => {
    setSelectedContact([]);
    setChannelName("");
    setNewChannelModal(false);
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-sm text-neutral-400 font-light text-opacity-90 cursor-pointer"
              onClick={() => {
                setNewChannelModal(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white mb-2 p-3">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-[#181920] border-none rounded-lg text-white w-[500px] h-[400px] flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for New Channel
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Channel Name"
            className="w-full rounded-lg p-6 bg-[#2c2e3b] border-none"
            onChange={(e) => setChannelName(e.target.value)}
            value={channelName}
          />
          <MultipleSelector
            className="w-full rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
            defaultOptions={allContacts}
            placeholder="Search Contacts"
            value={selectedConatct}
            onChange={setSelectedContact}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600">
                No Result found
              </p>
            }
            badgeClassName="bg-purple-700 hover:bg-purple-900"
          />
          <Button
            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 "
            onClick={handleCreateChannel}
          >
            Create Channel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;

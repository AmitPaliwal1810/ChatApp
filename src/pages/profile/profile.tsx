import { useCallback, useEffect, useRef, useState } from "react";
import { UserInfo, useUserInfoStore } from "../../store";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { colors, getColor } from "../../lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "../../utlis/constant";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUserInfoStore();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [image, setImage] = useState<string | null>();
  const [hovered, setHovered] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userInfo?.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo?.image) {
      setImage(`${HOST}/${userInfo?.image}`);
    }
  }, [userInfo]);

  const validateProfile = useCallback(() => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("First Name is required");
      return false;
    }
    return true;
  }, [firstName, lastName]);

  const saveChanges = useCallback(async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color: selectedColor,
          },
          { withCredentials: true }
        );
        setUserInfo(response?.data?.user);
        toast.success("Profile Update Sucessfully");
        navigate("/chat");
      } catch (error) {
        console.error(error);
      }
    }
  }, [
    firstName,
    lastName,
    navigate,
    selectedColor,
    setUserInfo,
    validateProfile,
  ]);

  const handleFileInputClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [fileInputRef]);

  const handleImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const file = event.target.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append("profile-image", file);

          const response = await apiClient.post(
            ADD_PROFILE_IMAGE_ROUTE,
            formData,
            { withCredentials: true }
          );

          if (response.status === 200 && response.data.image) {
            useUserInfoStore.getState().setUserInfo({
              ...useUserInfoStore.getState().userInfo,
              image: response.data.image,
            } as UserInfo);

            toast.success("Image Uploaded Successfully");
          }

          const reader = new FileReader();
          reader.onload = () => {
            if (reader?.result) {
              setImage(reader.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error("Failed to upload the image. Please try again.");
      }
    },
    []
  );

  const deleteImage = useCallback(async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null } as UserInfo);
        toast.success("Image Removed Successfully");
        setImage(null);
      }
    } catch (error) {
      console.error(error);
    }
  }, [setUserInfo, userInfo]);

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 w-full p-4">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div
          className="w-full flex justify-start"
          onClick={() =>
            userInfo?.profileSetup
              ? navigate("/chat")
              : toast.error("Please complete your Profile First")
          }
        >
          <IoArrowBack className="text-4xl lg:text-6xl text-white text-opacity-90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48  flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="relative h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl  flex justify-center items-center border-[1px] rounded-full ${getColor(
                    selectedColor
                  )} `}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo?.email?.split("").shift()}
                </div>
              )}
              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer "
                  onClick={image ? deleteImage : handleFileInputClick}
                >
                  {image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                    name="profile-image"
                    accept=".png,.jpg,.jpeg,.svg,.webp"
                  />
                </div>
              )}
            </Avatar>
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col text-white items-center justify-center gap-4">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo?.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                autoComplete="off"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                autoCapitalize="off"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-white/100 outline-1"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

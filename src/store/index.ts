import { create } from "zustand";

interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  profileSetup: boolean;
  color: number;
}

export const useUserInfoStore = create<{
  userInfo: UserInfo | undefined;
  setUserInfo: (userInfo: UserInfo) => void;
}>((set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
}));

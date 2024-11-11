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
  userInfo: UserInfo | null | undefined;
  setUserInfo: (userInfo: UserInfo | null) => void;
}>((set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo: UserInfo | null) => set({ userInfo }),
}));

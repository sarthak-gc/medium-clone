import { create } from "zustand";

type userT = { username: string; email: string; userId: string };

type UserStore = {
  username: string;
  email: string;
  userId: string;
  setUser: (value: userT) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  username: "",
  email: "",
  userId: "",
  setUser: (user) =>
    set(() => ({
      username: user.username,
      email: user.email,
      userId: user.userId,
    })),
}));

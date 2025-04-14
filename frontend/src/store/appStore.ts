import { create } from "zustand";

type AppStore = {
  darkTheme: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setIsLoggedOut: (value: boolean) => void;
  toggleDarkTheme: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  darkTheme: false,
  isLoggedIn: false,
  setIsLoggedIn: () => set(() => ({ isLoggedIn: true })),
  setIsLoggedOut: () => set(() => ({ isLoggedIn: false })),
  toggleDarkTheme: () => set((state) => ({ darkTheme: !state.darkTheme })),
}));

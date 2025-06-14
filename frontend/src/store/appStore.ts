import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
type AppStore = {
  darkTheme: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setIsLoggedOut: (value: boolean) => void;
  toggleDarkTheme: () => void;
  query: string;
  setQuery: (value: string) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      darkTheme: false,
      isLoggedIn: false,
      setIsLoggedIn: () => set(() => ({ isLoggedIn: true })),
      setIsLoggedOut: () => set(() => ({ isLoggedIn: false })),
      toggleDarkTheme: () => set((state) => ({ darkTheme: !state.darkTheme })),
      query: "",
      setQuery: (query) =>
        set(() => ({
          query: query,
        })),
    }),
    {
      name: "login-status",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

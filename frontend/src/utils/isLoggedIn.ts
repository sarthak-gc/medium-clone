import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../store/userStore";
import { useAppStore } from "../store/appStore";

type TokenReturnT = {
  user: {
    username: string;
    email: string;
    userId: string;
  };
};

export const isLoggedIn = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  try {
    const { user } = jwtDecode<TokenReturnT>(token);
    console.log(user);

    const { setUser } = useUserStore.getState();
    const setIsLoggedIn = useAppStore.getState().setIsLoggedIn;

    setUser(user);
    setIsLoggedIn(true);
  } catch (e) {
    console.error("JWT Decode failed:", e);
    return false;
  }

  return true;
};

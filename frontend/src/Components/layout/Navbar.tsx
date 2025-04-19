import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import { ChangeEvent, useState } from "react";
import { AXIOS } from "../../utils/axios";

const Navbar = () => {
  const [query, setQuery] = useState<string>();
  const isLoggedIn = useAppStore().isLoggedIn;
  const setQueryS = useAppStore().setQuery;
  const navigate = useNavigate();
  const handleBlogWrite = () => {
    if (!isLoggedIn) {
      if (window.confirm("Log in to start writing blog")) {
        navigate("/login");
        return;
      } else {
        return;
      }
    }
    navigate("/blog/write");
  };

  const handleLogout = async () => {
    document.cookie = `token=; path=/; max-age=0 SameSite=None; Secure; Path=/; HttpOnly`;
    localStorage.removeItem("token");
    const response = await AXIOS.post("/user/logout");
    if (response.data?.status === "success") {
      navigate("/login");
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryS(e.target.value);
  };

  const handleBlogSearch = async () => {
    navigate(`/search/blogs?q=${query}`, {
      state: {
        fromNav: true,
        pathname: location.pathname,
      },
    });
  };

  return (
    <nav className="w-full border-b border-gray-200 px-4 py-4 md:py-3 bg-white">
      {/* Desktop and Large screens: Logo, Search, Buttons, and Avatar */}
      <div className="hidden md:flex justify-between items-center">
        {/* Left Section: Logo + Search */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 cursor-pointer"
          >
            Medium Rare
          </Link>

          <input
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (query) handleBlogSearch();
              }
            }}
            value={query}
            type="search"
            placeholder="Search"
            className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black bg-[#f9f9f9]"
          />
        </div>

        {/* Right Section: Buttons + Avatar */}
        <div className="flex items-center gap-4">
          {/* Write  */}
          <div
            onClick={handleBlogWrite}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1f1e1e]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                className="rounded-md  transition"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />{" "}
            </svg>
            <button className=" rounded-md  transition">Write</button>
          </div>
          {/* Signin signUp */}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 transition cursor-pointer"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className=" text-gray-500 hover:text-[#1f1e1e] transition"
              >
                Sign Up
              </Link>
            </>
          )}
          {/* Notification */}
          {isLoggedIn && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-gray-500 hover:text-[#1f1e1e]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </>
          )}
          {/* Avatar placeholder */}
          {isLoggedIn && (
            <div className="relative group z-50">
              <div className="w-8 h-8  bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-white ">
                U
              </div>
              <div className="absolute  right-0 hidden group-hover:block ">
                <Link
                  to="/me"
                  className=" text-white text-xs  py-1 px-2  w-32  bg-black cursor-pointer hover:bg-gray-700 block"
                >
                  User Profile
                </Link>
                <Link
                  to="/settings"
                  className="bg-black text-white text-xs py-1 px-2 block  cursor-pointer hover:bg-gray-700 "
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-black text-white text-xs py-1 px-2 block  cursor-pointer hover:bg-gray-700 w-full text-start"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Logo, SignIn/SignUp at top, Search bar + Avatar below */}
      <div className="md:hidden">
        {/* Top Section: Logo + Auth Buttons */}
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 cursor-pointer"
          >
            Medium Rare
          </Link>

          <div className="flex items-center gap-4">
            <div
              onClick={handleBlogWrite}
              className="gap-2 text-gray-500 hover:text-[#1f1e1e] items-center flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  className="rounded-md  transition"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />{" "}
              </svg>
              <button className=" rounded-md  transition">Write</button>
            </div>
            {isLoggedIn && (
              <div className="flex gap-4 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
                {/* Avatar placeholder */}
                {isLoggedIn && (
                  <div className="relative group z-50">
                    <div className="w-8 h-8  bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-white ">
                      U
                    </div>
                    <div className="absolute  right-0 hidden group-hover:block ">
                      <Link
                        to="/me"
                        className="bg-black text-white text-xs py-1 px-2 block  cursor-pointer hover:bg-gray-700 "
                      >
                        User Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="bg-black text-white text-xs py-1 px-2 block  cursor-pointer hover:bg-gray-700 "
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="bg-black text-white text-xs py-1 px-2 block  cursor-pointer hover:bg-gray-700 w-full text-start"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isLoggedIn && (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 transition cursor-pointer"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className=" text-gray-500 hover:text-[#1f1e1e] transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Section: Search bar + Avatar */}
        <div className="flex items-center gap-4 justify-between mt-3">
          <input
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (query) handleBlogSearch();
              }
            }}
            type="search"
            placeholder="Search"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black bg-[#f9f9f9]
            "
            value={query}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

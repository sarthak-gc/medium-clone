import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AXIOS } from "../../utils/axios";

import Header from "./Header";
import UserCard from "../../Components/user/UserCard";
import Spinner from "../../Components/loaders/Spinner";

export type UserT = {
  email: string;
  profile: "";
  profilePic: string | null;
  userId: string;
  username: string;
};
const SearchedUserResults = () => {
  const [startFrom, setStartFrom] = useState(0);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [noMore, setNoMore] = useState(false);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    console.log("User clicked");
    console.log(id);
    navigate(`/user/${id}`);
  };
  const followUser = async (id: string) => {
    console.log(id);
    const response = await AXIOS.post(`/user/follow/${id}`);

    console.log(response);
  };

  const location = useLocation();
  const [results, setResults] = useState<UserT[]>([]);
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");
  useEffect(() => {
    const getSearchResult = async () => {
      setIsFetching(true);
      const response = await AXIOS.get(
        `/user/search/${startFrom}?query=${searchQuery}`
      );

      // console.log(response.data.data.users);
      if (response.data.data.users.length === 0) {
        setNoMore(true);
      }
      setResults((prev) => {
        const newUsers = response.data.data.users;
        const uniqueUsers = new Map();

        prev.forEach((user) => {
          uniqueUsers.set(user.userId, user);
        });

        newUsers.forEach((user: UserT) => {
          uniqueUsers.set(user.userId, user);
        });

        return Array.from(uniqueUsers.values());
      });
      setIsFetching(false);
      setIsUserLoading(false);
    };
    getSearchResult();
  }, [searchQuery, startFrom]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 100 &&
        !isUserLoading &&
        !noMore
      ) {
        setStartFrom((prev) => prev + 5);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [noMore, isUserLoading]);
  return (
    <div className="max-w-3xl md:mx-auto  pt-8 py-4 lg:px-0 md:space-y-7 space-y-3  px-4">
      <Header searchQuery={searchQuery} />
      {isUserLoading && (
        <div className="flex justify-between items-center  py-8 border-b-1 border-gray-300 ">
          <div className={`flex items-center space-x-3  h-12 w-full`}>
            <div className="w-12 h-12 p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm"></div>
            <div className="mb-4 h-16 w-3/5 mt-8">
              <h1 className="text-sm text-gray-500 h-2 rounded-full bg-gray-200 w-1/2">
                <div className=" bg-gray-200 rounded-full w-full"></div>
              </h1>
              <h1 className="text-sm text-gray-500 h-2 rounded-full bg-gray-200">
                <div className=" rounded-full max-w-[480px] mb-2.5"></div>
              </h1>{" "}
              <h1 className="text-sm text-gray-500 h-2 rounded-full bg-gray-200">
                <div className=" rounded-full max-w-[480px] mb-2.5"></div>
              </h1>
            </div>
          </div>

          <button className="bg-gray-300 text-white px-12 py-5 rounded-full hover:bg-green-800 transition cursor-pointer"></button>
        </div>
      )}

      {results.length === 0 && !isUserLoading && (
        <ul className="list-none text-[#7e7e7e] mt-7">
          <li>Make sure all words are spelled correctly.</li>
          <li>Try different keywords.</li>
          <li>Try more general keywords.</li>
        </ul>
      )}

      {results.map((user) => {
        return (
          <UserCard
            key={user.userId}
            user={user}
            handleClick={handleClick}
            followUser={followUser}
          />
        );
      })}
      {!isUserLoading && isFetching && <Spinner />}
    </div>
  );
};

export default SearchedUserResults;

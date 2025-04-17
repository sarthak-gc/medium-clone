import { useEffect, useState } from "react";
import AvatarNameSkeleton from "../../Components/skeleton/AvatarNameSkeleton";
import { AXIOS } from "../../utils/axios";
import { Link, useParams } from "react-router-dom";
import { BlogT } from "../feeds/GlobalFeed";
import Feed from "../feeds/Feed";
import AvatarName from "../../Components/user/AvatarName";
import Spinner from "../../Components/loaders/Spinner";

type UserInfoT = {
  userId: string;
  username: string;
  email: string;
  profile: string;
  profilePic: string | null;
  createdAt: string;
};
const UserProfile = () => {
  const [blogs, setBlogs] = useState<BlogT[]>([]);
  const { userId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [startFrom, setStartFrom] = useState<number>(0);
  const x = false;
  const [noMore, setNoMore] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoT>({
    userId: "",
    username: "",
    email: "",
    profile: "",
    profilePic: "",
    createdAt: "",
  });
  const followUser = async (id: string) => {
    console.log(id);
    const response = await AXIOS.post(`/user/follow/${id}`);

    console.log(response);
  };
  useEffect(() => {
    const getUserDetails = async () => {
      setFetching(true);
      const response = await AXIOS.get(
        `/user/userProfile/${userId}?startFrom=${startFrom}`
      );

      if (response.data.data.blogs.length < 5) {
        setNoMore(true);
      }

      setBlogs((prev) => {
        const newBlogs = response.data.data.blogs;

        const uniqueBlogsMap = new Map();

        prev.forEach((blog: BlogT) => {
          uniqueBlogsMap.set(blog.blogId, blog);
        });

        newBlogs.forEach((element: BlogT) => {
          uniqueBlogsMap.set(element.blogId, element);
        });

        return Array.from(uniqueBlogsMap.values());
      });

      setUserInfo(response.data.data.userInfo);
      setLoading(false);
      setFetching(false);
    };
    if (!noMore) {
      getUserDetails();
    }
  }, [userId, startFrom, noMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 100 &&
        !noMore &&
        !fetching
      ) {
        setStartFrom((prev) => prev + 5);
        console.log("++");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetching, noMore]);

  return (
    <div className="flex flex-col lg:flex-row">
      {" "}
      <div className="p-5 gap-12 text-[#757575]  w-[100vw] lg:w-[33vw]">
        <div className="sm:w-full flex  justify-start items-start ">
          {/* {loading ? ( */}
          {x ? (
            <AvatarNameSkeleton small={false} />
          ) : (
            <div className=" w-full justify-between flex gap-4 border-gray-500 border py-2 px-4">
              <AvatarName
                username={userInfo.username}
                id={userInfo.userId}
                small={false}
              />
              <button
                onClick={() => followUser(userInfo.userId)}
                className="bg-green-700 lg:bg-transparent   px-4  text-white py-4 rounded-full lg:rounded-none hover:bg-green-800  cursor-pointer lg:hover:bg-transparent"
              >
                <span className="lg:hidden">Follow</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#dadada"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#dadada"
                  className="size-6 hidden lg:block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col  h-screen ">
        <div className="flex justify-center lg:py-8 border-b border-gray-300">
          <div className="max-w-3xl mx-auto flex gap-10 overflow-x-auto px-4 scrollbar-none relative">
            <Link
              className="flex-shrink-0 px-4 py-2 rounded w-1/6 text-start"
              to={`/user/${userId}`}
            >
              Home
            </Link>
            <Link
              className="flex-shrink-0 px-4 py-2 rounded w-1/6 text-start"
              to={`/user/${userId}`}
            >
              About
            </Link>
          </div>
        </div>

        <div
          className="px-4 "
          onClick={() => {
            if (!noMore) setStartFrom((prev) => prev + 5);
          }}
        >
          {!loading && blogs.length === 0 && (
            <div className="w-full h-full  mt-50 text-center">
              No Blogs In the home feed
            </div>
          )}
          <Feed loading={loading} blogs={blogs} />
          {fetching && <Spinner />}

          {noMore && blogs.length > 0 && (
            <div className="h-30 flex items-center justify-center">
              <span>No more blogs</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

import { useEffect, useState } from "react";

import { AXIOS } from "../../utils/axios";
import { Link } from "react-router-dom";
import { BlogT } from "../feeds/GlobalFeed";
import Feed from "../feeds/Feed";
import Spinner from "../../Components/loaders/Spinner";
import { useUserStore } from "../../store/userStore";

const MyProfile = () => {
  const [blogs, setBlogs] = useState<BlogT[]>([]);
  const userId = useUserStore.getState().userId;
  const [loading, setLoading] = useState<boolean>(true);
  const [startFrom, setStartFrom] = useState<number>(0);
  const [noMore, setNoMore] = useState(false);
  const [fetching, setFetching] = useState(false);
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
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetching, noMore]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="w-full flex flex-col  h-screen ">
        <div className="flex justify-center lg:py-8 border-b border-gray-300">
          <div className="max-w-3xl mx-auto flex gap-10 overflow-x-auto px-4 scrollbar-none relative">
            <Link
              className="flex-shrink-0 px-4 py-2 rounded w-1/6 text-start"
              to={`/me`}
            >
              Home
            </Link>
            <Link
              className="flex-shrink-0 px-4 py-2 rounded w-1/6 text-start"
              to={`/me`}
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

export default MyProfile;

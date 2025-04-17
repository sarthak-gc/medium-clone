import { useEffect, useState } from "react";
import AvatarNameSkeleton from "../../Components/skeleton/AvatarNameSkeleton";
import { AXIOS } from "../../utils/axios";
import { Link, useParams } from "react-router-dom";
import { BlogT } from "../feeds/GlobalFeed";
// import BlogCard from "../../Components/blog/BlogCard";
import BlogCardSkeleton from "../../Components/skeleton/BlogCardSkeleton";
import Feed from "../feeds/Feed";
import AvatarName from "../../Components/user/AvatarName";

const UserProfile = () => {
  const [blogs, setBlogs] = useState<BlogT[]>([]);
  const { userId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [startFrom, setStartFrom] = useState<number>(0);

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      const response = await AXIOS.get(
        `/user/userProfile/${userId}?startFrom=${startFrom}`
      );
      console.log("User detail...");
      console.log(response.data.data.blogs);
      setBlogs(response.data.data.blogs);
      setLoading(false);
    };
    getUserDetails();
  }, [userId, startFrom]);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Main Content (div1) */}

      {/* Sidebar / Profile Avatar (div2) */}
      <div className="p-5 gap-12 text-[#757575]  w-[100vw] lg:w-[33vw]">
        <div className="sm:w-full flex  justify-start items-start ">
          {loading ? (
            <AvatarNameSkeleton small={false} />
          ) : (
            <AvatarName username="title" small={false} />
          )}
        </div>
      </div>

      <div className="w-full flex flex-col  items-center">
        {/* Navigation Links */}
        <div>
          <div className="max-w-3xl mx-auto flex gap-10 overflow-x-auto px-4 scrollbar-none relative ">
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

        {/* Feed Section */}
        <div className="w-full px-0 gap-12 text-[#757575] overflow-scroll ">
          {/* Display Loading Skeletons or Blogs */}
          {loading ? (
            <div className="space-y-4">
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </div>
          ) : (
            <>
              <Feed loading={loading} blogs={blogs} />
              <Feed loading={loading} blogs={blogs} />
              <Feed loading={loading} blogs={blogs} />
              <Feed loading={loading} blogs={blogs} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

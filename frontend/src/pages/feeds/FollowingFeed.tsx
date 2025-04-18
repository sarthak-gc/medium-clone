import { useEffect, useState } from "react";
import { AXIOS } from "../../utils/axios";
import { BlogT } from "./GlobalFeed";
import ScrollBar from "../../Components/layout/ScrollBar";
import Feed from "./Feed";
import Spinner from "../../Components/loaders/Spinner";

const FollowingFeed = () => {
  const [blogs, setBlogs] = useState<BlogT[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [startFrom, setStartFrom] = useState(0);
  const [noMore, setNoMore] = useState(false);

  // const { blogId } = useParams();
  useEffect(() => {
    const fetchBlog = async () => {
      setFetching(true);

      const response = await AXIOS.get(
        `/blog/followings?startFrom=${startFrom}`
      );

      if (response.data.data.blogs.length < 8) {
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
    if (!noMore) fetchBlog();
  }, [noMore, startFrom]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 100 &&
        !noMore &&
        !fetching
      ) {
        setStartFrom((prev) => prev + 8);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetching, noMore]);

  return (
    <div className="px-4 ">
      <ScrollBar />
      {!loading && blogs.length === 0 && (
        <div className="w-full h-full  mt-50 text-center">
          No Blogs In the home feed
        </div>
      )}
      <Feed loading={loading} blogs={blogs} />
      {fetching && <Spinner />}
    </div>
  );
};

export default FollowingFeed;

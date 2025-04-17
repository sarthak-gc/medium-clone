import { useEffect, useState } from "react";
import { AXIOS } from "../../utils/axios";
// import { useNavigate } from "react-router-dom";
import Feed from "./Feed";
import ScrollBar from "../../Components/layout/ScrollBar";
import Spinner from "../../Components/loaders/Spinner";

export type CommentT = {
  createdAt: Date;
  isUpdated: boolean;
  parentId: string | null;
  commentId: string;
  User: {
    username: string;
    userId: string;
  };
  content: string;
};
type ReactionT = {
  User: {
    username: string;
    userId: string;
  };
};

export type BlogT = {
  blogId: string;
  title: string;
  content: string;
  authorId: string;
  Reactions: ReactionT[];
  createdAt: Date;
  Comment: CommentT[];
  User: {
    username: string;
  };
};

const GlobalFeed = () => {
  const [blogs, setBlogs] = useState<BlogT[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  // const navigate = useNavigate();
  const [startFrom, setStartFrom] = useState(0);
  const [noMore, setNoMore] = useState(false);

  // const { blogId } = useParams();
  useEffect(() => {
    const fetchBlog = async () => {
      if (!noMore) {
        setFetching(true);
        const response = await AXIOS.get(`/blog/public?startFrom=${startFrom}`);
        // console.log(response.data.data.blogs[0]);
        if (response.data.data.blogs.length < 8) {
          // console.log("EMPTY RESPONSE");
          setNoMore(true);
        }
        // setBlogs((prev) => [...prev, ...response.data.data.blogs]);

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
      }
    };
    fetchBlog();
  }, [startFrom, noMore]);

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
    <div className="px-4 bg-red-500">
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

export default GlobalFeed;

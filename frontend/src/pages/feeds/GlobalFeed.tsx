import { useEffect, useState } from "react";
import { AXIOS } from "../../utils/axios";
import BlogCard from "../../Components/blog/BlogCard";
import ScrollBar from "../../Components/layout/ScrollBar";
import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";

export type CommentT = {
  createdAt: Date;
  isUpdated: boolean;
  parentId: string | null;
  commentId: string;
  User: {
    username: string;
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
  const navigate = useNavigate();
  // const { blogId } = useParams();
  useEffect(() => {
    const fetchBlog = async () => {
      const response = await AXIOS.get(`/blog/public`);
      console.log(response.data.data.blogs[0]);
      setBlogs(response.data.data.blogs);
      setLoading(false);
    };
    fetchBlog();
  }, []);

  const handleClick = (id: string) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className="px-4">
      <ScrollBar />
      {blogs.map((blog: BlogT) => {
        return (
          <BlogCard
            handleClick={handleClick}
            key={blog.blogId}
            blog={blog}
            loading={loading}
          />
        );
      })}
    </div>
  );
};

export default GlobalFeed;

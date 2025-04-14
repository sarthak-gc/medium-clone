import { useEffect, useState } from "react";
import { AXIOS } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { BlogT } from "./GlobalFeed";
import ScrollBar from "../../Components/layout/ScrollBar";
import Feed from "./Feed";

const FollowingFeed = () => {
  const [blogs, setBlogs] = useState<BlogT[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const { blogId } = useParams();
  useEffect(() => {
    const fetchBlog = async () => {
      const response = await AXIOS.get(`/blog/followings`, {
        // withCredentials: true,
      });
      console.log(response);
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
      {!loading && blogs.length === 0 && (
        <div className="w-full h-full  mt-50 text-center">
          No Blogs From Your Followings
        </div>
      )}
      <Feed handleClick={handleClick} loading={loading} blogs={blogs} />
    </div>
  );
};

export default FollowingFeed;

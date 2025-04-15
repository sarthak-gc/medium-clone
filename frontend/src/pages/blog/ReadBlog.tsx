import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AXIOS } from "../../utils/axios";

const ReadBlog = () => {
  const { blogId } = useParams();

  useEffect(() => {
    const getBlog = async () => {
      const response = await AXIOS.get(`/blog/${blogId}`);
      console.log(response);
    };
    getBlog();
  }, [blogId]);
  return (
    <div className="max-w-3xl mx-auto border-b border-gray-200 pt-8 py-4 px-0 flex gap-4 overflow-x-auto whitespace-nowrap  scrollbar-none relative overflow-y-hidden"></div>
  );
};

export default ReadBlog;

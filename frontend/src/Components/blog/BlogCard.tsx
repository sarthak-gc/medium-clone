import { useState } from "react";
import { BlogT } from "../../pages/feeds/GlobalFeed";
import ImageSkeleton from "../skeleton/ImageSkeleton";
import Comment from "../ui/Comment";
import Like from "../ui/Like";
import { useNavigate } from "react-router-dom";

type BlogCardProp = {
  blog: BlogT;
};
const BlogCard = ({ blog }: BlogCardProp) => {
  const [isLoading, setIsLoading] = useState(true);
  const [, flag] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleClick = (id: string) => {
    navigate(`/blog/${id}/read`, {
      state: {
        blogDetails: blog,
      },
    });
  };

  const toggleReactionOptions = () => {
    flag((prev) => !prev);
  };

  const handleProfileClick = (id: string) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto  border-b border-gray-200 p-5 px-0 cursor-pointer flex gap-12  ">
      <div className="w-3/4 flex-flex-col ">
        {/* Header: Author */}
        <div className="flex items-center  space-x-3 mb-4 h-6  w-fit z-0">
          <div
            onClick={() => handleProfileClick(blog.authorId)}
            className="w-6 h-6 p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          >
            {blog.User.username[0].toUpperCase()}
          </div>
          <div>
            <h2
              onClick={() => handleProfileClick(blog.authorId)}
              className="text-sm font-semibold text-gray-800"
            >
              {blog.User.username[0].toUpperCase() +
                blog.User.username.slice(1)}
            </h2>
          </div>
        </div>
        {/* Content */}

        <div className="mb-4 h-16 " onClick={() => handleClick(blog.blogId)}>
          <h1 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 ">
            {blog.title.slice(0, 100)}
          </h1>
          <p className="text-sm text-gray-500 line-clamp-2">
            {blog.content.slice(0, 100)}
          </p>
        </div>
        {/* Footer */}
        <div className="flex  text-xs text-gray-500  pt-3 mt-3 gap-4 h-6">
          <Like
            showReactionList={() => {
              navigate(`/blog/${blog.blogId}/reactions`);
            }}
            toggleReactionOptions={toggleReactionOptions}
            count={blog.Reactions.length}
          />
          <Comment count={blog.Comment.length} />
        </div>
      </div>

      <div className="w-1/3 aspect-video flex items-center justify-center text-center overflow-hidden relative">
        {isLoading && <ImageSkeleton />}

        <img
          src={`https://picsum.photos/320/200?random=${blog.blogId}`}
          alt="Blog cover"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export default BlogCard;

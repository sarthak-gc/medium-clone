import { BlogT } from "./GlobalFeed";
import BlogCardSkeleton from "../../Components/skeleton/BlogCardSkeleton";
import BlogCard from "../../Components/blog/BlogCard";

type FeedProps = {
  loading: boolean;
  blogs: BlogT[];
  handleClick: (id: string) => void;
};

const Feed = ({ loading, blogs, handleClick }: FeedProps) => {
  return (
    <>
      {loading ? (
        <div className="animate-pulse">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      ) : (
        blogs.map((blog: BlogT) => {
          return (
            <BlogCard handleClick={handleClick} key={blog.blogId} blog={blog} />
          );
        })
      )}
    </>
  );
};

export default Feed;

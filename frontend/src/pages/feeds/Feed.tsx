import { BlogT } from "./GlobalFeed";
import BlogCardSkeleton from "../../Components/skeleton/BlogCardSkeleton";
import BlogCard from "../../Components/blog/BlogCard";

type FeedProps = {
  loading: boolean;
  blogs: BlogT[];
};

const Feed = ({ loading, blogs }: FeedProps) => {
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
          return <BlogCard key={blog.blogId} blog={blog} />;
        })
      )}
    </>
  );
};

export default Feed;

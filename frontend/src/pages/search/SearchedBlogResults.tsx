import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AXIOS } from "../../utils/axios";
import { BlogT } from "../feeds/GlobalFeed";
import BlogCardSkeleton from "../../Components/skeleton/BlogCardSkeleton";
import BlogCard from "../../Components/blog/BlogCard";
import Header from "./Header";
import Spinner from "../../Components/loaders/Spinner";

const SearchedBlogResults = () => {
  const [startFrom, setStartFrom] = useState(0);
  const [isSearchDataLoading, setIsSearchDataLoading] = useState<boolean>(true);
  const [isMoreDataLoading, setIsMoreDataLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);

  const location = useLocation();

  const [results, setResults] = useState<BlogT[]>([]);
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  useEffect(() => {
    const getSearchResult = async () => {
      if (!searchQuery) return;

      setFetching(true);
      const response = await AXIOS.get(
        `/blog/search/${startFrom}?query=${searchQuery}`
      );

      if (!isMoreDataLoading) {
        setResults(response.data.data.blogs);
        setStartFrom(0);
        setIsMoreDataLoading(true);
        return;
      }
      // setIsMoreDataLoading(true);

      if (response.data.data.blogs.length < 5) {
        setIsMoreDataLoading(false);
        console.log("less than 5");
      } else {
        // setIsMoreDataLoading(true);
        console.log("more than 5");
      }

      // ajai xa vane, append garni

      setResults((prev) => {
        const newUsers = response.data.data.blogs;
        const uniqueUsers = new Map();
        prev.forEach((blog) => {
          uniqueUsers.set(blog.blogId, blog);
        });
        newUsers.forEach((blog: BlogT) => {
          uniqueUsers.set(blog.blogId, blog);
        });
        return Array.from(uniqueUsers.values());
      });

      setIsSearchDataLoading(false);
      setFetching(false);
    };
    console.log(isMoreDataLoading, " More data");

    getSearchResult();
  }, [startFrom, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 100 &&
        isMoreDataLoading &&
        !fetching
      ) {
        setStartFrom((prev) => prev + 5);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMoreDataLoading, fetching]);

  return (
    <div className="max-w-3xl md:mx-auto  pt-8 py-4 lg:px-0 md:space-y-7 space-y-3  px-4">
      <Header searchQuery={searchQuery} />
      {isSearchDataLoading && (
        <div>
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      )}
      {results.length === 0 && !isMoreDataLoading && (
        <ul className="list-none text-[#7e7e7e] mt-7">
          <li>Make sure all words are spelled correctly.</li>
          <li>Try different keywords.</li>
          <li>Try more general keywords.</li>
        </ul>
      )}
      {results.map((blog) => {
        return <BlogCard key={blog.blogId} blog={blog} />;
      })}

      {fetching && !isMoreDataLoading && <Spinner />}
      {!isMoreDataLoading && !fetching && results.length > 0 && (
        <>End of page</>
      )}
    </div>
  );
};

export default SearchedBlogResults;

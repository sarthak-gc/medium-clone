import { Link } from "react-router-dom";

const Header = ({ searchQuery }: { searchQuery: string | null }) => {
  return (
    <div>
      <h1 className="md:text-5xl font-semibold md:mt-5 text-2xl mt-3">
        <span className="text-gray-400 line-clamp-1">
          Results for <span className="text-black">{searchQuery}</span>
        </span>
      </h1>

      <div className="max-w-3xl lg:mx-auto border-b border-gray-200 py-4 px-0 flex gap-4 overflow-x-auto whitespace-nowrap  scrollbar-none relative overflow-y-hidden">
        <div className="flex gap-5 md:gap-10 overflow-x-auto scrollbar-none relative z-0">
          <Link
            className="flex-shrink-0 px-4 py-2 rounded w-1/6 text-start "
            to={`/search/blogs?q=${searchQuery}`}
          >
            Stories
          </Link>
          <Link
            className="flex-shrink-0 px-4 py-2 rounded w-1/6 text-start "
            to={`/search/users?q=${searchQuery}`}
          >
            People
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;

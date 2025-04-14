import { Link } from "react-router-dom";

const ScrollBar = () => {
  return (
    // <div className="max-w-3xl mx-auto border-b border-gray-200 pt-8 py-4 px-0 flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide scrollbar-none relative ">

    // </div>

    <div className="max-w-3xl mx-auto border-b border-gray-200 pt-8 py-4 px-0 flex gap-4 overflow-x-auto whitespace-nowrap  scrollbar-none relative overflow-y-hidden">
      <div className="pointer-events-none absolute -left-1 top-0 h-[89px] w-20 bg-gradient-to-r from-white to-transparent blur-md z-10">
        {" "}
      </div>

      <div className="pointer-events-none absolute -right-1 top-0 h-[89px] w-20 bg-gradient-to-l from-white to-transparent blur-md z-10">
        &gt;
      </div>

      {/* Scrollable Tab Container */}
      <div className="flex gap-4 overflow-x-auto whitespace-nowrap px-4 scrollbar-none relative z-0">
        <Link className="flex-shrink-0 px-4 py-2 rounded w-1/6" to={"/"}>
          For You
        </Link>
        <Link className="flex-shrink-0 px-4 py-2 rounded w-1/6" to={"/"}>
          Followings
        </Link>
        <Link className="flex-shrink-0 px-4 py-2 rounded w-1/6" to={"/"}>
          Programming
        </Link>
        <Link className="flex-shrink-0 px-4 py-2 rounded w-1/6" to={"/"}>
          Featured
        </Link>
        <Link className="flex-shrink-0 px-4 py-2 rounded w-1/6" to={"/"}>
          Technology
        </Link>
        <Link className="flex-shrink-0 px-4 py-2 rounded w-1/6" to={"/"}>
          Data Science
        </Link>
      </div>
    </div>
  );
};

export default ScrollBar;

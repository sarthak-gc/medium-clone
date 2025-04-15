import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="max-w-xl sm:mx-auto  p-5 px-0 flex flex-col items-center justify-center gap-12 mt-12 text-[#757575] ">
      <h1 className="mb-5">PAGE NOT FOUND</h1>
      <span className="text-6xl">404</span>
      <p className="text-3xl text-black">Out of nothing, something.</p>
      <p className="text-center">
        You can find (just about) anything on Medium — apparently even a page
        that doesn&apos;t exist. Maybe these stories will take you somewhere
        new?
      </p>
      <Link className="underline" to={"/home"}>
        Home
      </Link>

      {/* some Recommendations here */}

      <h1>Recommendations</h1>
    </div>
  );
};

export default NotFound;

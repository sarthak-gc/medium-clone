import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="max-w-xl sm:mx-auto  p-5 px-0 flex flex-col items-center justify-center gap-12 mt-12 text-[#757575] ">
      <h1 className="mb-5">ACCESS DENIED</h1>
      <span className="text-6xl">403</span>
      <p className="text-3xl text-black">
        You don't have permission to view this page.
      </p>

      <div className="flex flex-col items-center gap-10 ">
        <p className="text-center">
          <p className="flex flex-col gap-4">
            <span className="text-3xl">Looks like this page is protected</span>
            <span className=" mt-5 ">
              You can either{" "}
              <Link to={"/login"} className="underline">
                log in
              </Link>{" "}
              to continue
            </span>
            <span>or</span>

            <Link to="/" className="underline">
              continue reading for free.
            </Link>
          </p>
          <p></p>
        </p>

        <Link className="underline mt-5 " to={"/register"}>
          Join Now
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

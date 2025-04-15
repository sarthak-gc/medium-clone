import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpPopup from "../Components/modal/SignUpPopup";

const Home = () => {
  const navigate = useNavigate();
  const [popUp, setPopUp] = useState(false);
  return (
    <div
      className={`min-h-screen flex flex-col w-full h-screen overflow-hidden bg-[#f7f4ed]`}
      onClick={() => {
        if (popUp) {
          setPopUp(false);
        }
      }}
    >
      <nav
        className={`py-4 flex  justify-center items-center border-b border-black  ${
          popUp ? "blur-xs" : ""
        }`}
      >
        <div className="flex justify-between items-center  sm:w-3/5 w-4/5  ">
          <h1 className="text-2xl font-bold text-gray-900 gap-4">
            Medium Rare
          </h1>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => {
                setPopUp(true);
              }}
              className="text-black hover:text-gray-700 cursor-pointer"
            >
              Write
            </button>
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="text-black hover:text-gray-700 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setPopUp(true);
              }}
              className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-900 transition cursor-pointer"
            >
              Get Started
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => {
                setPopUp(true);
              }}
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main
        className={`flex flex-col justify-center items-center  h-screen  ${
          popUp ? "blur-sm" : ""
        }`}
      >
        <div className=" flex flex-col justify-center items-start w-3/5 ">
          <h2 className="text-5xl md:text-8xl font-bold mb-2 ">Human</h2>
          <h3 className="text-5xl md:text-8xl font-semibold mb-4">
            stories & ideas
          </h3>
          <p className="text-gray-600 max-w-xl mb-6 text-lg ">
            A place to read, write, and deepen your understanding
          </p>
          <button
            onClick={() => {
              setPopUp(true);
            }}
            className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 transition cursor-pointer"
          >
            Start Reading
          </button>
        </div>
      </main>

      <SignUpPopup popUp={popUp} />
    </div>
  );
};

export default Home;

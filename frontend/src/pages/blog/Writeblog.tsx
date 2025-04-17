import { useRef, useState } from "react";
import { AXIOS } from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";

const Writeblog = () => {
  const [title, setTitle] = useState<string>("");
  const [letGo, setLetGo] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [showLeft, setShowLeft] = useState<boolean>(true);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const titleAreaRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const navigate = useNavigate();
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // console.log("Publishing....");

      const response = await AXIOS.post("/blog/create", {
        title,
        content,
      });
      // console.log(response.data.data.blog);
      setIsPublished(true);
      setTimeout(() => {
        navigate(`/blog/${response.data.data.blog.blogId}/read`);
      }, 100);
    } catch (e) {
      console.log(e);
    } finally {
      setIsPublishing(false);
      setTimeout(() => {
        setIsPublished(false);
      }, 2000);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <nav className="w-full border-b border-gray-200 px-4 py-3 bg-white">
        {/* Desktop and Large screens: Logo, Search, Buttons, and Avatar */}
        <div className=" flex justify-between items-center">
          {/* Left Section: Logo + Search */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 cursor-pointer"
            >
              Medium Rare
            </Link>
          </div>

          {/* Right Section: Buttons + Avatar */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePublish}
              className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 transition cursor-pointer"
              disabled={isPublishing}
            >
              Publish
            </button>

            {/* Notification */}

            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-gray-500 hover:text-[#1f1e1e]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </>

            {/* Avatar placeholder */}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-white ">
              U
            </div>
          </div>
        </div>
      </nav>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="max-w-4xl mx-auto p-8 h-full relative"
      >
        {isPublishing && (
          <div className="p-4 text-white text-xl font-semibold w-full  text-center  top-0 absolute ">
            <span className="text-black">Publishing story...</span>
          </div>
        )}
        {isPublished && (
          <div className="p-4 text-white text-xl font-semibold w-full  text-center  top-0 absolute ">
            <span className="text-black">Story Published</span>
          </div>
        )}
        <div className=" relative ">
          <input
            ref={titleAreaRef}
            onKeyUp={(e) => {
              if (e.code === "Enter") {
                textAreaRef.current?.focus();
              }
            }}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            onBlur={() => setShowLeft(false)}
            onFocus={() => setShowLeft(true)}
            className={`w-full md:py-4 text-4xl font-medium  outline-none border-gray-300 md:border-l-1 md:px-4 ${
              title.length === 0 ? "caret-gray-300" : "caret-black"
            }  `}
          />
          {showLeft && (
            <span className="absolute text-sm text-gray-300 -left-10 top-1/2 transform -translate-y-1/2 hidden md:block">
              Title
            </span>
          )}
        </div>

        <div className="h-full">
          <textarea
            onKeyUp={(e) => {
              if (content.length === 0 && e.key === "Backspace" && letGo) {
                titleAreaRef.current?.focus();
              }
              if (content.length === 0) {
                setLetGo(true);
              }
            }}
            ref={textAreaRef}
            onChange={(e) => {
              setLetGo(false);
              setContent(e.target.value);
            }}
            name="content"
            id="content"
            placeholder={`Tell your story...`}
            className={`w-full text-lg mt-2  scrollbar-none font-light  outline-none placeholder-gray-300 md:px-4 h-7/8 resize-none ${
              content.length === 0 ? "caret-gray-300" : "caret-black"
            }`}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default Writeblog;

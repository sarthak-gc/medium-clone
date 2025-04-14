import ImageSkeleton from "./ImageSkeleton";

const BlogCardSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto  border-b border-gray-200 p-5 px-0 cursor-pointer flex gap-12  ">
      <div className="w-3/4 bg-white ">
        <div className="flex items-center  mb-4 h-6">
          <div className="w-6 h-6 p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm"></div>

          <h2 className="text-sm font-semibold text-gray-500 flex items-center bg-gray-200 ml-4  rounded-full">
            <div className=" dark:bg-gray-700 w-48 mb-4"></div>
          </h2>
        </div>

        <div className="mb-4 h-16">
          <h1 className="text-sm text-gray-500 h-4 rounded-full bg-gray-200">
            <div className=" bg-gray-200 rounded-full  max-w-[480px] mt-2.5"></div>
          </h1>
          <h1 className="text-sm text-gray-500 h-4 rounded-full bg-gray-200">
            <div className=" rounded-full max-w-[480px] mb-2.5"></div>
          </h1>
        </div>

        <div className="flex  text-xs text-gray-500  pt-3 mt-3 gap-4 h-6">
          <span className="flex gap-1 items-center">
            <span className="flex gap-1 items-center">
              <div className="w-4 h-4 p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm"></div>
            </span>
            <span className="flex gap-1 items-center">
              <div className="w-4 h-4 p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm"></div>
            </span>
          </span>
          <span className="flex gap-1 items-center">
            <span className="flex gap-1 items-center">
              <div className="w-4 h-4 p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm"></div>
            </span>
            <span className="flex gap-1 items-center">
              <div className="w-4 h-4 p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm"></div>
            </span>
          </span>
        </div>
      </div>

      <div className="w-1/3 aspect-video flex items-center justify-center text-center overflow-hidden relative">
        <ImageSkeleton />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;

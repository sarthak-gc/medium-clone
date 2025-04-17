const AvatarNameSkeleton = ({ small }: { small: boolean }) => {
  return (
    <div
      className={`flex justify-between   h-12 w-full 
      }`}
    >
      <div
        className="
      flex items-center space-x-3  w-full"
      >
        <div
          className={`   ${
            small ? "w-8 h-8" : "w-12 h-12"
          } p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm`}
        ></div>
        <div className="mb-4 h-16 w-1/5 mt-4 ">
          <h1 className="text-sm text-gray-500 h-4 rounded-full bg-gray-200">
            <div className=" bg-gray-200 rounded-full  max-w-[480px] mt-2.5"></div>
          </h1>
          <h1 className="text-sm text-gray-500 h-4 rounded-full bg-gray-200">
            <div className=" rounded-full max-w-[480px] mb-2.5"></div>
          </h1>
        </div>
      </div>
      <div className="mb-4 h-16 w-1/5 mt-2">
        <h1 className="text-sm text-gray-500 h-7 rounded-full bg-gray-200">
          <div className=" rounded-full"></div>
        </h1>
      </div>
    </div>
  );
};

export default AvatarNameSkeleton;

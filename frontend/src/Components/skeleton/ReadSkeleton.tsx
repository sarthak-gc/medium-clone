import AvatarNameSkeleton from "./AvatarNameSkeleton";
import ContentSkeleton from "./ContentSkeleton";
import ReactionSkelton from "./ReactionSkelton";

const ReadSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto border-b border-gray-200  p-4 gap-4 mt-8 animate-pulse">
      <h1 className="text-sm text-gray-500 h-10 rounded-full bg-gray-200">
        <div className=" bg-gray-200 rounded-full  max-w-[380px] mt-2.5"></div>
        <div className=" bg-gray-200 rounded-full  max-w-[480px] mt-2.5"></div>
      </h1>

      <div className="flex items-center space-x-3 my-8 h-12 ">
        <AvatarNameSkeleton small={false} />
      </div>
      <div className="text-[#353535]">
        <ContentSkeleton />
      </div>
      <div className="flex  text-xs text-gray-500  pt-3 mt-3 gap-4 h-6 mb-12">
        <ReactionSkelton />
      </div>
      <h1 className="text-2xl font-bold mb-3">Comments</h1>
      <div>
        <div className="space-x-3 my-8 h-12 ">
          <AvatarNameSkeleton small={false} />
          <ContentSkeleton />
          <AvatarNameSkeleton small={false} />
          <ContentSkeleton />
          <AvatarNameSkeleton small={false} />
          <ContentSkeleton />
        </div>
      </div>
    </div>
  );
};

export default ReadSkeleton;

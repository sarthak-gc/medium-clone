import React from "react";

const ReactionSkelton = () => {
  return (
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
  );
};

export default ReactionSkelton;

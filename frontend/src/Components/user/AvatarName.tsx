type AvatarNameProp = {
  username: string;
  createdAt: Date;
  small: boolean;
};
const AvatarName = ({ username, createdAt, small }: AvatarNameProp) => {
  return (
    <div
      className={`flex items-center space-x-3   h-12
      }`}
    >
      <div
        className={`   ${
          small ? "w-8 h-8" : "w-12 h-12"
        } p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm`}
      >
        {username[0] && username[0].toUpperCase()}
      </div>
      <div className={`flex flex-col   `}>
        <h2 className="text-sm font-semibold text-gray-800">
          {username[0] && username[0].toUpperCase() + username.slice(1)}
        </h2>
        <span>
          {new Date(createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};

export default AvatarName;

import { useNavigate } from "react-router-dom";

type AvatarNameProp = {
  username: string;
  createdAt?: Date;
  small: boolean;
  id: string;
};
const AvatarName = ({ username, createdAt, small, id }: AvatarNameProp) => {
  const navigate = useNavigate();
  const handleProfileClick = (id: string) => {
    console.log("User clicked");
    navigate(`/user/${id}`);
  };
  return (
    <div
      className={`flex items-center space-x-3   h-12
      }`}
      onClick={() => handleProfileClick(id)}
    >
      <div
        className={`   ${
          small ? "w-8 h-8" : "w-12 h-12"
        } p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm`}
      >
        {username[0] && username[0].toUpperCase()}
      </div>
      <div className={`flex flex-col`}>
        <h2 className="text-sm font-semibold text-gray-800">
          {username[0] && username[0].toUpperCase() + username.slice(1)}
        </h2>
        {createdAt && (
          <span>
            {new Date(createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default AvatarName;

import { UserT } from "../../pages/search/SearchedUserResults";

type UserCardProp = {
  user: UserT;
  handleClick: (id: string) => void;
  followUser: (id: string) => void;
};

const UserCard = ({ user, handleClick, followUser }: UserCardProp) => {
  return (
    <div
      onClick={() => handleClick(user.userId)}
      className="flex justify-between items-center  py-8 border-b-1 border-gray-300 cursor-pointer"
    >
      <div className="flex justify-between space-x-4 h-12  w-4/5">
        <div className="w-12 h-12 p-2 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {user.username[0].toUpperCase()}
        </div>
        <div className=" w-9/10">
          <h2 className="text-sm font-semibold text-gray-800">
            {user.username[0].toUpperCase() + user.username.slice(1)}
          </h2>
          <h2 className="text-sm font-medium text-gray-800 line-clamp-2 ">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus
            distinctio ullam officia! Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Voluptatum fuga eum delectus!
          </h2>
        </div>
      </div>

      <button
        onClick={() => followUser(user.userId)}
        className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 transition cursor-pointer"
      >
        Follow
      </button>
    </div>
  );
};

export default UserCard;

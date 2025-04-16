import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AXIOS } from "../../../utils/axios";
type Reaction = {
  User: {
    username: string;
  };
  type: string;
  userId: string;
};
const Reactions = () => {
  const { blogId } = useParams();
  const [reactions, setReactions] = useState<Reaction[]>([
    {
      User: {
        username: "",
      },
      type: "",
      userId: "",
    },
  ]);

  const reactionIcons: { [key: string]: string } = {
    heart: "❤️",
    like: "👍",
    laugh: "😂",
    angry: "😡",
    dislike: "👎",
  };

  useEffect(() => {
    const getReactions = async () => {
      const response = await AXIOS.get(`/blog/${blogId}/reactions`);
      setReactions(response.data.reactions);
    };
    getReactions();
  }, [blogId]);
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Reactions for Blog ID: {blogId}</h2>
      {reactions.length === 0 ? (
        <p>No reactions yet.</p>
      ) : (
        <div className="space-y-4 mt-4">
          {reactions.map((reaction) => (
            <div key={reaction.userId} className="flex items-center space-x-2">
              <span className="font-medium">{reaction.User.username}</span>
              <span className="text-lg">
                {reactionIcons[reaction.type.toLowerCase()]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reactions;

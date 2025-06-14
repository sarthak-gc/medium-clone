import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AXIOS } from "../../utils/axios";

import { BlogT } from "../feeds/GlobalFeed";
import AvatarName from "../../Components/user/AvatarName";
import Comment from "../../Components/ui/Comment";
import Like from "../../Components/ui/Like";
import ReadSkeleton from "../../Components/skeleton/ReadSkeleton";
import { useAppStore } from "../../store/appStore";

const ReadBlog = () => {
  const [blogDetails, setBlogDetails] = useState<BlogT>({
    blogId: "",
    title: "",
    content: "",
    authorId: "",
    Reactions: [],
    createdAt: new Date(),
    Comment: [],
    User: {
      username: "",
    },
  });
  const isLoggedIn = useAppStore.getState().isLoggedIn;
  const [loading, setLoading] = useState<boolean>(true);
  const { blogId } = useParams();
  const [comment, setComment] = useState<string>("");
  const location = useLocation();
  const { blogDetails: blog } = location.state || {};
  const [showReactionOptions, setShowReactionOptions] =
    useState<boolean>(false);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getBlog = async () => {
      const response = await AXIOS.get(`/blog/${blogId}`);

      setBlogDetails(response.data.data.blogs);
      setLoading(false);
    };
    if (!blog) {
      getBlog();
    } else {
      setBlogDetails(blog);
      setLoading(false);
    }
  }, [blogId, blog]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  const handleCommentSend = async (blogId: string) => {
    if (!isLoggedIn) {
      if (window.confirm("Login to comment")) {
        navigate("/login");
        // return;
      } else {
        return;
      }
    }
    setSending(true);
    const response = await AXIOS.post(`/blog/${blogId}/comment`, {
      comment,
    });
    setSending(false);

    const commentDetails = response.data.data.commentDetails;

    setComment("");
    blogDetails.Comment.push({
      createdAt: new Date(commentDetails.createdAt),
      isUpdated: false,
      parentId: commentDetails.parentId,
      commentId: commentDetails.commentId,
      User: {
        username: commentDetails.User.username,
        userId: commentDetails.User.userId,
      },
      content: comment,
    });
  };

  const setReaction = async (reactionType: string, blogId: string) => {
    await AXIOS.post(`/blog/${blogId}/react`, {
      type: reactionType,
    });

    setShowReactionOptions(false);
  };

  const toggleReactionOptions = () => {
    setShowReactionOptions((prev) => !prev);
  };
  useEffect(() => {
    adjustHeight();
  }, [comment]);
  if (loading) return <ReadSkeleton />;

  return (
    <div className="max-w-3xl mx-auto border-b border-gray-200  p-4 gap-4 mt-8">
      <p className="w-full font-bold text-[2.5rem] leading-tight">
        {blogDetails.title}
      </p>

      <div className="flex items-center space-x-3 my-8 h-12 ">
        <AvatarName
          username={blogDetails.User.username}
          id={blogDetails.authorId}
          createdAt={blogDetails.createdAt}
          small={false}
        />
      </div>

      <div
        className="text-[#353535]"
        dangerouslySetInnerHTML={{ __html: blogDetails.content }}
      />

      <div className="flex text-xs text-gray-500 pt-3 mt-3 gap-4 h-6 mb-12 relative">
        {showReactionOptions && (
          <ul className="flex space-x-4 p-4 rounded-lg absolute -top-10 -left-10">
            {[
              {
                icon: "❤️",
                label: "Heart",
                bgColor: "bg-red-500",
                action: "Heart",
              },
              {
                icon: "👍",
                label: "Like",
                bgColor: "bg-blue-600",
                action: "Like",
              },
              {
                icon: "😂",
                label: "Laugh",
                bgColor: "bg-yellow-600",
                action: "Laugh",
              },
              {
                icon: "😡",
                label: "Angry",
                bgColor: "bg-orange-600",
                action: "Angry",
              },
              {
                icon: "👎",
                label: "Dislike",
                bgColor: "bg-gray-600",
                action: "Dislike",
              },
            ].map(({ icon, label, bgColor, action }) => (
              <li className="relative group" key={action}>
                <button
                  className={`p-3 rounded-full text-white ${bgColor} transform transition-transform duration-300 ease-in-out hover:scale-110 active:scale-90`}
                  onClick={() => {
                    const emoji = document.querySelector(`#emoji-${action}`);
                    emoji?.classList.add("shatter");
                    setTimeout(() => {
                      toggleReactionOptions();
                      setReaction(action, blogDetails.blogId);
                    }, 300);
                  }}
                  id={`emoji-${action}`}
                >
                  {icon}
                </button>
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Like
          showReactionList={() => {
            navigate(`/blog/${blogId}/reactions`);
          }}
          toggleReactionOptions={toggleReactionOptions}
          count={blogDetails.Reactions.length}
        />
        <Comment count={blogDetails.Comment.length} />
      </div>

      <h1 className="text-2xl font-bold mb-3">Comments</h1>

      {blogDetails.Comment.length === 0 && <h1>No responses yet</h1>}
      {blogDetails.Comment.map((comment) => (
        <div key={comment.commentId} className="border-t border-gray-300 py-4">
          <AvatarName
            username={comment.User.username}
            id={comment.User.userId}
            createdAt={comment.createdAt}
            small={true}
          />
          <div className=" mt-2">{comment.content}</div>
        </div>
      ))}
      <div className="w-full bg-[#f2f2f2] mt-10 p-4">
        <textarea
          ref={textareaRef}
          placeholder="What are your thoughts...."
          onChange={(e) => {
            setComment(e.target.value);
          }}
          value={comment}
          className="outline-none resize-none w-full"
          style={{ minHeight: "10px" }}
        />
        <div className="flex w-full justify-end gap-4">
          <button onClick={() => setComment("")}>Cancel</button>
          <button
            onClick={() => handleCommentSend(blogDetails.blogId)}
            className={` px-6 py-2 text-sm text-white rounded-full ${
              !sending && comment.length > 0
                ? "bg-black cursor-pointer"
                : "bg-[#dbdbdb] cursor-not-allowed"
            }`}
            disabled={sending}
          >
            Respond
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadBlog;

import { useParams } from "react-router-dom";
import ScrollBar from "../../Components/layout/ScrollBar";

const Random = () => {
  const { feedName } = useParams();

  return (
    <div className="px-4">
      <ScrollBar />

      <div className="w-full h-full  mt-50 text-center">
        <h1>{feedName}</h1>
        <div>This is a just a placeholder page, no content here </div>
      </div>
    </div>
  );
};

export default Random;

import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import SkeletonLoad from "./SkeletonLoad";

const ItemLoading = () => {
  return (
    <div className="p-5 mb-5 rounded-lg border-2">
      <div>
        <div className="mb-2">
          <SkeletonLoad width="75%" height={25} />
          <SkeletonLoad width="50%" height={25} />
          <SkeletonLoad width="25%" height={25} />
        </div>
        <div className="flex items-center">
          <SkeletonLoad className="" width={200} />
          <span className="mx-4"> - </span>
          <SkeletonLoad width={150} />
        </div>
        <div className="mb-5">
          <div className="flex flex-row items-center my-1">
            <HiOutlineCalendar className="mr-2" />
            <span>
              <SkeletonLoad width={150} />{" "}
            </span>
          </div>
          <div className="flex flex-row items-center mb-1">
            <HiOutlineClock className="mr-2" />
            <span>
              <SkeletonLoad width={150} />{" "}
            </span>
          </div>
          <div className="flex flex-row items-center">
            <HiOutlineLocationMarker className="mr-2" />
            <span>
              <SkeletonLoad width={150} />{" "}
            </span>
          </div>
          <div className="flex flex-row items-center mt-4">
            <HiOutlineQuestionMarkCircle className="mr-2" />
            <span>
              <SkeletonLoad width={150} />{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemLoading;

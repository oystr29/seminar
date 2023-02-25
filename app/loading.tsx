import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function Loading() {
  return (
    <div className="overflow-y-hidden h-screen">
      <div className="p-1 px-2 mb-2 rounded-xl mt-3 text-base border-2 text-blue-300 border-blue-800 w-max">
        Loading...
      </div>
      {[1, 2, 3, 4, 5].map(() => (
        <div className="border-2 border-blue-800 rounded-lg p-5 mb-4">
          <Skeleton width="100%" height={20} />
          <Skeleton width="50%" height={20} />
          <Skeleton width="5%" height={10} className="inline" />
          <HiOutlineCalendar className="inline mr-4" />
          <Skeleton width="10%" height={10} className="inline-block" />
          <HiOutlineClock className="inline mr-4" />
          <Skeleton width="10%" height={10} className="inline-block" />
          <HiOutlineLocationMarker className="inline mr-4" />
          <Skeleton width="10%" height={10} className="inline-block" />
          <Skeleton width="10%" height={10} className="mt-5" />
        </div>
      ))}
    </div>
  );
}

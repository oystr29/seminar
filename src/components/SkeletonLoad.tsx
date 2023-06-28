import Skeleton, { SkeletonProps } from "react-loading-skeleton";

const SkeletonLoad = (props: SkeletonProps) => {
  return <Skeleton {...props} baseColor="#334155" highlightColor="#475569" />;
};

export default SkeletonLoad;

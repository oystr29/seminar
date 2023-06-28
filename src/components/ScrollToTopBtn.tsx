import { HiOutlineChevronUp } from "react-icons/hi";

const ScrollToTopBtn = () => {
  return (
    <HiOutlineChevronUp
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="p-1 text-3xl rounded-full hover:bg-black bg-black/60"
    />
  );
};

export default ScrollToTopBtn;

import { HiOutlineChevronDown } from "react-icons/hi";

const ScrollToBottomBtn = () => {
  return (
    <HiOutlineChevronDown
      onClick={() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
      }
      className="p-1 text-3xl rounded-full hover:bg-black bg-black/60"
    />
  );
};

export default ScrollToBottomBtn;

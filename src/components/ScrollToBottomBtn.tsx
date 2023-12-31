import { ChevronDownCircle } from "lucide-react";

const ScrollToBottomBtn = () => {
  return (
    <ChevronDownCircle
      size={32}
      onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
      className="p-1 rounded-full hover:text-white text-white/60"
    />
  );
};

export default ScrollToBottomBtn;

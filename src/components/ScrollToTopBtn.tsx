import { ChevronUpCircle } from "lucide-react";
const ScrollToTopBtn = () => {
  return (
    <ChevronUpCircle
      size={32}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="p-1 rounded-full hover:text-white text-white/60"
    />
  );
};

export default ScrollToTopBtn;

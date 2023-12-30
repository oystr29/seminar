import NextJSIcon from "./icon/NextJSIcon";
import TailwindCSSIcon from "./icon/TailwindIcon";
import TrpcIcon from "./icon/trpc-icon";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center py-5 bg-gray-800">
      <div className="flex items-center">
        <p className="mr-3 text-sm text-gray-300">Made with</p>
        <a target="_blank" rel="noopener noreferrer" href="https://nextjs.org/">
          <NextJSIcon className="mr-3 h-3 fill-white" />
        </a>
        <a target="_blank" rel="noopener noreferrer" href="https://tailwindcss.com/">
          <TailwindCSSIcon className="mr-3 h-6" />
        </a>
        <a target="_blank" rel="noopener noreferrer" href="https://trpc.io/">
          <TrpcIcon className="h-6" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

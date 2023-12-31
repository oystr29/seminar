import Logo from "./Logo";
import DriveIcon from "./icon/DriveIcon";
import GithubIcon from "./icon/GithubIcon";
import InstagramIcon from "./icon/InstagramIcon";
import NextJSIcon from "./icon/NextJSIcon";
import SheetIcon from "./icon/SheetIcon";
import TailwindCSSIcon from "./icon/TailwindIcon";
import TrpcIcon from "./icon/trpc-icon";

const Footer = () => {
  return (
    <footer className=" py-5 bg-gray-800 ">
      <div className="flex flex-col md:flex-row justify-between items-center container mx-auto gap-5">
        <div className="flex gap-1 items-center">
          <Logo />
          <p className="text-xl">🤝</p>
          <a target="_blank" rel="noopener noreferrer" href="https://s.id/JadwalSeminarSkripsi">
            <SheetIcon className="h-6 w-6" />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://drive.google.com/drive/folders/1odU5XG7fKW_Cwfu0Z12VSsEV9jYLPqeE?usp=drive_link"
          >
            <DriveIcon className="h-6" />
          </a>
        </div>
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
        <div className="flex items-center">
          <a
            title="Source Code"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/oktoala/seminar"
          >
            <GithubIcon className="h-6 w-6 mr-3" />
          </a>
          <a
            title="Instagram ku"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/oystr_29"
          >
            <InstagramIcon className="h-6 w-6 " />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

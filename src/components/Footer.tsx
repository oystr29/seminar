import Link from "next/link";
import NextJSIcon from "./icon/NextJSIcon";
import TailwindCSSIcon from "./icon/TailwindIcon";
import TrpcIcon from "./icon/trpc-icon";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center py-5 bg-gray-800">
      {/* <div> */}
      {/*   <a */}
      {/*     href="https://s.id/JadwalSeminarSkripsi" */}
      {/*     target="_blank" */}
      {/*     rel="noreferrer" */}
      {/*     className="mr-5 font-bold text-green-500 cursor-pointer hover:text-green-300 hover:underline" */}
      {/*   > */}
      {/*     Source Data */}
      {/*   </a> */}
      {/*   <a */}
      {/*     href="https://github.com/oktoala/seminar" */}
      {/*     target="_blank" */}
      {/*     rel="noreferrer" */}
      {/*     className="font-bold text-fuchsia-500 cursor-pointer hover:text-fuchsia-300 hover:underline" */}
      {/*   > */}
      {/*     Source Code */}
      {/*   </a> */}
      {/* </div> */}
      <div className="flex items-center">
        <p className="mr-3 text-sm text-gray-300">Made with</p>
        <Link href="https://nextjs.org/">
          <NextJSIcon className="mr-3 h-3 fill-white" />
        </Link>
        <Link href="https://tailwindcss.com/">
          <TailwindCSSIcon className="mr-3 h-6" />
        </Link>
        <Link href="https://trpc.io/">
          <TrpcIcon className="h-6" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

import Logo from "~/components/Logo";
import { useScrollDirection } from "~/utils/scroll";
import Link from "next/link";
import { useRouter } from "next/router";
import { Download, Files, Home } from "lucide-react";
import { cn } from "~/lib/utils";

type HeaderProps = {
  isInstall: boolean;
  listenUserAction: () => void;
};

const links: { name: string; href: string; out?: boolean; icon: JSX.Element }[] = [
  { name: "Home", href: "/", icon: <Home className="block md:hidden" /> },
  { name: "Berkas", href: "/berkas", icon: <Files className="block md:hidden" /> },
  // { name: "Sheet", href: "https://s.id/JadwalSeminarSkripsi", out: true },
  // {
  //   name: "Donasi",
  //   href: "https://trakteer.id/oktavian_yoga/tip?open=true",
  //   out: true,
  // },
  // { name: "Github", href: "https://github.com/oktoala/seminar", out: true },
];

export default function Header({ isInstall, listenUserAction }: HeaderProps) {
  const router = useRouter();

  const scrollDirection = useScrollDirection();

  return (
    <nav
      className={`bg-gray-800 z-50 sticky ${
        scrollDirection === "down" ? "-top-24" : "top-0"
      } transition-all duration-500`}
    >
      <div className="container flex flex-wrap justify-between items-center p-4 mx-auto">
        <Link href="/" className="flex items-center">
          <Logo />
          <span className="self-center ml-4 text-xl md:text-2xl font-semibold whitespace-nowrap dark:text-white">
            Seminar IF
          </span>
        </Link>
        <div className="items-center flex">
          <div
            className={`pr-4 flex items-center gap-5 ${
              !isInstall ? "border-r border-r-gray-500" : ""
            }`}
          >
            {links.map((link) =>
              link.out ? (
                <a
                  className="relative text-gray-300 hover:text-white hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  key={link.href}
                  href={link.href}
                >
                  {link.icon}
                  <p className="hidden md:block">{link.name}</p>
                </a>
              ) : (
                <Link
                  className={`${
                    router.pathname === link.href ? "text-white font-bold neon" : "text-gray-300"
                  } hover:underline hover:text-white`}
                  key={link.href}
                  href={link.href}
                >
                  {link.icon}
                  <p className="hidden md:block">{link.name}</p>
                </Link>
              )
            )}
          </div>
          <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Install"
            className={cn(
              "bg-gradient-to-r md:p-0 md:bg-clip-text md:text-transparent hover:underline ml-4 from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 font-semibold",
              "text-white p-1 rounded-lg",
              isInstall ? "hidden" : "block"
            )}
            onClick={listenUserAction}
          >
            <Download className="block md:hidden" />
            <p className="md:block hidden">Install</p>
          </button>
        </div>
      </div>
    </nav>
  );
}

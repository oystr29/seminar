import Logo from "~/components/Logo";
import { useScrollDirection } from "~/utils/scroll";
import Link from "next/link";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FiArrowUpRight } from "react-icons/fi";
import { useRouter } from "next/router";

type HeaderProps = {
  isInstall: boolean;
  listenUserAction: () => void;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
};

const links: { name: string; href: string; out?: boolean }[] = [
  { name: "Home", href: "/" },
  { name: "Berkas", href: "/docs" },
  { name: "Sheet", href: "https://s.id/JadwalSeminarSkripsi", out: true },
  { name: "Github", href: "https://github.com/oktoala/seminar", out: true },
];

export default function Header({
  isInstall,
  listenUserAction,
  setOpenSheet,
}: HeaderProps) {
  const router = useRouter();

  const scrollDirection = useScrollDirection();

  return (
    <nav
      className={`bg-gray-800 z-50 sticky ${scrollDirection === "down" ? "-top-24" : "top-0"
        } transition-all duration-500`}
    >
      <div className="container flex flex-wrap justify-between items-center p-4 mx-auto">
        <Link href="/" className="flex items-center">
          <Logo />
          <span className="self-center ml-4 text-2xl font-semibold whitespace-nowrap dark:text-white">
            Seminar IF
          </span>
        </Link>
        <div className="hidden items-center sm:flex">
          <div
            className={`pr-4 flex items-center gap-5 ${!isInstall ? "border-r border-r-gray-500" : ""
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
                  {link.name}
                  <FiArrowUpRight className="absolute top-0 text-xs -right-[11px]" />
                </a>
              ) : (
                <Link
                  className={`${router.pathname === link.href
                      ? "text-white font-bold neon"
                      : "text-gray-300"
                    } hover:underline hover:text-white`}
                  key={link.href}
                  href={link.href}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
          <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Install"
            className={`${isInstall ? "hidden" : "block"
              } bg-gradient-to-r bg-clip-text text-transparent hover:underline ml-4 from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600  font-semibold`}
            onClick={listenUserAction}
          >
            Install
          </button>
        </div>
        <HiOutlineMenuAlt3
          className="block w-8 h-8 sm:hidden"
          onClick={() => setOpenSheet(true)}
        />
      </div>
    </nav>
  );
}

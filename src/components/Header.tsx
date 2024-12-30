import Logo from "~/components/Logo";
import { useScrollDirection } from "~/utils/scroll";
import Link from "next/link";
import { useRouter } from "next/router";
import { Download, ScrollText, SearchIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";
import { type ChangeEventHandler, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { trpc } from "~/utils/trpc";

type HeaderProps = {
  isInstall: boolean;
  listenUserAction: () => void;
};

const links: {
  name: string;
  href: string;
  out?: boolean;
  icon: JSX.Element;
}[] = [
  {
    name: "Berkas",
    href: "/berkas",
    icon: <ScrollText className="" />,
  },
  // { name: "Sheet", href: "https://s.id/JadwalSeminarSkripsi", out: true },
  // {
  //   name: "Donasi",
  //   href: "https://trakteer.id/oktavian_yoga/tip?open=true",
  //   out: true,
  // },
  // { name: "Github", href: "https://github.com/oktoala/seminar", out: true },
];

export default function Header({ isInstall, listenUserAction }: HeaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { s, dir } = router.query;

  const { data: folders } = trpc.docs.folder.useQuery(undefined, {
    enabled: pathname === "/berkas",
  });

  const currFolder = folders?.filter((f, i) => (dir ? f.id === dir : i === 0));
  const textSearchBerkas = currFolder ? `- ${currFolder[0].name}` : "";

  const scrollDirection = useScrollDirection();

  const handleSearch = useDebouncedCallback<
    ChangeEventHandler<HTMLInputElement>
  >((e) => {
    router.replace(
      {
        pathname: "",
        query: {
          ...router.query,
          s: e.target.value,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  }, 500);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <nav
      className={cn(
        "bg-gray-900/90 border-b border-gray-600 z-50 fixed transition-all duration-500 supports-[backdrop-filter]:bg-gray-900/80 left-0 right-0 top-0 px-4 py-2.5 backdrop-blur",
      )}
      /* className={` ${
        scrollDirection === "down" ? "-top-24" : "top-0"
      } transition-all duration-500`} */
    >
      <div className="container flex sm:justify-between items-center mx-auto gap-4">
        <Link href="/" className="flex items-center">
          <Logo />
          <div className="self-center ml-4 hidden sm:flex items-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Seminar{" "}
            {pathname === "/berkas" && (
              <div className="rounded-full text-xs font-bold px-1.5 p-1 bg-gray-800 ml-1">
                Berkas
              </div>
            )}
          </div>
        </Link>
        <div className="items-center flex gap-4 flex-1 sm:flex-none">
          <div className="relative flex-1 sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground">
              <SearchIcon size={18} />
            </div>
            <input
              defaultValue={s}
              ref={inputRef}
              onChange={handleSearch}
              className="flex peer h-10 w-full rounded-md border border-gray-600 px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-900/10 pl-10 focus:border-violet-600"
              placeholder={
                pathname === "/"
                  ? "Cari Judul, Nama, atau NIM"
                  : `Cari Berkas ${textSearchBerkas}`
              }
              type="search"
            />
            <kbd className="peer-focus:hidden pointer-events-none absolute right-2.5 top-2.5 hidden h-5 select-none items-center gap-1 rounded bg-gray-800 px-1 font-mono text-[10px] font-medium text-gray-100 opacity-100 md:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          {links.map((link) =>
            link.out ? (
              <a
                className={cn(
                  "relative text-gray-500 hover:opacity-90",
                  link.href === pathname && "text-white",
                )}
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
                data-tooltip-id="tooltip"
                data-tooltip-content="Berkas"
                className={`${
                  router.pathname === link.href
                    ? "text-white font-bold neon"
                    : "text-gray-300"
                } hover:underline hover:text-white`}
                key={link.href}
                href={link.href}
              >
                {link.icon}
              </Link>
            ),
          )}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Install"
            className={cn(
              "bg-gradient-to-r  from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 font-semibold",
              "text-white p-1 rounded-lg",
              isInstall ? "hidden" : "block",
            )}
            onClick={listenUserAction}
          >
            <Download size={20} className="" />
          </button>
        </div>
      </div>
    </nav>
  );
}

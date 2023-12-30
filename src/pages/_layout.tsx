import type React from "react";
import { useEffect, useState } from "react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Sheet from "react-modal-sheet";
import { useRouter } from "next/router";
import ScrollToBottomBtn from "~/components/ScrollToBottomBtn";
import ScrollToTopBtn from "~/components/ScrollToTopBtn";
import { FiArrowUpRight } from "react-icons/fi";
import { HiDownload, HiOutlineDocumentDuplicate, HiOutlineHome } from "react-icons/hi";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";
import { VscGithubAlt } from "react-icons/vsc";
import { TbCoffee } from "react-icons/tb";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "~/components/ErrorPage";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

const links: Array<{
  icon: JSX.Element;
  name: string;
  href: string;
  out?: boolean;
}> = [
  { icon: <HiOutlineHome className="w-5 h-5" />, name: "Home", href: "/" },
  {
    icon: <HiOutlineDocumentDuplicate className="w-5 h-5" />,
    name: "Berkas",
    href: "/docs",
  },
  {
    icon: <BsFileEarmarkSpreadsheet className="w-5 h-5" />,
    name: "Sheet",
    href: "https://s.id/JadwalSeminarSkripsi",
    out: true,
  },
  {
    icon: <TbCoffee className="w-5 h-5" />,
    name: "Donasi",
    href: "https://trakteer.id/oktavian_yoga/tip?open=true",
    out: true,
  },
  {
    icon: <VscGithubAlt className="w-5 h-5" />,
    name: "Github",
    href: "https://github.com/oktoala/seminar",
    out: true,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isOpenSheet } = router.query;
  const onChangeOpenSheet = async (isOpenSheet: string | undefined) => {
    await router.push({
      pathname: "",
      query: { ...router.query, isOpenSheet },
    });
  };

  const [, setOpenSheet] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstall, setIsInstall] = useState(true);

  async function listenUserAction() {
    setIsInstall(true);
    await deferredPrompt?.prompt();
    // Wait for the user to respond to the prompt
    await deferredPrompt?.userChoice.then(() => {
      setDeferredPrompt(null);
    });
  }

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI to notify the user they can add to home screen
      setIsInstall(false);
    });
  }, []);

  return (
    <>
      <Header
        isInstall={isInstall}
        listenUserAction={listenUserAction}
        setOpenSheet={() => onChangeOpenSheet("1")}
      />
      <main className="container px-4 mt-10 h-full min-h-screen sm:px-0 sm:mx-auto">
        <div className="flex fixed right-5 bottom-5 flex-col gap-2 justify-center items-center">
          <ScrollToTopBtn />
          <ScrollToBottomBtn />
        </div>
        <ErrorBoundary fallback={<ErrorPage emoji="😭" />}>{children}</ErrorBoundary>
      </main>
      <Sheet
        isOpen={!!isOpenSheet}
        onClose={async () => {
          onChangeOpenSheet(undefined);
        }}
        snapPoints={[600, 400, 0]}
        initialSnap={1}
      >
        <Sheet.Container>
          <Sheet.Header className="bg-gray-800" />
          <Sheet.Content className="bg-gray-800">
            <div className="py-5 w-full">
              <div className={`${!isInstall ? "border-b border-b-gray-400" : ""}`}>
                {links.map((link) => (
                  <button
                    key={link.href}
                    onClick={async () => {
                      setOpenSheet(false);
                      if (link.out) {
                        window.open(link.href, "_blank")?.focus();
                      } else {
                        await router.push(link.href);
                      }
                    }}
                    className="py-3 px-2 w-full text-left border-b border-b-gray-500"
                  >
                    <div className="flex relative items-center w-min">
                      {link.icon}
                      <p className="ml-2">{link.name}</p>
                      {link.out && (
                        <FiArrowUpRight className="absolute top-0 text-xs -right-[11px]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={listenUserAction}
                className={`${
                  isInstall ? "hidden" : "block"
                } w-full flex items-center py-3 px-2 text-left mb-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 text-white focus:outline-none font-semibold`}
              >
                <HiDownload className="w-5 h-5 text-white fill-white" />
                <p className="ml-2">Install</p>
              </button>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          onTap={() => {
            onChangeOpenSheet(undefined);
          }}
        />
      </Sheet>
      <Footer />
    </>
  );
}

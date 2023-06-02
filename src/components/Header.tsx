import { useEffect, useState } from "react";
import {
  InstallDesktopIcon,
  InstallMobileIcon,
} from "~/components/InstallIcon";
import { BiFolder, BiFolderOpen } from "react-icons/bi";
import Logo from "~/components/Logo";
import { useScrollDirection } from "~/utils/scroll";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import Sheet from "react-modal-sheet";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

interface BeforeInstallPromptEvent extends Event {
  /**
   *
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}
export default function Header() {
  const details = typeof window !== "undefined" ? navigator.userAgent : "";

  const router = useRouter();

  const [isOpen, setOpen] = useState(false);

  const isMobileDevice = /android|iphone|kindle|ipad/i.test(details);

  const scrollDirection = useScrollDirection();

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstall, setIsInstall] = useState(true);

  function listenUserAction() {
    setIsInstall(true);
    deferredPrompt?.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt?.userChoice.then((choiceResult) => {
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
    <nav
      className={`bg-gray-900 z-50 sticky ${
        scrollDirection === "down" ? "-top-24" : "top-0"
      } transition-all duration-500`}
    >
      <div className="container flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="">
          <a className="flex items-center">
            <Logo />
            <span className="self-center ml-4 text-2xl font-semibold whitespace-nowrap dark:text-white">
              Seminar IF
            </span>
          </a>
        </Link>
        <div className="items-center hidden sm:flex">
          <div className={`pr-4 ${!isInstall && "border-r border-r-gray-500"}`}>
            <Link href="docs">
              <a
                className={`${
                  router.pathname === "/docs"
                    ? "text-white font-bold neon"
                    : "text-gray-300"
                } hover:underline`}
              >
                Berkas
              </a>
            </Link>
          </div>
          <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Install"
            className={`${
              isInstall ? "hidden" : "block"
            } bg-gradient-to-r ml-4 from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 text-white  rounded-lg focus:outline-none px-5 py-2 font-semibold`}
            onClick={listenUserAction}
          >
            Install
          </button>
        </div>
        <HiOutlineMenuAlt3
          className="h-8 w-8 sm:hidden block"
          onClick={() => setOpen(true)}
        />
        <Sheet
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          // detent="content-height"
          snapPoints={[0.5]}
          initialSnap={0}
        >
          <Sheet.Container>
            <Sheet.Header className="bg-gray-800" />
            <Sheet.Content className="bg-gray-800">
              <div className="w-full py-5 px-3">
                <div
                  className={`pb-4 ${
                    !isInstall && "border-b border-b-gray-400"
                  }  mb-4`}
                >
                  <Link href="docs">
                    <button className="rounded-lg bg-gray-950 w-full py-1 px-2 text-left ">
                      Berkas
                    </button>
                  </Link>
                </div>
                <button
                  onClick={listenUserAction}
                  className={`${
                    isInstall ? "hidden" : "block"
                  } rounded-lg w-full py-1 px-2 text-left mb-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 text-white focus:outline-none font-semibold`}
                >
                  Install
                </button>
              </div>
            </Sheet.Content>
          </Sheet.Container>

          <Sheet.Backdrop onTap={() => setOpen(false)} />
        </Sheet>
      </div>
      <Tooltip id="my-tooltip" />
    </nav>
  );
}

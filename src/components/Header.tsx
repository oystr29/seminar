import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "~/components/Logo";
import { useScrollDirection } from "~/utils/scroll";
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
        <a href="/" className="flex items-center">
          {/* <Image width={32} height={32} src={Logo} className="h-6 w-6 " /> */}
          <Logo />
          <span className="self-center ml-4 text-2xl font-semibold whitespace-nowrap dark:text-white">
            Seminar IF
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <button
            className={`${
              isInstall ? "hidden" : "block"
            } bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 text-white  rounded-lg focus:outline-none px-5 py-2 font-semibold`}
            onClick={listenUserAction}
          >
            Install
          </button>
        </div>
      </div>
    </nav>
  );
}

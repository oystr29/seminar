import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  /**
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
export default function Layout({ children }: { children: React.ReactNode }) {
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
    <>
      <main className="container mx-auto mt-10">
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="text-5xl font-bold mb-5 text-center">
            Jadwal Seminar Informatika
          </h1>
          <button
            className={`${
              isInstall ? "hidden" : "block"
            } bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 text-white  rounded-lg focus:outline-none px-5 py-2 font-semibold`}
            onClick={listenUserAction}
          >
            Install
          </button>
        </div>

        {children}
      </main>
    </>
  );
}

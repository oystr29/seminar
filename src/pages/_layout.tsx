import React, { useEffect, useState } from "react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Sheet from "react-modal-sheet";
import Link from "next/link";
import { useRouter } from "next/router";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState(false);

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
      <Header isInstall={isInstall} listenUserAction={listenUserAction} setOpenSheet={setOpenSheet} />
      <main className="container px-4 sm:px-0 sm:mx-auto mt-10 min-h-screen h-full">
        {children}
      </main>
      <Sheet
        isOpen={openSheet}
        onClose={() => setOpenSheet(false)}
        snapPoints={[600, 400, 100, 0]}
        initialSnap={1}
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
                  <button onClick={() => {
                    router.push('/');
                    setOpenSheet(false);
                  }} className="rounded-lg bg-gray-950 w-full mb-3 py-1 px-2 text-left ">
                    Home
                  </button>
                  <button onClick={() => {
                    router.push('docs');
                    setOpenSheet(false);
                  }} className="rounded-lg bg-gray-950 w-full py-1 px-2 text-left ">
                    Berkas
                  </button>
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

        <Sheet.Backdrop onTap={() => setOpenSheet(false)} />
      </Sheet>
      <Footer />
    </>
  );
}

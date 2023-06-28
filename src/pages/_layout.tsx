import { useEffect, useState } from "react";
import type React from "react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Sheet from "react-modal-sheet";
import { useRouter } from "next/router";
import ScrollToBottomBtn from "~/components/ScrollToBottomBtn";
import ScrollToTopBtn from "~/components/ScrollToTopBtn";
import { FiArrowUpRight } from "react-icons/fi";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const links: { name: string; href: string; out?: boolean }[] = [
  { name: "Home", href: "/" },
  { name: "Berkas", href: "/docs" },
  { name: "Sheet", href: "https://s.id/JadwalSeminarSkripsi", out: true },
  { name: "Github", href: "https://github.com/oktoala/seminar", out: true },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState(false);

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
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
        setOpenSheet={setOpenSheet}
      />
      <main className="container px-4 mt-10 h-full min-h-screen sm:px-0 sm:mx-auto">
        <div className="flex fixed right-5 bottom-5 flex-col gap-2 justify-center items-center">
          <ScrollToTopBtn />
          <ScrollToBottomBtn />
        </div>
        {children}
      </main>
      <Sheet
        isOpen={openSheet}
        onClose={() => setOpenSheet(false)}
        snapPoints={[600, 400, 0]}
        initialSnap={1}
      >
        <Sheet.Container>
          <Sheet.Header className="bg-gray-800" />
          <Sheet.Content className="bg-gray-800">
            <div className="py-5 px-3 w-full">
              <div
                className={`pb-4 ${!isInstall ? "border-b border-b-gray-400" : ""
                  }  mb-4`}
              >
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
                    className="py-1 px-2 mb-3 w-full text-left rounded-lg bg-gray-950"
                  >
                    <div className="relative w-min">
                      {link.name}
                      {link.out && (
                        <FiArrowUpRight className="absolute top-0 text-xs -right-[11px]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={listenUserAction}
                className={`${isInstall ? "hidden" : "block"
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

import type React from "react";
import { useEffect, useState } from "react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import ScrollToBottomBtn from "~/components/ScrollToBottomBtn";
import ScrollToTopBtn from "~/components/ScrollToTopBtn";

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

export default function Layout({ children }: { children: React.ReactNode }) {
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
      <Header isInstall={isInstall} listenUserAction={listenUserAction} />
      <main className="container px-4 mt-10 h-full min-h-screen sm:px-0 sm:mx-auto">
        <div className="flex fixed right-5 bottom-5 flex-col gap-2 justify-center items-center">
          <ScrollToTopBtn />
          <ScrollToBottomBtn />
        </div>
        <ErrorBoundary fallback={<ErrorPage emoji="😭" />}>{children}</ErrorBoundary>
      </main>

      <Footer />
    </>
  );
}

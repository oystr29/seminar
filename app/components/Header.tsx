"use client";
import { useEffect, useState } from "react";
import { Seminar } from "../..";

export default function Header() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>();
  const [isInstall, setIsInstall] = useState(true);
  function listenUserAction() {
    setIsInstall(true);
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
    });
  }

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      e;
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setIsInstall(false);
    });
  }, []);
  return (
    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className="text-5xl font-bold mb-5 text-center">
        Jadwal Seminar Informatika
      </h1>
      <button
        className={`${
          isInstall ? "hidden" : "block"
        } bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600  text-white  rounded-lg focus:outline-none px-5 py-2 font-semibold`}
        onClick={listenUserAction}
      >
        Install
      </button>
    </div>
  );
}

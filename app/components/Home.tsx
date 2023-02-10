"use client";

import { useEffect, useState } from "react";
import { DataSem } from "../..";
import Item from "./Item";




export default ({ currents, scheduled, notyet, passed }: DataSem) => {

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstall, setIsInstall] = useState(true);

  function listenUserAction() {
    setIsInstall(true);
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      setDeferredPrompt(null);
    });
  }

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setIsInstall(false);
    });
  }, []);

  return <div
    className="container 
    mx-auto mt-10"
  >
    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className="text-5xl font-bold mb-5 text-center">
        Jadwal Seminar Informatika
      </h1>
      <button
        className={`${isInstall ? "hidden" : "block"} bg-gradient-to-r ${currents.length !== 0
          ? " from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 "
          : " from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          } text-white  rounded-lg focus:outline-none px-5 py-2 font-semibold`}
      // onClick={listenUserAction}
      >
        Install
      </button>
    </div>
    {currents.length !== 0 &&
      currents.map((e, i) => {
        return <Item e={e} key={e.nim + i} classes="current" />;
      })}
    {notyet.length !== 0 && (
      <div className="p-1 px-2 mb-2 rounded-xl mt-3 text-base border-2 text-purple-300 border-purple-800 w-max">
        Coming Soon!
      </div>
    )}
    {notyet.map((e, i) => {
      return <Item e={e} key={e.nim + i} classes="notyet" />;
    })}
    {scheduled.length !== 0 && (
      <div className="p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-yellow-300 border-yellow-800 w-max">
        Belum Ada Jadwalnya
      </div>
    )}
    {scheduled.map((e, i) => {
      return <Item e={e} key={e.nim + i} classes="scheduled" />;
    })}
    {passed.length !== 0 && (
      <div className="p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-gray-300 border-gray-500 w-max">
        Udah Lewat
      </div>
    )}
    {passed
      .map((e, i) => {
        return <Item e={e} key={e.nim + i} classes="passed" />;
      })
      .reverse()}
    <div className="flex justify-center items-center py-5">
      <a
        href="https://s.id/JadwalSeminarSkripsi"
        target="_blank"
        rel="noreferrer"
        className="mr-5 text-green-500 hover:underline font-bold cursor-pointer hover:text-green-300"
      >
        Source Data
      </a>
      <a
        href="https://github.com/oktoala/seminar"
        target="_blank"
        rel="noreferrer"
        className="text-fuchsia-500 hover:underline font-bold cursor-pointer hover:text-fuchsia-300"
      >
        Source Code
      </a>
    </div>
  </div>
}
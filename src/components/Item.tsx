import {
  CalendarDays,
  Clock,
  FileText,
  GraduationCap,
  MapPin,
  Presentation,
} from "lucide-react";
import FlipClockCountdown from "~/components/FlipClockCountdown";
import { cn } from "~/lib/utils";
import type { Seminar } from "~/server/routers/hello";
import { trpc } from "~/utils/trpc";
import { useCallback, useRef, useEffect } from "react";
import { Fireworks, type FireworksHandlers } from "@fireworks-js/react";

type TypeSem = "current" | "notyet" | "scheduled" | "passed";

const iconSize = 18;
const nimble = `${process.env.NEXT_PUBLIC_NIMBLE}`;
const Item = (props: { e: Seminar; type: TypeSem }) => {
  const ref = useRef<FireworksHandlers>(null);
  const utils = trpc.useContext();

  const { e, type } = props;

  const isNimble = nimble === `${e.nim}`;

  const fillin = useCallback(
    (current: string, notyet: string, done?: string) => {
      if (type === "current") return current;
      if (type === "notyet") return notyet;

      return done ?? "#020617";
    },
    [type],
  );

  useEffect(() => {
    if (isNimble) {
      ref.current?.updateOptions({
        opacity: 0.5,
        rocketsPoint: {
          min: 0,
          max: 100,
        },
        delay: {
          min: 60,
          max: 100,
        },
        hue: {
          min: 0,
          max: 345,
        },
      });
    }
  }, []);

  return (
    <>
      <div
        className={cn(
          "mb-5 border-2 rounded-lg text-white relative",
          type !== "current" && "p-5",
          type === "scheduled" && "border-yellow-400",
          type === "notyet" && "border-purple-400",
          type === "passed" && "text-gray-400, border-gray-500",
          type === "current" &&
            "p-0.5 bg-gradient-to-tr from-green-500 border-none to-sky-500",
          isNimble &&
            type === "current" &&
            "animate-border bg-[length:300%_300%] relative overflow-hidden",
        )}
        /* className={`mb-5 border-2 rounded-lg ${
        type !== "current" ? "p-5" : ""
      }  text-white ${getClasess(type)}`} */
      >
        {isNimble && type === "current" && (
          <Fireworks
            ref={ref}
            className="top-0 z-0 left-0 absolute w-full h-full"
          />
        )}
        <div
          className={`${
            type === "current" ? "gradient rounded-lg bg-gray-900 p-4" : ""
          }${type === "passed" ? "text-gray-400" : ""}`}
        >
          <div className={`font-bold text-xl mb-2 z-10 relative`}>
            {e.judul}
          </div>
          <div className="z-10 relative">
            <span className="font-semibold">{e.nama} </span>
            <span> - </span>
            <span className="font-semibold">{e.nim}</span>
          </div>
          <div className="mb-5 z-10 relative">
            {e.date.day.hari !== "" && (
              <div className="flex flex-row items-center my-1">
                {isNimble ? (
                  <svg
                    className="mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#cfd8dc"
                      d="M5 38V14h38v24c0 2.2-1.8 4-4 4H9c-2.2 0-4-1.8-4-4"
                    ></path>
                    <path
                      fill={
                        type === "current"
                          ? "#36f485"
                          : type === "notyet"
                            ? "#8536f4"
                            : "#000"
                      }
                      d="M43 10v6H5v-6c0-2.2 1.8-4 4-4h30c2.2 0 4 1.8 4 4"
                    ></path>
                    <g
                      fill={
                        type === "current"
                          ? "#1cb789"
                          : type === "notyet"
                            ? "#7c1cb7"
                            : "#000"
                      }
                    >
                      <circle cx={33} cy={10} r={3}></circle>
                      <circle cx={15} cy={10} r={3}></circle>
                    </g>
                    <path
                      fill="#b0bec5"
                      d="M33 3c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2M15 3c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2V5c0-1.1-.9-2-2-2"
                    ></path>
                    <path
                      fill="#90a4ae"
                      d="M13 20h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm-18 6h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm-18 6h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4z"
                    ></path>
                  </svg>
                ) : (
                  <CalendarDays size={iconSize} className="mr-2" />
                )}
                <span>
                  {e.date.day.hari}, {e.date.day.tanggal} {e.date.day.bulanAsli}{" "}
                  {e.date.day.tahun}
                </span>
              </div>
            )}
            {e.date.time.jamMulai && (
              <div className="flex flex-row items-center mb-1 z-10 relative">
                {isNimble ? (
                  <svg
                    className="mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 128 128"
                  >
                    <path
                      fill="#82aec0"
                      d="M32.04 123.67a3.12 3.12 0 0 1-1.55-3.8l4.02-11.77l7.87 5.31l-6.36 9.24a3.13 3.13 0 0 1-3.98 1.02m63.32 0c1.39-.7 2.06-2.32 1.55-3.8l-4.07-11.91l-8.29 4.77l6.83 9.92a3.13 3.13 0 0 0 3.98 1.02"
                    ></path>
                    <path
                      fill="#2f7889"
                      d="m34.51 108.1l-2.05 6c1.27-.73 2.93-.66 4.25-.01s2.33 1.79 3.1 3.05l2.33-3.38c0-.14-7.63-5.66-7.63-5.66m58.36-.15l2.22 6.6c-1.27-.73-2.79-.71-4.12-.06c-1.32.65-2.33 1.79-3.1 3.05l-3.05-4.43z"
                    ></path>
                    <circle
                      cx={63.7}
                      cy={73.93}
                      r={42.01}
                      fill="#ffefa1"
                    ></circle>
                    <circle
                      cx={63.7}
                      cy={70.22}
                      r={49.36}
                      fill={fillin("#29cc72", "#8829cc")}
                    ></circle>
                    <circle
                      cx={63.7}
                      cy={72.7}
                      r={46.4}
                      fill={fillin("#38ff98", "#8e38ff")}
                    ></circle>
                    <circle
                      cx={63.7}
                      cy={72.7}
                      r={40.03}
                      fill="#fafafa"
                    ></circle>
                    <circle
                      cx={64}
                      cy={72.7}
                      r={4.45}
                      fill={fillin("#285641", "#402856")}
                    ></circle>
                    <path
                      fill={fillin("#7cb296", "#9b7cb2")}
                      d="M63.7 42.57c-.81 0-1.47-.66-1.47-1.47v-4.4c0-.81.66-1.47 1.47-1.47s1.47.66 1.47 1.47v4.4c0 .81-.66 1.47-1.47 1.47m0 67.59c-.81 0-1.47-.66-1.47-1.47v-4.4c0-.81.66-1.47 1.47-1.47s1.47.66 1.47 1.47v4.4c0 .81-.66 1.47-1.47 1.47m35.99-36h-4.4c-.81 0-1.47-.66-1.47-1.47s.66-1.47 1.47-1.47h4.4c.81 0 1.47.66 1.47 1.47c0 .82-.66 1.47-1.47 1.47m-67.58 0h-4.4c-.81 0-1.47-.66-1.47-1.47s.66-1.47 1.47-1.47h4.4c.81 0 1.47.66 1.47 1.47c0 .82-.66 1.47-1.47 1.47"
                    ></path>
                    <path
                      fill={fillin("#7cb296", "#9b7cb2")}
                      d="M63.7 42.57c-.81 0-1.47-.66-1.47-1.47v-4.4c0-.81.66-1.47 1.47-1.47s1.47.66 1.47 1.47v4.4c0 .81-.66 1.47-1.47 1.47m0 67.59c-.81 0-1.47-.66-1.47-1.47v-4.4c0-.81.66-1.47 1.47-1.47s1.47.66 1.47 1.47v4.4c0 .81-.66 1.47-1.47 1.47M46.63 46.07l-2.2-3.81c-.41-.7-.17-1.6.54-2.01c.7-.41 1.6-.17 2.01.54l2.2 3.81c.41.7.17 1.6-.54 2.01c-.7.4-1.6.16-2.01-.54m33.8 58.53l-2.2-3.81c-.41-.7-.16-1.6.54-2.01s1.6-.16 2.01.54l2.2 3.81c.41.7.16 1.6-.54 2.01c-.71.4-1.61.16-2.01-.54"
                    ></path>
                    <path
                      fill={fillin("#7cb296", "#9b7cb2")}
                      d="m46.63 46.07l-2.2-3.81c-.41-.7-.17-1.6.54-2.01c.7-.41 1.6-.17 2.01.54l2.2 3.81c.41.7.17 1.6-.54 2.01c-.7.4-1.6.16-2.01-.54m33.8 58.53l-2.2-3.81c-.41-.7-.16-1.6.54-2.01s1.6-.16 2.01.54l2.2 3.81c.41.7.16 1.6-.54 2.01c-.71.4-1.61.16-2.01-.54M35.61 58.17l-3.81-2.2c-.7-.41-.94-1.3-.54-2.01c.41-.7 1.3-.94 2.01-.54l3.81 2.2c.7.41.94 1.3.54 2.01c-.41.71-1.31.95-2.01.54m58.53 33.79l-3.81-2.2c-.7-.41-.94-1.3-.54-2.01c.41-.7 1.3-.94 2.01-.54l3.81 2.2c.7.41.94 1.3.54 2.01c-.41.71-1.31.95-2.01.54M78.76 46.61c-.7-.41-.94-1.3-.54-2.01l2.2-3.81c.41-.7 1.3-.94 2.01-.54c.7.41.94 1.3.54 2.01l-2.2 3.81c-.41.7-1.3.94-2.01.54m-33.79 58.53c-.7-.41-.94-1.3-.54-2.01l2.2-3.81c.41-.7 1.3-.94 2.01-.54c.7.41.94 1.3.54 2.01l-2.2 3.81c-.41.7-1.31.94-2.01.54m44.82-47.51c-.41-.7-.17-1.6.54-2.01l3.81-2.2c.7-.41 1.6-.16 2.01.54s.16 1.6-.54 2.01l-3.81 2.2c-.71.41-1.61.17-2.01-.54m-58.53 33.8c-.41-.7-.16-1.6.54-2.01l3.81-2.2c.7-.41 1.6-.16 2.01.54s.16 1.6-.54 2.01l-3.81 2.2c-.71.4-1.61.16-2.01-.54"
                    ></path>
                    <path
                      fill="none"
                      stroke={fillin("#28563e", "#412856")}
                      strokeLinecap="round"
                      strokeMiterlimit={10}
                      strokeWidth={5}
                      d="M47.49 63.49L63.7 72.7"
                    ></path>
                    <path
                      fill="none"
                      stroke={fillin("#28563e", "#412856")}
                      strokeLinecap="round"
                      strokeMiterlimit={10}
                      strokeWidth={3.5}
                      d="M86.87 59.41L64.44 72.7"
                    ></path>
                    <path
                      fill="#82aec0"
                      d="m91.99 32.49l-4.14-2.71l14.09-24.96l4.3 2.43z"
                    ></path>
                    <path
                      fill={fillin("#29cc72", "#7829cc")}
                      d="M111.17 35.21c1.23.36 2.55-.32 2.93-1.54c3.24-10.35-.96-21.61-11.12-26.84c-10.23-5.27-21.34-1.81-27.81 7.02c-.73.99-.56 2.38.36 3.19c2.09 1.85 6.73 5.33 15.98 10.01c9.77 4.94 16.47 7.22 19.66 8.16"
                    ></path>
                    <path
                      fill="#82aec0"
                      d="M105.85 10.3s2.61-3.33-1.18-5.44c-2.95-1.64-4.82 1.95-4.82 1.95c-.65 1.19 5.55 4.31 6 3.49M35.63 32.52L21.36 7.25l4.31-2.43l13.86 24.56z"
                    ></path>
                    <path
                      fill={fillin("#29cc72", "#7829cc")}
                      d="M16.83 35.21c-1.23.36-2.55-.32-2.93-1.54c-3.24-10.35.96-21.61 11.12-26.84c10.23-5.27 21.34-1.81 27.81 7.02c.73.99.56 2.38-.36 3.19c-2.09 1.85-6.73 5.33-15.98 10.01c-9.77 4.94-16.47 7.22-19.66 8.16"
                    ></path>
                    <path
                      fill="#82aec0"
                      d="M22.15 10.3s-2.61-3.33 1.18-5.44c2.95-1.64 4.82 1.95 4.82 1.95c.65 1.19-5.55 4.31-6 3.49"
                    ></path>
                    <path
                      fill="none"
                      stroke="#82aec0"
                      strokeMiterlimit={10}
                      strokeWidth={3.71}
                      d="M63.7 23.22V9.5"
                    ></path>
                    <path
                      fill="#82aec0"
                      d="M63.76 14.38c-3.92 0-7.85-1.5-7.85-1.5V9.91s3.65-1.63 8.04-1.63s7.65 1.63 7.65 1.63v2.97c.01.01-3.91 1.5-7.84 1.5"
                    ></path>
                    <path
                      fill="#94d1e0"
                      d="M56.9 9.79c-.43.16-.47.75-.07.98c.58.33 1.27.67 1.51.63c3.3-.51 8.09-.26 11.4.24c.23.04.89-.52 1.36-.94c.26-.24.2-.65-.12-.8c-1.04-.47-3.39-1.31-7.03-1.31c-3.36 0-5.79.71-7.05 1.2"
                    ></path>
                    <path
                      fill={fillin("#38ff88", "#9f38ff")}
                      d="M95.06 7.9c.31 1.06-.83 1.93-1.75 2.54a15.76 15.76 0 0 0-5.4 6.22c-.58 1.2-1.23 2.67-2.56 2.86c-.53.07-1.05-.09-1.55-.27c-.77-.28-1.52-.6-2.25-.97c-.87-.44-1.76-1-2.16-1.89c-.52-1.17-.03-2.55.67-3.63c1.67-2.55 4.39-4.13 7.19-5.17c1.69-.63 6.97-2.56 7.81.31m-68.93 8.43c.65 1.35 1.38 2.66 2.19 3.92c.99 1.54 2.14 3.26 1.72 5.04c-.49 2.04-2.75 3.02-4.74 3.7c-1.02.35-2.03.7-3.05 1.05c-.54.19-1.11.38-1.68.35c-.9-.04-1.71-.61-2.22-1.34c-.52-.73-.78-1.61-.98-2.48c-.75-3.35-.6-6.9.43-10.18c.6-1.88 1.54-3.86 3.67-4.01c2.59-.18 3.69 1.93 4.66 3.95"
                    ></path>
                  </svg>
                ) : (
                  <Clock className="mr-2" size={iconSize} />
                )}
                <span>
                  {e.date.time.jamMulai} - {e.date.time.jamAkhir} WITA
                </span>
              </div>
            )}
            {e.jadwal.ruang && (
              <div className="flex flex-row items-center z-10 relative">
                {isNimble ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="mr-2 "
                  >
                    <path
                      fill={fillin("#44ef83", "#9a44ef", "#64748b")}
                      d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"
                    ></path>
                  </svg>
                ) : (
                  <MapPin className="mr-2" size={iconSize} />
                )}
                <span>{e.jadwal.ruang}</span>
              </div>
            )}
            {e.sempro && (
              <div className="flex flex-row items-center mt-4 z-10 relative">
                {isNimble ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="mr-2 text-gray-500"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M14.25 2.5a.25.25 0 0 0-.25-.25H7A2.75 2.75 0 0 0 4.25 5v14A2.75 2.75 0 0 0 7 21.75h10A2.75 2.75 0 0 0 19.75 19V9.147a.25.25 0 0 0-.25-.25H15a.75.75 0 0 1-.75-.75zm.75 9.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5zm0 4a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M15.75 2.824c0-.184.193-.301.336-.186q.182.147.323.342l3.013 4.197c.068.096-.006.22-.124.22H16a.25.25 0 0 1-.25-.25z"
                    ></path>
                  </svg>
                ) : (
                  <FileText className="mr-2" size={iconSize} />
                )}
                <span>Seminar Proposal</span>
              </div>
            )}
            {e.semhas && (
              <div className="flex flex-row items-center mt-4 z-10 relative">
                {isNimble ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="mr-2"
                  >
                    <g fill="none">
                      <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                      <path
                        fill={fillin("#44ef83", "#9a44ef")}
                        d="M21 3a1 1 0 1 1 0 2v11a2 2 0 0 1-2 2h-5.055l2.293 2.293a1 1 0 0 1-1.414 1.414l-2.828-2.828l-2.829 2.828a1 1 0 0 1-1.414-1.414L10.046 18H5a2 2 0 0 1-2-2V5a1 1 0 0 1 0-2zm-5 4a1 1 0 0 0-.993.883L15 8v5a1 1 0 0 0 1.993.117L17 13V8a1 1 0 0 0-1-1m-4 2a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1m-4 2a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0v-1a1 1 0 0 0-1-1"
                      ></path>
                    </g>
                  </svg>
                ) : (
                  <Presentation size={iconSize} className="mr-2" />
                )}
                {/* <HiPresentationChartLine className="mr-2" /> */}
                <span>Seminar Hasil</span>
              </div>
            )}
            {e.pendadaran && (
              <div className="flex flex-row items-center mt-4 z-10 relative">
                {isNimble ? (
                  <div className="mr-2">🎓</div>
                ) : (
                  <GraduationCap size={iconSize + 2} className="mr-2" />
                )}

                {/* <MdSchool className="mr-2" /> */}
                <span>Sidang Akhir</span>
              </div>
            )}
          </div>
          {Date.now() <= e.dateInt.akhir && type === "current" && (
            <div className="z-10 relative">
              <div className="mb-2 font-medium">Berakhir dalam:</div>
              <FlipClockCountdown
                showSeparators={false}
                className="flip-clock"
                labels={["Hari", "Jam", "Menit", "Detik"]}
                onComplete={async () => {
                  await utils.hello.seminar.refetch();
                }}
                to={e.dateInt.akhir}
              />
            </div>
          )}
          {Date.now() <= e.dateInt.mulai && type === "notyet" && (
            <div className="z-10 relative">
              <div className="mb-2 font-medium">Dimulai dalam:</div>
              <FlipClockCountdown
                showSeparators={false}
                className="flip-clock"
                labels={["Hari", "Jam", "Menit", "Detik"]}
                onComplete={async () => {
                  await utils.hello.seminar.refetch();
                }}
                to={e.dateInt.mulai}
              />
            </div>
          )}
          {/* {type !== "passed" && (
          <div className="w-full flex justify-end">
            <ShareLink e={e} />
          </div>
        )} */}
        </div>
      </div>
    </>
  );
};
export default Item;

import Countdown, { CountdownRenderProps } from "react-countdown";
import {
  HiDocument,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiPresentationChartLine,
} from "react-icons/hi";
import { MdSchool } from "react-icons/md";
import FlipClockCountdown from "~/components/FlipClockCountdown";
import { Seminar } from "~/server/routers/hello";
import { trpc } from "~/utils/trpc";

const Time = ({ count, time }: { count: string; time: string }) => {
  if (count === "00" && time !== "Detik") return null;

  return (
    <div className="flex flex-col justify-center items-center mr-2">
      <div
        suppressHydrationWarning={true}
        className="p-1 mb-1 w-7 text-sm text-center bg-black rounded-lg text-zinc-50"
      >
        {count}
      </div>
      <div className="text-zinc-100">{time}</div>
    </div>
  );
};

type TypeSem = "current" | "notyet" | "scheduled" | "passed";

const Item = (props: { e: Seminar; type: TypeSem }) => {
  const utils = trpc.useContext();

  const getClasess = (t: TypeSem) => {
    let className = "";
    if (t === "current") {
      className = "p-1 bg-gradient-to-tr from-green-500 border-none to-sky-500";
    } else if (t === "scheduled") {
      className = "border-yellow-400";
    } else if (t === "notyet") {
      className = "border-purple-400";
    } else if (t === "passed") {
      className = "text-gray-400 border-gray-500";
    }
    return className;
  };

  const { e, type } = props;

  return (
    <div
      className={`mb-5 border-2 rounded-lg ${type !== "current" && "p-5"
        }  text-white ${getClasess(type)}`}
    >
      <div
        className={`${type === "current" ? "gradient rounded-lg bg-gray-950 p-4" : ""
          }${type === "passed" ? "text-gray-500" : ""}`}
      >
        <div className={`font-bold text-xl mb-2 `}>{e.judul}</div>
        <div className="">
          <span className="font-semibold">{e.nama} </span>
          <span> - </span>
          <span className="font-semibold">{e.nim}</span>
        </div>
        <div className="mb-5">
          {e.date.day.hari !== "" && (
            <div className="flex flex-row items-center my-1">
              <HiOutlineCalendar className="mr-2" />
              <span>
                {e.date.day.hari}, {e.date.day.tanggal} - {e.date.day.bulanAsli}{" "}
                - {e.date.day.tahun}
              </span>
            </div>
          )}
          {e.date.time && (
            <div className="flex flex-row items-center mb-1">
              <HiOutlineClock className="mr-2" />
              <span>
                {e.date.time.jamMulai} - {e.date.time.jamAkhir} WITA
              </span>
            </div>
          )}
          {e.jadwal.ruang !== "" && (
            <div className="flex flex-row items-center">
              <HiOutlineLocationMarker className="mr-2" />
              <span>{e.jadwal.ruang}</span>
            </div>
          )}
          {e.sempro && (
            <div className="flex flex-row items-center mt-4">
              <HiDocument className="mr-2" />
              <span>Seminar Proposal</span>
            </div>
          )}
          {e.semhas && (
            <div className="flex flex-row items-center mt-4">
              <HiPresentationChartLine className="mr-2" />
              <span>Seminar Hasil</span>
            </div>
          )}
          {e.pendadaran && (
            <div className="flex flex-row items-center mt-4">
              <MdSchool className="mr-2" />
              <span>Sidang Akhir</span>
            </div>
          )}
        </div>
        {Date.now() <= e.dateInt.akhir && type === "current" && (
          <>
            <div className="mb-2 font-medium">Berakhir dalam:</div>
            <FlipClockCountdown
              showSeparators={false}
              className="flip-clock"
              labels={["Hari", "Jam", "Menit", "Detik"]}
              onComplete={() => {
                utils.hello.seminar.refetch();
              }}
              to={e.dateInt.akhir}
            />
          </>
        )}
        {Date.now() <= e.dateInt.mulai && type === "notyet" && (
          <div>
            <div className="mb-2 font-medium">Dimulai dalam:</div>
            <FlipClockCountdown
              showSeparators={false}
              className="flip-clock"
              labels={["Hari", "Jam", "Menit", "Detik"]}
              onComplete={() => {
                utils.hello.seminar.refetch();
              }}
              to={e.dateInt.mulai}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Item;

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
import { Meteors } from "~/components/Meteors";

type TypeSem = "current" | "notyet" | "scheduled" | "passed";

const nimble = `${process.env.NEXT_PUBLIC_NIMBLE}`;
const Item = (props: { e: Seminar; type: TypeSem }) => {
  const utils = trpc.useContext();

  const { e, type } = props;

  const isNimble = nimble === `${e.nim}`;

  return (
    <div
      className={cn(
        "mb-5 border-2 rounded-lg text-white ",
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
      {isNimble && type === "current" && <Meteors number={20} />}
      <div
        className={`${
          type === "current" ? "gradient rounded-lg bg-gray-900 p-4" : ""
        }${type === "passed" ? "text-gray-400" : ""}`}
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
              {isNimble ? (
                <div className="mr-2">📅</div>
              ) : (
                <CalendarDays size={16} className="mr-2" />
              )}
              <span>
                {e.date.day.hari}, {e.date.day.tanggal} {e.date.day.bulanAsli}{" "}
                {e.date.day.tahun}
              </span>
            </div>
          )}
          {e.date.time.jamMulai && (
            <div className="flex flex-row items-center mb-1">
              {isNimble ? (
                <div className="mr-2">🕙</div>
              ) : (
                <Clock className="mr-2" size={16} />
              )}
              <span>
                {e.date.time.jamMulai} - {e.date.time.jamAkhir} WITA
              </span>
            </div>
          )}
          {e.jadwal.ruang !== "" && (
            <div className="flex flex-row items-center">
              {isNimble ? (
                <div className="mr-2">📍</div>
              ) : (
                <MapPin className="mr-2" size={16} />
              )}
              <span>{e.jadwal.ruang}</span>
            </div>
          )}
          {e.sempro && (
            <div className="flex flex-row items-center mt-4">
              {isNimble ? (
                <div className="mr-2">📄</div>
              ) : (
                <FileText className="mr-2" size={16} />
              )}
              <span>Seminar Proposal</span>
            </div>
          )}
          {e.semhas && (
            <div className="flex flex-row items-center mt-4">
              {isNimble ? (
                <div className="mr-2">📈</div>
              ) : (
                <Presentation size={16} className="mr-2" />
              )}
              {/* <HiPresentationChartLine className="mr-2" /> */}
              <span>Seminar Hasil</span>
            </div>
          )}
          {e.pendadaran && (
            <div className="flex flex-row items-center mt-4">
              {isNimble ? (
                <div className="mr-2">🎓</div>
              ) : (
                <GraduationCap size={16} className="mr-2" />
              )}

              {/* <MdSchool className="mr-2" /> */}
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
              onComplete={async () => {
                await utils.hello.seminar.refetch();
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
              onComplete={async () => {
                await utils.hello.seminar.refetch();
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

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import type { Seminar } from "~/server/routers/hello";

function getType(sempro: boolean, semhas: boolean, sidang: boolean) {
  if (sempro) return "Seminar Proposal";
  if (semhas) return "Seminar Hasil";
  if (sidang) return "Sidang Akhir";
  return "";
}

const baseURL = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export default function ShareLink({ e }: { e: Seminar }) {
  const [isCopied, setIsCopied] = useState(false);
  // This is the function we wrote earlier
  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    }
  }

  const date =
    e.date.day.hari !== ""
      ? `&date=${e.date.day.hari}, ${e.date.day.tanggal} ${e.date.day.bulanAsli} ${e.date.day.tahun}`
      : "";
  const time = e.date.time.jamMulai
    ? `&time=${e.date.time.jamMulai} - ${e.date.time.jamAkhir} WITA`
    : "";
  const place = e.jadwal.ruang ? `&place=${e.jadwal.ruang}` : "";

  const typee = getType(e.sempro, e.semhas, e.pendadaran);
  const type = typee ? `&type=${typee}` : "";

  const url = new URL(
    `${baseURL}?title=${e.judul}&name=${e.nama}&nim=${e.nim}${date}${time}${place}${type}`,
  );

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(url.toString())
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <button onClick={handleCopyClick} className="" type="button">
        {isCopied ? <Check /> : <Share2 />}
      </button>
    </>
  );
}

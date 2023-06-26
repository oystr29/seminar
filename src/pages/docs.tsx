import Link from "next/link";
import ErrorPage from "~/components/ErrorPage";
import { trpc } from "~/utils/trpc";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonLoad from "~/components/SkeletonLoad";
import { useEffect, useState } from "react";

const Page = () => {
  const [isPWA, setIsPWA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: pklData, isError: errorPKL } = trpc.docs.pkl.useQuery();
  const { data: skripsiData, isError: skripsiError } =
    trpc.docs.skripsi.useQuery();

  const { data: suratData, isError: errorSurat } =
    trpc.docs.keterangan.useQuery();

  const arrayLoading = Array.from({ length: 6 }, (_, i) => i);

  if (errorPKL || skripsiError || errorSurat) {
    return <ErrorPage />;
  }

  // if (!pklData || !skirpsiData || !suratData) return null;
  //
  useEffect(() => {
    setIsPWA(window.matchMedia("(display-mode: standalone)").matches);
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  return (
    <>
      <section className="mb-10">
        {isMobile && isPWA && (
          <div
            className="flex p-4 mb-4 text-sm text-yellow-800 bg-yellow-50 rounded-lg border border-yellow-300"
            role="alert"
          >
            <svg
              aria-hidden="true"
              className="inline flex-shrink-0 mr-3 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Info</span>
            <div>
              {isMobile && (
                <>
                  Untuk mendownload file, tahan salah satu file, lalu buka di
                  tab baru.
                </>
              )}
              {isPWA && (
                <>
                  Buka halaman ini di{" "}
                  <a
                    href="/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline"
                  >
                    Browser
                  </a>{" "}
                  untuk mendownload file{" "}
                </>
              )}
            </div>
          </div>
        )}

        <h1 className="mb-5 text-xl font-bold text-white">Dokumen PKL</h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {!pklData
            ? arrayLoading.map((al) => (
              <div
                key={`pklload-${al}`}
                className="p-4 text-lg font-semibold rounded-lg border border-pink-600 transition hover:scale-105 bg-gray-950"
              >
                <SkeletonLoad width={150} />
              </div>
            ))
            : pklData.map(({ href, text }, i) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={href}
                key={`${href}-${i}`}
                className="p-4 text-lg font-semibold rounded-lg border border-pink-600 transition hover:scale-105 bg-gray-950"
              >
                {text}
              </a>
            ))}
        </div>
      </section>
      <section className="mb-10">
        <h1 className="mb-5 text-xl font-bold text-white">Dokumen Skripsi</h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {!skripsiData
            ? arrayLoading.map((al) => (
              <div
                key={`pklload-${al}`}
                className="p-4 text-lg font-semibold rounded-lg border border-lime-600 transition hover:scale-105 bg-gray-950"
              >
                <SkeletonLoad width={150} />
              </div>
            ))
            : skripsiData.map(({ href, text }, i) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={href}
                key={`${href}-${i}`}
                className="p-4 text-lg font-semibold rounded-lg border border-lime-600 transition hover:scale-105 bg-gray-950"
              >
                {text}
              </a>
            ))}
        </div>
      </section>
      <section className="mb-10">
        <h1 className="mb-5 text-xl font-bold text-white">Surat Keterangan</h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {!suratData
            ? arrayLoading.map((al) => (
              <div
                key={`pklload-${al}`}
                className="p-4 text-lg font-semibold rounded-lg border border-indigo-600 transition hover:scale-105 bg-gray-950"
              >
                <SkeletonLoad width={150} />
              </div>
            ))
            : suratData.map(({ href, text }, i) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={href}
                key={`${href}-${i}`}
                className="p-4 text-lg font-semibold rounded-lg border border-indigo-600 transition hover:scale-105 bg-gray-950"
              >
                {text}
              </a>
            ))}
        </div>
      </section>
    </>
  );
};

export default Page;

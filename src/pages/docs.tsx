import Link from "next/link";
import ErrorPage from "~/components/ErrorPage";
import { trpc } from "~/utils/trpc";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonLoad from "~/components/SkeletonLoad";

const Page = () => {
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

  return (
    <>
      <section className="mb-10">
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
              <Link href={href} key={`${href}-${i}`}>
                <a className="p-4 text-lg font-semibold rounded-lg border border-pink-600 transition hover:scale-105 bg-gray-950">
                  {text}
                </a>
              </Link>
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
              <Link href={href} key={`${href}-${i}`}>
                <a className="p-4 text-lg font-semibold rounded-lg border border-lime-600 transition hover:scale-105 bg-gray-950">
                  {text}
                </a>
              </Link>
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
              <Link href={href} key={`${href}-${i}`}>
                <a className="p-4 text-lg font-semibold rounded-lg border border-indigo-600 transition hover:scale-105 bg-gray-950">
                  {text}
                </a>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
};

export default Page;

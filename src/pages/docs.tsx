import Link from "next/link";
import ErrorPage from "~/components/ErrorPage";
import { trpc } from "~/utils/trpc";

const Page = () => {
  const { data: pklData, isError: errorPKL } = trpc.docs.pkl.useQuery();
  const { data: skirpsiData, isError: skripsiError } =
    trpc.docs.skripsi.useQuery();

  const { data: suratData, isError: errorSurat } =
    trpc.docs.keterangan.useQuery();

  if (errorPKL || skripsiError || errorSurat) {
    return <ErrorPage />;
  }

  if (!pklData || !skirpsiData || !suratData) return null;

  return (
    <>
      <section className="mb-10">
        <h1 className="text-white font-bold text-xl mb-5">Dokumen PKL</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {pklData.map(({ href, text }) => (
            <Link href={href} key={href}>
              <a className="rounded-lg hover:scale-105 border transition bg-gray-950 border-pink-600 p-4 text-lg font-semibold">
                {text}
              </a>
            </Link>
          ))}
        </div>
      </section>
      <section className="mb-10">
        <h1 className="text-white font-bold text-xl mb-5">Dokumen Skripsi</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {skirpsiData.map(({ href, text }) => (
            <Link href={href} key={href}>
              <a className="rounded-lg hover:scale-105 border transition bg-gray-950 border-pink-600 p-4 text-lg font-semibold">
                {text}
              </a>
            </Link>
          ))}
        </div>
      </section>
      <section className="mb-10">
        <h1 className="text-white font-bold text-xl mb-5">Surat Keterangan</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {suratData.map(({ href, text }) => (
            <Link href={href} key={href}>
              <a className="rounded-lg hover:scale-105 border transition bg-gray-950 border-pink-600 p-4 text-lg font-semibold">
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

import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/router";
import SkeletonLoad from "~/components/SkeletonLoad";
import { Fastlist } from "~/components/Flashlist";
import { trpc } from "~/utils/trpc";

export default function Page() {
  const router = useRouter();
  const { s } = router.query;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    trpc.alumni.all.useInfiniteQuery(
      { length: 10, search: s ?? "" },
      {
        getNextPageParam: (lastPage) => {
          const newPage = Number(lastPage.input.start) + 10;
          if (newPage >= lastPage.recordsFiltered) return null;
          return newPage;
        },
        initialCursor: 0,
      },
    );
  const flatData = data?.pages.flatMap((d) => d.data);
  return (
    <div className="pb-10">
      <div className="text-purple-200 mb-4 text-sm">
        Dapat darimana datanya?{" "}
        <a
          rel="noreferrer"
          href="https://informatika.ft.unmul.ac.id/kemahasiswaan/list_alumni"
          target="_blank"
          className="underline hover:text-purple-50"
        >
          Cek Disini
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 px-4 md:px-0">
        <Fastlist
          data={flatData}
          isLoading={isLoading}
          loading={<SkeletonLoad className="h-24 rounded-lg" />}
        >
          {(alumni) =>
            alumni.map((alumnus) => (
              <div
                key={`${alumnus.id}-${alumnus.nim}`}
                className="border border-gray-900 bg-gray-950 rounded-lg px-4 py-2"
              >
                <div className="flex gap-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IF_URL}/foto_alumni/${alumnus.foto}`}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] lg:w-16 lg:h-16 lg:min-w-[64px] lg:min-h-[64px] xl:min-w-[80px] xl:min-h-[80px] xl:w-20 xl:h-20 rounded-full object-cover object-top"
                  />
                  <div>
                    <p className="text-base md:text-lg text-white font-semibold">
                      {alumnus.nama}
                    </p>
                    <p className="text-gray-400 md:text-sm text-">
                      {alumnus.nim}
                    </p>
                    <p className="text-gray-300 italic md:text-base text-sm">{`"${alumnus.testimoni}"`}</p>
                  </div>
                </div>
              </div>
            ))
          }
        </Fastlist>
      </div>
      <div className="flex items-center justify-center w-full mt-8">
        {hasNextPage && flatData?.length !== 0 && (
          <button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="bg-gray-800 rounded-lg flex items-center hover:bg-gray-700 justify-center gap-2 px-4 h-14 text-xl font-semibold"
          >
            {isFetchingNextPage && <Loader2Icon className="animate-spin" />}
            Tampilan Lebih
          </button>
        )}
      </div>
    </div>
  );
}

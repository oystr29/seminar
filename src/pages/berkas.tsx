/* eslint-disable @next/next/no-img-element */
import { useDebounce } from "@uidotdev/usehooks";
import Head from "next/head";
import { useRouter } from "next/router";
import Flashlist from "~/components/Flashlist";
import Search from "~/components/Search";
import SkeletonLoad from "~/components/SkeletonLoad";
import { cn, listSkel } from "~/lib/utils";
import { trpc } from "~/utils/trpc";

export default function Berkas() {
  const router = useRouter();
  const { dir, q } = router.query;
  const { data: folders, isLoading: loadFolders } = trpc.docs.folder.useQuery();
  const search = useDebounce(q, 600);

  const { data: files, isLoading: loadFiles } = trpc.docs.berkas.useQuery(
    { dir_id: folders?.some((e) => e.id === dir) ? dir : folders?.[0].id, search: search ?? "" },
    {
      enabled: !!folders,
    }
  );

  return (
    <>
      <Head>
        <title>Seminar IF - Berkas</title>
      </Head>
      <div className="pb-10 flex items-center flex-col justify-center sm:block">
        <div className="flex flex-col-reverse md:flex-row items-center gap-4 mb-4">
          <div className="flex items-center gap-4 overflow-x-auto w-full scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-900 p-1 md:p-0">
            <Flashlist
              isLoading={loadFolders}
              loadingRender={listSkel(
                (k) => (
                  <SkeletonLoad key={`folder-${k}`} width={97} height={23} />
                ),
                3
              )}
            >
              {folders?.map((folder, i) => (
                <button
                  onClick={async () => {
                    await router.push(
                      { pathname: "", query: { ...router.query, dir: folder.id } },
                      undefined,
                      {
                        shallow: true,
                      }
                    );
                  }}
                  className={cn(
                    "py-1 px-2 rounded-lg whitespace-nowrap bg-gray-950/50 hover:bg-gray-950/90 text-white/80",
                    (dir === folder.id ||
                      ((!dir || !folders.some((e) => e.id === dir)) && i === 0)) &&
                      "bg-violet-950 text-violet-400 border-violet-400 hover:bg-violet-950/90 font-semibold"
                  )}
                  key={folder.id}
                >
                  {folder.name}
                </button>
              ))}
            </Flashlist>
          </div>
          <Search
            disabled={loadFolders}
            defaultValue={q as string}
            placeholder={loadFolders ? "Loading..." : "Cari Berkas"}
            onChange={(e) =>
              router.push(
                { pathname: "", query: { ...router.query, q: e.target.value } },
                undefined,
                { shallow: true }
              )
            }
          />
        </div>
        <div
          className={cn(
            "grid justify-items-center md:justify-items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full",
            files?.length === 0 && "block"
          )}
        >
          <Flashlist
            isFallback={files?.length === 0}
            fallbackRender={
              <div className="text-xl w-full text-clip">
                {q
                  ? `Pencarian Berkas '${q as string}' tidak ditemukan 🤔`
                  : "Sepertinya tidak ada berkas yang muncul 🤨"}
              </div>
            }
            isLoading={loadFiles}
            loadingRender={listSkel(
              (k) => (
                <div
                  key={`files-${k}`}
                  className="rounded-lg flex flex-col h-72 w-72 bg-gray-950 pt-3 px-2 pb-2"
                >
                  <div className="flex items-center gap-2">
                    <SkeletonLoad width={20} height={20} />
                    <SkeletonLoad width={150} height={20} />
                  </div>
                  <SkeletonLoad
                    containerClassName="flex-1 w-full mt-1 rounded-lg"
                    className="h-full"
                  />
                </div>
              ),
              6
            )}
          >
            {files?.map((file) => (
              <a
                href={file.webViewLink ?? ""}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg flex flex-col h-72 w-72 bg-gray-950 pt-3 px-2 pb-2 hover:scale-105 transition"
                key={file.id}
              >
                <div className="flex items-center gap-2">
                  <img
                    loading="lazy"
                    src={file.iconLink ?? ""}
                    alt={"icon"}
                    width={20}
                    height={20}
                  />
                  <div className="truncate">{file.name}</div>
                </div>
                <img
                  loading="lazy"
                  width={200}
                  height={0}
                  placeholder="blur"
                  // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0dnc+AwADPQGbOTvFkgAAAABJRU5ErkJggg=="
                  alt={file.name ?? ""}
                  src={file.thumbnailLink ?? ""}
                  className="flex-1 w-full h-9 mt-1 rounded-lg object-cover object-top"
                />
              </a>
            ))}
          </Flashlist>
        </div>
      </div>
    </>
  );
}

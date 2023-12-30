import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Flashlist from "~/components/Flashlist";
import SkeletonLoad from "~/components/SkeletonLoad";
import { cn, listSkel } from "~/lib/utils";
import { trpc } from "~/utils/trpc";

export default function Berkas() {
  const router = useRouter();
  const { dir } = router.query;
  const { data: folders, isLoading: loadFolders } = trpc.docs.folder.useQuery();

  const { data: files, isLoading: loadFiles } = trpc.docs.berkas.useQuery(
    folders?.some((e) => e.id === dir) ? dir : folders?.[0].id,
    {
      enabled: !!folders,
    }
  );

  return (
    <>
      <Head>
        <title>Berkas</title>
      </Head>
      <div className="pb-10">
        <div className="flex items-center gap-4 mb-4">
          <Flashlist
            isLoading={loadFolders}
            loadingRender={<>{listSkel(<SkeletonLoad width={50} height={20} />, 3)}</>}
          >
            {folders?.map((folder, i) => (
              <button
                onClick={async () => {
                  await router.push({ pathname: "", query: { dir: folder.id } }, undefined, {
                    shallow: true,
                  });
                }}
                className={cn(
                  "py-1 px-2 rounded-lg",
                  (dir === folder.id ||
                    ((!dir || !folders.some((e) => e.id === dir)) && i === 0)) &&
                    "bg-purple-950 text-purple-500 border border-purple-500"
                )}
                key={folder.id}
              >
                {folder.name}
              </button>
            ))}
          </Flashlist>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          <Flashlist
            isLoading={loadFiles}
            loadingRender={listSkel(
              <div className="rounded-lg flex flex-col h-72 w-72 bg-gray-950 pt-3 px-2 pb-2">
                <div className="flex items-center gap-2">
                  <SkeletonLoad width={20} height={20} />
                  <SkeletonLoad width={150} height={20} />
                </div>
                <SkeletonLoad
                  containerClassName="flex-1 w-full mt-1 rounded-lg"
                  className="h-full"
                />
              </div>,
              6
            )}
          >
            {files?.map((file) => (
              <div
                className="rounded-lg flex flex-col h-72 w-72 bg-gray-950 pt-3 px-2 pb-2"
                key={file.id}
              >
                <div className="flex items-center gap-2">
                  <Image src={file.iconLink ?? ""} alt={"icon"} width={20} height={20} />
                  <div className="truncate">{file.name}</div>
                </div>
                <Image
                  width={200}
                  height={0}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0dnc+AwADPQGbOTvFkgAAAABJRU5ErkJggg=="
                  alt={file.name ?? ""}
                  src={file.thumbnailLink ?? ""}
                  className="flex-1 w-full h-9 mt-1 rounded-lg object-cover object-top"
                />
              </div>
            ))}
          </Flashlist>
        </div>
      </div>
    </>
  );
}

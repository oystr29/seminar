import Link from "next/link";

const ErrorPage = ({ emoji = "😣" }: { emoji?: string }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h2 className="font-bold text-2xl">Maaf... Terjadi Kesalahan {emoji} </h2>
      <Link className="text-2xl text-purple-700 hover:underline" href="/">
        Kembali ke Home
      </Link>
    </div>
  );
};

export default ErrorPage;

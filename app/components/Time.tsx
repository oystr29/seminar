export default function Time({ count, time }) {
  if (count === "00" && time !== "Detik") return null;

  return (
    <div className="flex flex-col items-center justify-center mr-2">
      <div
        suppressHydrationWarning={true}
        className="mb-1 rounded-lg p-1 w-7 text-sm text-center bg-black text-zinc-50"
      >
        {count}
      </div>
      <div className="text-zinc-100">{time}</div>
    </div>
  );
}

import { Search } from "lucide-react";
import { type DetailedHTMLProps, type InputHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export default function Searchh(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) {
  return (
    <div className="relative mr-4 flex flex-0">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        {...props}
        type="search"
        className={cn(
          `p-2 pl-10 focus:border-purple-500 outline-none text-sm  border rounded-lg  bg-gray-900 border-gray-600 placeholder-gray-400 text-white`,
          props.className,
        )}
        placeholder={props.placeholder ?? "Cari Judul, Nama, atau NIM"}
      />
    </div>
  );
}

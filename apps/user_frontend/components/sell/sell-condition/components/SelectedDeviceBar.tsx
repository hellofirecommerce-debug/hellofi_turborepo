import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  name: string;
  image: string;
  changeHref: string;
}

export function SelectedDeviceBar({ name, image, changeHref }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-[#EEF3FF] px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
        <Image
          src={image}
          alt={name}
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      </div>
      <p className="min-w-0 flex-1 truncate text-sm font-bold text-gray-900">
        {name}
      </p>
      <Link
        href={changeHref}
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#0066FF] hover:underline"
      >
        Change <ArrowRight size={14} />
      </Link>
    </div>
  );
}

import { LucideUserSearch } from "lucide-react";
import Image from "next/image";

type CalonCardProps = {
  number: number;
  angkatan: string;
  imageSrc: string;
  name: string;
  draflink: string;
  variant: "home" | "calon";
  calonpagelink?: string;
};

function CalonCard({
  number,
  angkatan,
  imageSrc,
  name,
  draflink,
  variant,
  calonpagelink,
}: CalonCardProps) {
  return (
    <div className="relative flex flex-col items-center w-80">
      {/* Number */}
      <div className="absolute left-4 top-4 z-10">
        <h1 className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#FFBB00] font-neuething text-4xl text-[#156E3C]">
          {number}
        </h1>
      </div>

      {/* Image */}
      <div className="relative w-full h-96">
        <Image
          src={imageSrc}
          alt={`Image of ${name}`}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        {/* Overlay for Text */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold text-white">{name}</h2>
          <p className="text-center text-lg text-gray-300">{angkatan}</p>
          {variant === "home" ? (
            <a
              href={calonpagelink}
              className="flex items-center justify-center rounded-2xl bg-[#FFBB00] px-6 py-3 text-center font-satoshi text-xl font-bold text-[#156E3C] hover:bg-yellow-600 mt-2"
            >
              Kenali Calon
              <LucideUserSearch className="ml-2 h-6 w-6" />
            </a>
          ) : (
            <a
              href={draflink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-2xl bg-[#FFBB00] px-6 py-3 text-center font-satoshi text-xl font-bold text-[#156E3C] hover:bg-yellow-600 mt-2"
            >
              Lihat Draft Calon
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalonCard;



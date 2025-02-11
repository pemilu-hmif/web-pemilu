import Image from "next/image";

type CoblosCardProps = {
    number: number;
    name: string;
    imageSrc: string;
    angkatan: string;
};

function CoblosCard({
    number,
    name,
    imageSrc,
    angkatan,
}: CoblosCardProps) {
    return (
        <div className="relative flex flex-col items-center w-36 sm:w-48 sm:mt-0 mt-4">
            {/* Number */}
            <div className="absolute left-2 top-2 z-10 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-[#FFBB00] font-satoshi text-xl sm:text-3xl text-[#156E3C]">
                {number}
            </div>
            
            {/* Image */}
            <div className="relative w-40 h-40 sm:w-52 sm:h-52">
                <Image
                    src={imageSrc}
                    alt={`Image of ${name}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </div>

            {/* Name & Angkatan */}
            <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
                <h2 className="text-center text-sm sm:text-lg text-white font-satoshi">{name}</h2>
                <p className="text-center text-xs sm:text-sm text-white">{angkatan}</p>
            </div>
        </div>
   );
}

export default CoblosCard;

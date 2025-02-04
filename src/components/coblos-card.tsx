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
}:CoblosCardProps) {
    return (
        <div className="relative flex flex-col items-center">
            {/* Number */}
            <div className="absolute left-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-lg bg-[#FFBB00] font-satoshi text-4xl text-[#156E3C]">
                {number}
            </div>
            
            {/* Image */}
            <div className="relative">
                <Image
                    src={imageSrc}
                    alt={`Image of ${name}`}
                    width={250}
                    height={250}
                    className="rounded-lg"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center px-4 py-6">
                <h2 className="text-center text-lg text-white">{name}</h2>
                <p className="text-center text-lg text-white">{angkatan}</p>
            </div>
        </div>
   );
}
export default CoblosCard
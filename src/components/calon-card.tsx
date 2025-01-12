import Image from 'next/image'

type CalonCardProps = {
    number: number
    angkatan: string
    imageSrc: string
    name: string
    draflink: string
    variant: 'home' | 'calon'
}

function CalonCard({
    number,
    angkatan,
    imageSrc,
    name,
    draflink,
    variant
}: CalonCardProps) {
    return (
        <div className='relative flex flex-col items-center'>
            {/* Number */}
            <div className='absolute left-4 top-4 z-10'>
                <h1 className='flex h-20 w-20 items-center justify-center rounded-lg bg-[#FFBB00] pt-4 font-neuething text-6xl text-[#156E3C]'>
                    {number}
                </h1>
            </div>

            {/* Image with Gradient */}
            <div className='relative'>
                <Image
                    src={imageSrc}
                    alt={`Image of ${name}`}
                    width={400}
                    height={300}
                    className='rounded-lg'
                />
                {/* Gradient Overlay */}
                <div className='absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
            </div>

            {/* Text and Button */}
            <div className='absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center gap-2 px-4 py-6'>
                <h2 className='text-center text-2xl font-bold text-white'>
                    {name}
                </h2>
                <p className='text-center text-lg text-white'>{angkatan}</p>
                {variant === 'home' ? (
                    <a
                        href='#placeholder'
                        className='flex items-center justify-center rounded-2xl bg-[#FFBB00] px-6 py-3 text-center font-satoshi text-2xl font-bold text-[#156E3C] hover:bg-yellow-600'
                    >
                        Kenali Calon
                    </a>
                ) : (
                    <a
                        href={draflink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center rounded-2xl bg-[#FFBB00] px-6 py-3 text-center font-satoshi text-2xl font-bold text-[#156E3C] hover:bg-yellow-600'
                    >
                        Lihat Draft Calon
                    </a>
                )}
            </div>
        </div>
    )
}

export default CalonCard

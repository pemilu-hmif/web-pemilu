import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

type TabData = {
    id: string
    name: string
    number: number
    angkatan: string
    imageSrc: string
    visi: string
    misi: string[]
}

const tabsData: TabData[] = [
    {
        id: '1',
        number: 1,
        name: 'Marvin Scifo Y. Hutahaean',
        angkatan: 'IF22',
        imageSrc: '/logo.svg',
        visi: 'Membuat dan mewujudkan HMIF yang berbakat, berkontribusi, dan berorientasi ke masa depan.',
        misi: [
            'HMIF sebagai tempat mahasiswa belajar, mendalami, dan menguasai bidang informatika.',
            'HMIF sebagai tempat mahasiswa menumbuhkan potensi dari aspek jasmani, mental, akademik, dan rohani.',
            'HMIF sebagai tempat mahasiswa menemukan posisi dan identitas mereka baik di ITB, maupun di kehidupan masyarakat.',
            'HMIF sebagai tempat mahasiswa berelasi dengan orang-orang dengan latar belakang yang beragam.'
        ]
    },
    {
        id: '2',
        number: 2,
        name: 'Bryan P. Hutagalung',
        angkatan: 'STI22',
        imageSrc: '/test.svg',
        visi: 'HMIF ITB menjadi perahu kolaborasi yang mengarungi samudra inovasi untuk kemajuan teknologi bersama dalam menghadapi gelombang perubahan.',
        misi: [
            'Menjaga dan mengembangkan identitas HMIF ITB yang adaptif, inklusif, dan bermakna.',
            'Mengembangkan ekosistem kolaborasi yang mendorong pertukaran pengetahuan, kreativitas, dan inovasi teknologi.',
            'Membangun pengembangan potensi warga HMIF ITB melalui pembinaan minat, bakat, dan kolektif.',
            'Memperluas relasi dengan komunitas teknologi untuk memperkaya pengalaman dan wawasan warga HMIF ITB.',
            'Mendorong kontribusi sosial teknologi untuk pemberdayaan masyarakat melalui implementasi solusi inovatif.'
        ]
    }
]

function CalonTabs() {
    return (
        <Tabs defaultValue='1' className='rounded-lg p-4'>
            <TabsList className='mb-6 inline-flex w-full items-center justify-center gap-4 rounded-md bg-transparent p-1 font-satoshi font-bold'>
                {tabsData.map(tab => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className='ring-offset-background focus-visible:ring-ring inline-flex w-40 items-center justify-center whitespace-nowrap rounded-2xl border-4 border-[#FFBB00] px-6 py-1.5 text-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#FFBB00] data-[state=inactive]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-[#FFBB00]'
                    >
                        {tab.number}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabsData.map(tab => (
                <TabsContent
                    key={tab.id}
                    value={tab.id}
                    className='flex flex-col items-center justify-center gap-4'
                >
                    <div className='relative'>
                        {/* Number */}
                        <div className='absolute left-4 top-4 z-10'>
                            <h1 className='flex h-20 w-20 items-center justify-center rounded-lg bg-[#FFBB00] pt-4 font-neuething text-6xl text-[#156E3C]'>
                                {tab.number}
                            </h1>
                        </div>

                        {/* Image */}
                        <div className='pl-8 pt-8'>
                            <Image
                                src={tab.imageSrc}
                                alt={`Tab ${tab.number} content image`}
                                width={400}
                                height={300}
                                className='rounded-lg'
                            />
                        </div>
                    </div>

                    {/* Visi */}
                    <div className='flex w-full max-w-[1000px] flex-col gap-2 text-white'>
                        <h1 className='font-neuething text-3xl'>Visi:</h1>
                        <p className='text-xl'>"{tab.visi}"</p>
                    </div>

                    {/* Misi */}
                    <div className='flex w-full max-w-[1000px] flex-col gap-2 text-white'>
                        <h1 className='font-neuething text-3xl'>Misi:</h1>
                        <ol className='list-inside list-decimal text-xl'>
                            {tab.misi.map((item, index) => (
                                <li key={index} className='text-xl'>
                                    {item}
                                </li>
                            ))}
                        </ol>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    )
}

export default CalonTabs

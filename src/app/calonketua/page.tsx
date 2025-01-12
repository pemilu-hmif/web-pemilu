import CalonTabs from '~/components/calon-tabs'

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

const CalonKetua = () => {
    return (
        <div className='mb-24 mt-32 flex flex-col items-center pt-[80px]'>
            <div className='container flex flex-col p-4'>
                {/* Title */}
                <div className='relative flex w-full flex-col items-center justify-center text-center text-white'>
                    <div className='relative flex gap-1'>
                        <h1 className='-rotate-12 font-sloop text-7xl sm:text-9xl'>
                            C
                        </h1>
                        <h1 className='font-playfair text-6xl sm:text-8xl'>
                            alon
                        </h1>
                    </div>
                    <h1 className='mt-2 font-neuething text-5xl font-bold tracking-wide sm:text-7xl'>
                        KETUA HIMPUNAN
                    </h1>
                </div>

                {/* Content */}
                <div className='mt-8 flex w-full flex-col items-center justify-center gap-12'>
                    <CalonTabs tabsData={tabsData} />
                </div>
            </div>
        </div>
    )
}

export default CalonKetua

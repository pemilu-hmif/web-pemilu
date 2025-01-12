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
        name: 'Elijah Darellshane Suryanegara',
        angkatan: 'IF22',
        imageSrc: '/logo.svg',
        visi: 'Kesenatoran HMIF ITB 2025/2026 sebagai mercusuar demokrasi yang memancarkan idealisme untuk menginspirasi perubahan progresif di HMIF ITB dan Kongres KM ITB.',
        misi: [
            'Menyusun sistem demokrasi yang efisien dan representatif bagi seluruh warga HMIF ITB.',
            'Mendorong terciptanya budaya berpikir yang objektif, kritis, dan inklusif.',
            'Menggerakkan HMIF ITB sebagai himpunan yang proaktif dalam memelopori perubahan yang bermakna.',
            'Menjaga harkat HMIF ITB sebagai organisasi yang berdikari dan berintegritas.'
        ]
    }
]

const CalonSenator = () => {
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
                        SENATOR
                    </h1>
                </div>

                {/* Content */}
                <div className='mt-8 flex w-full flex-col items-center justify-center gap-12'>
                    <CalonTabs tabsData={tabsData}/>
                </div>
            </div>
        </div>
    )
}

export default CalonSenator

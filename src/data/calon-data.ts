export type TabData = {
    id: string
    name: string
    number: number
    angkatan: string
    imageSrc: string
    visi: string
    misi: string[]
    draflink: string
}

export const calonKetuaData: TabData[] = [
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
        ],
        draflink: 'http://google.com'
    },
    {
        id: '2',
        number: 2,
        name: 'Bryan P. Hutagalung',
        angkatan: 'STI22',
        imageSrc: '/logo.svg',
        visi: 'HMIF ITB menjadi perahu kolaborasi yang mengarungi samudra inovasi untuk kemajuan teknologi bersama dalam menghadapi gelombang perubahan.',
        misi: [
            'Menjaga dan mengembangkan identitas HMIF ITB yang adaptif, inklusif, dan bermakna.',
            'Mengembangkan ekosistem kolaborasi yang mendorong pertukaran pengetahuan, kreativitas, dan inovasi teknologi.',
            'Membangun pengembangan potensi warga HMIF ITB melalui pembinaan minat, bakat, dan kolektif.',
            'Memperluas relasi dengan komunitas teknologi untuk memperkaya pengalaman dan wawasan warga HMIF ITB.',
            'Mendorong kontribusi sosial teknologi untuk pemberdayaan masyarakat melalui implementasi solusi inovatif.'
        ],
        draflink: 'http://google.com'
    }
]

export const calonSenatorData: TabData[] = [
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
        ],
        draflink: 'http://google.com'
    }
]

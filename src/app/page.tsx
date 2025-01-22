'use client'
import Image from 'next/image'
import logo from 'public/homepage/logo.png'
import timeline from 'public/homepage/timeline.png'
import arrow from 'public/homepage/arrow.png'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect, useState } from 'react'
import { useSession, getSession } from 'next-auth/react'
import LoadingSpinner from '~/components/LoadingSpinner'
import DialogBox from '~/components/DialogBox'
import { Button } from '~/components/ui/button'
import Link from 'next/link'
import CalonCard from '~/components/calon-card'
import { calonKetuaData, calonSenatorData } from '~/data/calon-data'

const HomePage = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic'
        })
    }, [])
    const { data: session, status } = useSession()
    const [showDialog, setShowDialog] = useState(false)
    if (status === 'loading') {
        return <LoadingSpinner />
    }
    if (status === 'unauthenticated' && !showDialog) {
        return (
            <DialogBox
                title='Unauthorized'
                message='You are not authenticated. Please log in to continue.'
                onConfirm={() => (window.location.href = '/auth/login')}
                onCancel={() => setShowDialog(true)}
            />
        )
    }
    return (
        <div className='mb-24 flex flex-col'>
            <div
                className='flex min-h-screen flex-col items-center justify-center gap-4 md:gap-8'
                data-aos='fade-up'
                data-aos-delay='200'
            >
                {/* logo section */}
                <div className='relative flex flex-col-reverse items-center justify-center gap-8 px-4 py-12 sm:flex-row sm:gap-0 sm:px-16'>
                    <div className='text-center text-white sm:text-left'>
                        <div className='flex items-baseline justify-center gap-1 sm:justify-start'>
                            <h1 className='font-sloop text-7xl sm:text-9xl'>
                                P
                            </h1>
                            <h1 className='font-playfair text-6xl sm:text-8xl'>
                                emilu
                            </h1>
                        </div>
                        <h1 className='mt-2 font-neuething text-5xl font-bold tracking-wide sm:text-7xl'>
                            HMIF 2025
                        </h1>
                        <div className='mt-4'>
                            <h3 className='rounded-full border px-4 py-2 font-satoshi text-lg font-semibold tracking-wider sm:text-xl'>
                                Pelajari calon ketua himpunan yang sesuai
                                denganmu!
                            </h3>
                        </div>
                    </div>
                    <div className='relative h-64 w-64 sm:h-80 sm:w-80'>
                        <Image src={logo} alt='Logo' />
                    </div>
                </div>
                <Button
                    asChild
                    className='flex items-center justify-center rounded-[32px] bg-[#ffbb00] px-9 py-3 text-xl text-[#156E3C] hover:bg-yellow-600'
                >
                    <Link href='#calon'>Kenali Calonmu</Link>
                </Button>
            </div>

            {/* section 2 */}
            <div
                className='flex min-h-screen flex-col items-center justify-center px-2 py-4 text-center text-white'
                data-aos='fade-up'
                data-aos-delay='200'
            >
                <h1 className='font-neuething text-2xl font-bold sm:text-5xl'>
                    Mau mencalonkan
                </h1>
                <h1 className='font-neuething text-2xl font-bold sm:text-5xl'>
                    diri, <span className='text-yellow-400'>Pips</span>?
                </h1>
                <p className='font-satoshi text-sm sm:text-xl'>
                    Yuk, kenali tata cara mencalonkan diri menjadi calon ketua
                    himpunan dan
                </p>
                <p className='font-satoshi text-sm sm:text-xl'>
                    senator HMIF selanjutnya
                </p>
                <a
                    href='tata-cara'
                    className='mt-4 flex items-center gap-2 rounded-full border-yellow-500 bg-yellow-500 px-4 py-2 font-satoshi text-lg font-semibold transition-colors hover:bg-yellow-600 sm:text-2xl'
                >
                    Lihat Tata Cara
                    <span className='inline-flex items-center'>
                        <Image src={arrow} alt='arrow' width={24} height={24} />
                    </span>
                </a>
            </div>

            {/* Timeline */}
            <div
                className='mb-6 flex items-center justify-center'
                data-aos='fade-up'
                data-aos-delay='200'
            >
                <div className='mb-16 h-auto w-[270px] sm:h-[500-px] sm:w-96'>
                    <Image src={timeline} alt='timeline' />
                </div>
            </div>

            {/* Calon */}
            <div
                className='flex flex-col items-center justify-center gap-24 px-4 pb-12 pt-12 text-center text-white md:pt-32'
                id='calon'
            >
                <div className='flex flex-col flex-wrap items-center justify-center gap-8'>
                    <h1 className='max-w-[800px] font-neuething text-2xl font-bold text-white md:text-6xl'>
                        Calon Ketua Himpunan
                    </h1>
                    <div className='flex flex-wrap items-center justify-center gap-6'>
                        {calonKetuaData.map(calon => (
                            <CalonCard
                                key={calon.id}
                                number={calon.number}
                                angkatan={calon.angkatan}
                                imageSrc={calon.imageSrc}
                                name={calon.name}
                                draflink={calon.draflink}
                                calonpagelink={calon.calonpagelink}
                                variant='home'
                            />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col flex-wrap items-center justify-center gap-8'>
                    <h1 className='max-w-[800px] font-neuething text-2xl font-bold text-white md:text-6xl'>
                        Calon Senator
                    </h1>
                    <div className='flex flex-wrap items-center justify-center gap-6'>
                        {calonSenatorData.map(calon => (
                            <CalonCard
                                key={calon.id}
                                number={calon.number}
                                angkatan={calon.angkatan}
                                imageSrc={calon.imageSrc}
                                name={calon.name}
                                draflink={calon.draflink}
                                calonpagelink={calon.calonpagelink}
                                variant='home'
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage

import { Button } from '~/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='mb-64 mt-64 flex items-center justify-center md:mb-0 md:mt-0 md:min-h-screen md:pt-[80px]'>
            <div className='inline-flex flex-col items-center justify-start gap-4 lg:gap-11'>
                <div className='inline-flex flex-col items-center justify-start lg:gap-3'>
                    <h1 className='font-neuething text-6xl font-bold text-neutral-50 lg:text-9xl'>
                        404
                    </h1>
                    <h2 className='text-center font-neuething text-2xl font-bold tracking-wide text-neutral-50 lg:text-6xl'>
                        Halaman tidak
                        <br />
                        ditemukan
                    </h2>
                </div>
                <div className='self-stretch text-center font-satoshi text-lg text-neutral-50 md:text-2xl'>
                    Halaman yang kamu cari tidak ada atau telah dipindahkan.
                    <br />
                    Silahkan kembali ke beranda.
                </div>
                <Button
                    asChild
                    className='inline-flex items-center justify-center rounded-[32px] bg-[#ffbb00] hover:bg-yellow-600 lg:h-[68px] lg:gap-2.5 lg:py-4 lg:pl-10 lg:pr-7'
                >
                    <Link
                        href='/'
                        className='inline-flex items-center justify-center gap-1 lg:h-11 lg:gap-2'
                    >
                        <p className='lg:leadsing-[33.60px] text-center font-satoshi text-lg font-bold text-neutral-50 md:text-3xl'>
                            Beranda
                        </p>
                        <img
                            src='/arrow_outward.svg'
                            alt=''
                            loading='lazy'
                            className='h-[40%] w-[25%] lg:h-full'
                        />
                    </Link>
                </Button>
            </div>
        </div>
    )
}

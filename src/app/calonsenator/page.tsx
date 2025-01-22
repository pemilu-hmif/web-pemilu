import CalonTabs from '~/components/calon-tabs'
import { calonSenatorData } from '~/data/calon-data'

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
                    <CalonTabs tabsData={calonSenatorData} defaultTab='1' />
                </div>
            </div>
        </div>
    )
}

export default CalonSenator

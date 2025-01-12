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

type CalonTabsProps = {
    tabsData: TabData[]
}

function CalonTabs({ tabsData }: CalonTabsProps) {
    if (tabsData.length === 1) {
        const tab = tabsData[0]
        if (!tab) return

        return (
            <div className='rounded-lg p-4'>
                <div className='flex flex-col items-center justify-center gap-4'>
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
                </div>
            </div>
        )
    }

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

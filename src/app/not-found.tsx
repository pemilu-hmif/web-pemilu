import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="lg:mt-[215px] mt-[170px] lg:mb-[80px] mb-[-70px] flex items-center justify-center">
            <div className="lg:w-[1000px] w-[300px] lg:h-[574px] h-[490px] flex-col justify-start items-center lg:gap-11 gap-4 inline-flex">
                <div className="lg:h-[310px] h-[140px] flex-col justify-start items-center lg:gap-3 inline-flex">
                    <h1 className="text-neutral-50 lg:text-[120px] text-[50px] font-bold font-neuething lg:leading-[144px]">
                        404
                    </h1>
                    <h2 className="text-center tracking-wide text-neutral-50 lg:text-[64px] text-[24px] font-bold font-neuething lg:leading-[76.80px]">
                        Halaman tidak
                        <br />
                        ditemukan
                    </h2>
                </div>
                <div className="self-stretch text-center text-neutral-50 lg:text-2xl font-satoshi lg:leading-[28.80px]">
                        Halaman yang kamu cari tidak ada atau telah dipindahkan.
                        <br />
                        Silahkan kembali ke beranda.
                </div>
                <Button asChild className="lg:h-[68px] lg:pl-10 lg:pr-7 lg:py-4 bg-[#ffbb00] rounded-[32px] justify-center items-center lg:gap-2.5 inline-flex hover:bg-yellow-600">
                    <Link href ="/">
                        <div className="lg:h-11 justify-center items-center lg:gap-2 gap-1 inline-flex">
                            <p className="text-center text-neutral-50 lg:text-[28px] font-bold font-satoshi lg:leading-[33.60px]"> Beranda</p>
                            <img
                            src="/arrow_outward.svg"
                            alt=""
                            loading="lazy"
                            className="h-[40%] w-[25%] lg:h-full"/>
                        </div>
                    </Link>
                </Button>
            </div>
        </div>
    );
}

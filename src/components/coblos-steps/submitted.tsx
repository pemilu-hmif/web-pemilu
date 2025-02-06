import Link from "next/link";

export default function SubmittedPage() {
    return (
        <div className="flex flex-col items-center text-center sm:mt-0 mt-[-80px]">
            <div className="mb-[150px]">
                <span className="text-neutral-50 mt-2 font-neuething sm:text-[30px] text-[28px] font-bold tracking-wide leading-[33.60px]">Terima Kasih Sudah </span>
                <span className="mt-2 font-neuething sm:text-[30px] text-[28px] font-bold tracking-wide leading-[33.60px] text-[#ffbb00]">Berpartisipasi</span>
            </div>
            <div className="mb-6 sm:mt-0 mt-[-100px]">
                <p className="text-2xl font-satoshi text-white">
                    Sudah mencoblos? Keren banget! Pilihanmu berarti besar untuk masa depan 
                    <span className="text-[#ffbb00]"> HMIF.</span>
                </p>
            </div>
            <div className="mt-2">
                <span className="text-neutral-50 text-2xl font-satoshi leading-[28.80px]">
                    Punya kritik, saran, atau sekadar ide keren buat bikin pemilu lebih seru? Kami siap dengerin!
                </span>
                <p className="text-neutral-50 text-2xl font-satoshi leading-[28.80px] mt-2 sm:mb-0">
                    Tinggalkan pesanmu, siapa tahu ide kamu bikin perubahan besar.
                </p>
            </div>
        </div>
    );
}

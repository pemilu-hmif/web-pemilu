import Image from "next/image";
import logo from "public/homepage/logo.png";
import whatsapp from "public/footer/whatsapp.png";
import line from "public/footer/line.png";

const Footer = () => {
  return (
    <div className="min-h-[299px] bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between gap-8 md:gap-4">
        <div className="flex flex-row md:flex-row justify-between md:justify-start gap-8 md:gap-44 flex-1">
          <div className="flex flex-col font-neuething items-center">
            <div className="w-[70px] h-[75px] md:w-[97px] md:h-[103px] mb-2">
              <Image
                src={logo}
                alt="logo"
              />
            </div>
            <h1 className="text-xl md:text-2xl">PEMILU</h1>
            <h3 className="text-sm md:text-md">HMIF 2025</h3>
          </div>
          <div className="flex flex-col font-satoshi">
            <h4 className="font-bold mb-2 md:mb-4 text-sm md:text-lg tracking-wider">Explore</h4>
            <div className="flex flex-col gap-1 md:gap-2">
              <p className="text-sm md:text-base">Dokumen Teknis Pemilu</p>
              <p className="text-sm md:text-base">Kritik dan Saran</p>
              <p className="text-sm md:text-base">Tim Kami</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col font-satoshi w-full md:w-auto">
          <h4 className="font-bold mb-2 md:mb-4 text-sm md:text-lg tracking-wider">Contact Person</h4>
          <div className="grid grid-cols-2 gap-x-4 md:gap-x-44">
            <div className="flex flex-col gap-1 md:gap-2">
              <p className="text-sm md:text-base">Venantius Sean</p>
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]">
                  <Image src={line} alt="line" />
                </div>
                <p className="text-sm md:text-base">seanardinugroholline</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]">
                  <Image src={whatsapp} alt="whatsapp" />
                </div>
                <p className="text-sm md:text-base">081212121212</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <p className="text-sm md:text-base">Ahmad Thoriq</p>
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]">
                  <Image src={line} alt="line" />
                </div>
                <p className="text-sm md:text-base">thoriqaurkuning</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]">
                  <Image src={whatsapp} alt="whatsapp" />
                </div>
                <p className="text-sm md:text-base">081212121212</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
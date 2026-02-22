import Image from "next/image";
import logo from "public/homepage/logo.png";
import line from "public/footer/line.png";
import { api } from "~/trpc/react";

const Footer = () => {
  const active = api.admin.configuration.election.getActive.useQuery();
  return (
    <div className="flex min-h-[299px] items-center justify-center bg-white p-4">
      <div className="flex w-full max-w-7xl flex-col justify-between gap-8 md:flex-row md:gap-4">
        <div className="flex flex-1 flex-col justify-between gap-8 md:flex-row md:justify-start md:gap-44">
          <div className="flex flex-col items-center font-neuething">
            <div className="mb-2 mt-8 h-[75px] w-[70px] md:mt-0 md:h-[103px] md:w-[97px]">
              <Image src={logo} alt="logo" />
            </div>
            <h1 className="text-2xl md:text-2xl">PEMILU</h1>
            <h3 className="md:text-md text-md">
              HMIF {active.isFetched && !active.isError && active.data?.name}
            </h3>
          </div>
          <div className="flex flex-col font-satoshi">
            <h4 className="mb-2 text-sm font-bold tracking-wider md:mb-4 md:text-lg">
              Explore
            </h4>
            <div className="flex flex-col gap-1 md:gap-2">
              <a
                href="https://drive.google.com/drive/folders/1aZKPw4eADaaXyx4QXh5_ax_yIQ6oYG82?usp=sharing"
                className="text-sm md:text-base"
              >
                Dokumen Teknis Pemilu
              </a>
              <a
                href="https://forms.gle/MgFXABwpVvbnCDMo9"
                className="text-sm md:text-base"
              >
                Kritik dan Saran
              </a>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col font-satoshi md:w-auto">
          <h4 className="mb-2 text-sm font-bold tracking-wider md:mb-4 md:text-lg">
            Contact Person
          </h4>
          <div className="grid grid-rows-2 gap-y-8 md:grid-cols-2 md:gap-x-44">
            <div className="flex flex-col gap-1 md:gap-2">
              <p className="text-sm md:text-base">Nathanael Rachmat</p>
              <div className="flex items-center gap-2">
                <div className="h-[20px] w-[20px] md:h-[24px] md:w-[24px]">
                  <Image src={line} alt="line" />
                </div>
                <a
                  href="https://line.me/ti/p/~nathanaelrachmat"
                  className="text-sm md:text-base"
                >
                  nathanaelrachmat
                </a>
              </div>
              {/* <div className="flex items-center gap-2">
                <div className="h-[20px] w-[20px] md:h-[24px] md:w-[24px]">
                  <Image src={whatsapp} alt="whatsapp" />
                </div>
                <p className="text-sm md:text-base">085956659510</p>
              </div> */}
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <p className="text-sm md:text-base">Reza Ahmad Syarif</p>
              <div className="flex items-center gap-2">
                <div className="h-[20px] w-[20px] md:h-[24px] md:w-[24px]">
                  <Image src={line} alt="line" />
                </div>
                <a
                  href="https://line.me/ti/p/~rejaah."
                  className="text-sm md:text-base"
                >
                  rejaah.
                </a>
              </div>
              <div className="flex items-center gap-2">
                {/* <div className="h-[20px] w-[20px] md:h-[24px] md:w-[24px]">
                  <Image src={whatsapp} alt="whatsapp" />
                </div>
                <p className="text-sm md:text-base">081212121212</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

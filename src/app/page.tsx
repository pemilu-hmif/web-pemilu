"use client"
import Image from "next/image";
import logo from "public/homepage/logo.png";
import timeline from "public/homepage/timeline.png";
import arrow from "public/homepage/arrow.png";
import AOS from "aos";
import 'aos/dist/aos.css';
import { useEffect } from "react";


const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);
  return (
    <div className="flex flex-col">
      {/* logo section */}
        <div className="relative flex flex-col-reverse sm:flex-row items-center justify-center px-4 sm:px-16 py-12 min-h-screen gap-8 sm:gap-0" data-aos="fade-up" data-aos-delay="200">
            <div className="text-white text-center sm:text-left">
                <div className="flex items-baseline gap-1 justify-center sm:justify-start">
                    <h1 className="font-sloop text-7xl sm:text-9xl">P</h1>
                    <h1 className="font-playfair text-6xl sm:text-8xl">emilu</h1>
                </div>
                <h1 className="font-neuething text-5xl sm:text-7xl font-bold tracking-wide mt-2">
                HMIF 2025
                </h1>
                <div className="mt-4">
                    <h3 className="font-satoshi font-semibold tracking-wider text-lg sm:text-xl border rounded-full p-2">
                        Pelajari calon ketua himpunan yang sesuai denganmu!
                    </h3>
                </div>
            </div>
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <Image
                src={logo}
                alt="Logo"
                />
            </div>
        </div>

        {/* section 2 */}
        <div className="text-white flex items-center justify-center flex-col min-h-screen py-4 px-2 text-center" data-aos="fade-up" data-aos-delay="200">
            <h1 className="font-neuething font-bold text-2xl sm:text-5xl">Mau mencalonkan</h1>
            <h1 className="font-neuething font-bold text-2xl sm:text-5xl">diri, <span className="text-yellow-400">Pips</span>?</h1>
            <p className="font-satoshi text-sm sm:text-xl">Yuk, kenali tata cara mencalonkan diri menjadi calon ketua himpunan dan</p>
            <p className="font-satoshi text-sm sm:text-xl">senator HMIF selanjutnya</p>
            <a href="TataCara" className="font-satoshi font-semibold text-lg sm:text-2xl border-yellow-500 bg-yellow-500 rounded-full p-2 mt-4 hover:bg-yellow-600 transition-colors flex items-center gap-2">
              Lihat Tata Cara
                <span className="inline-flex items-center">
                    <Image 
                      src={arrow} 
                      alt="arrow"
                      width={24} 
                      height={24}
                    />
                </span>
            </a>
        </div>

        {/* section 3 */}
        <div className="flex items-center justify-center min-h-screen" data-aos="fade-up" data-aos-delay="200">
            <div className="w-[270px] sm:w-96 h-auto sm:h-96 mb-6">
                <Image
                  src={timeline}
                  alt="timeline"
                />
            </div>
        </div>
    </div>
  );
};

export default HomePage;
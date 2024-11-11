"use client";
import Image from "next/image";
import logo from "public/homepage/logo.png";
import timeline from "public/homepage/timeline.png";
import arrow from "public/homepage/arrow.png";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);
  return (
    <div className="flex flex-col">
      {/* logo section */}
      <div
        className="relative flex min-h-screen flex-col-reverse items-center justify-center gap-8 px-4 py-12 sm:flex-row sm:gap-0 sm:px-16"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="text-center text-white sm:text-left">
          <div className="flex items-baseline justify-center gap-1 sm:justify-start">
            <h1 className="font-sloop text-7xl sm:text-9xl">P</h1>
            <h1 className="font-playfair text-6xl sm:text-8xl">emilu</h1>
          </div>
          <h1 className="mt-2 font-neuething text-5xl font-bold tracking-wide sm:text-7xl">
            HMIF 2025
          </h1>
          <div className="mt-4">
            <h3 className="rounded-full border p-2 font-satoshi text-lg font-semibold tracking-wider sm:text-xl">
              Pelajari calon ketua himpunan yang sesuai denganmu!
            </h3>
          </div>
        </div>
        <div className="relative h-64 w-64 sm:h-80 sm:w-80">
          <Image src={logo} alt="Logo" />
        </div>
      </div>

      {/* section 2 */}
      <div
        className="flex min-h-screen flex-col items-center justify-center px-2 py-4 text-center text-white"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h1 className="font-neuething text-2xl font-bold sm:text-5xl">
          Mau mencalonkan
        </h1>
        <h1 className="font-neuething text-2xl font-bold sm:text-5xl">
          diri, <span className="text-yellow-400">Pips</span>?
        </h1>
        <p className="font-satoshi text-sm sm:text-xl">
          Yuk, kenali tata cara mencalonkan diri menjadi calon ketua himpunan
          dan
        </p>
        <p className="font-satoshi text-sm sm:text-xl">
          senator HMIF selanjutnya
        </p>
        <a
          href="tata-cara"
          className="mt-4 flex items-center gap-2 rounded-full border-yellow-500 bg-yellow-500 p-2 font-satoshi text-lg font-semibold transition-colors hover:bg-yellow-600 sm:text-2xl"
        >
          Lihat Tata Cara
          <span className="inline-flex items-center">
            <Image src={arrow} alt="arrow" width={24} height={24} />
          </span>
        </a>
      </div>

      {/* section 3 */}
      <div
        className="mb-6 flex items-center justify-center"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="h-auto w-[270px] sm:h-[500-px] sm:w-96">
          <Image src={timeline} alt="timeline" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

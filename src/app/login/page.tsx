import React from 'react';
import Image from "next/image";
import logo from "public/login/login_logo.png";
import google from "public/login/google.svg";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Left section with logo - hidden on mobile */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <Image
          alt="logo"
          src={logo}
          width={521}
          height={497}
          priority
        />
      </div>

      {/* Right section - full width on mobile */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-4 md:p-8 md:bg-[#FAFAFA]">
        <div className="max-w-md w-full">
          <div className="text-start mb-8 md:text-[#3F3F3F] text-[#FAFAFA]">
            <h1 className="text-4xl md:text-6xl font-neuething mb-2">Welcome</h1>
            <h2 className="text-6xl mb-1 md:mb-4">
              <span className="font-sloop text-8xl">B</span>
              <span className="font-playfair">ack</span>
            </h2>
            <p className="text-sm md:text-lg tracking-wide font-satoshi md:font-semibold">
              Hey, Pips! Log in with your std email to get you in
            </p>
          </div>
          
          <button className="w-full p-2 md:p-4 flex items-center justify-center gap-4 bg-white border border-[#3F3F3F] rounded-full hover:bg-gray-50 transition-colors font-satoshi font-bold text-[#3F3F3F] text-sm md:text-base">
            <Image className='md:w-[28px] md:h-[28px] w-[18px] h-[18px]'
              alt='google'
              src={google}
            />
            Log in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
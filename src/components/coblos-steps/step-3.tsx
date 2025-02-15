'use client'
import React from "react"
import Image from "next/image"
import CoblosCard from "../coblos-card"

export default function Step3({senatEmail, onChange}: {senatEmail: string, onChange: (value : string) => void}) {
    const handleSetVoteEmail1 = () => {
        if (senatEmail === "" || senatEmail === "Tidak Setuju") {
            onChange("Darrel"); // CHANGE INTO REAL EMAIL
        }
        else
        {
            onChange("")
        }
    };
    const handleSetVoteEmail2 = () => {
        if (senatEmail === "" || senatEmail === "Darrel") {
            onChange("Tidak Setuju");
        }
        else
        {
            onChange("")
        }
    };
    return (
        <div className="flex-col justify-items-center">
            <div className="items-center mb-20 text-center">
                <h1 className="text-neutral-50 mt-2 font-neuething text-[30px] font-bold tracking-wide leading-[33.60px]">Coblos Calon Senator</h1>
            </div>
            <div className="items-center mb-6">
                <h1 className="text-2xl font-satoshi text-white text-center">Apakah kamu setuju atau tidak setuju calon berikut menjadi senator HMIF?</h1>
            </div>
            <div className="flex" >
                <button onClick={handleSetVoteEmail1} className="mr-8 relative">
                    <CoblosCard number={1} name="Elijah Darrellshane Suryanegara" imageSrc="/calon/Darrel.webp" angkatan="IF'22"/>
                    {
                        senatEmail === "Darrel" && ( // CHANGE INTO REAL EMAIL
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <Image
                                    src="/coblos/paku.svg"
                                    alt={`Setuju`}
                                    width={100}
                                    height={100}
                                    className="z-10"
                                />
                            </div>
                        )
                    }
                </button>
                <button onClick={handleSetVoteEmail2} className="relative">
                    <CoblosCard number={2} name="" imageSrc="/coblos/kotak-kosong.svg" angkatan=""/>
                    {
                        senatEmail === "Tidak Setuju" && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <Image
                                    src="/coblos/paku.svg"
                                    alt={`Tidak Setuju`}
                                    width={100}
                                    height={100}
                                    className="z-10"
                                />
                            </div>
                        )
                    }
                </button>
            </div>
        </div>
    )
}
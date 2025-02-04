'use client'
import React from "react"
import Image from "next/image"
import CoblosCard from "../coblos-card"

export default function Step3({senatVoteValue, onChange}: {senatVoteValue: number, onChange: (value : number) => void}) {
    const handleSetVoteValue1 = () => {
        if (senatVoteValue === 0 || senatVoteValue === 2) {
            onChange(1);
        }
        else
        {
            onChange(0)
        }
    };
    const handleSetVoteValue2 = () => {
        if (senatVoteValue === 0 || senatVoteValue === 1) {
            onChange(2);
        }
        else
        {
            onChange(0)
        }
    };
    return (
        <div className="flex-col justify-items-center">
            <div className="items-center mb-20">
                <h1 className="text-3xl font-satoshi text-white">Coblos Calon Senator</h1>
            </div>
            <div className="items-center mb-6">
                <h1 className="text-2xl font-satoshi text-white">Apakah kamu setuju atau tidak setuju calon berikut menjadi senator HMIF?</h1>
            </div>
            <div className="flex" >
                <button onClick={handleSetVoteValue1} className="mr-8 relative">
                    <CoblosCard number={1} name="Elijah Darrellshane Suryanegara" imageSrc="/calon/Darrel.webp" angkatan="IF'22"/>
                    {
                        senatVoteValue === 1 && (
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
                <button onClick={handleSetVoteValue2} className="relative">
                    <CoblosCard number={2} name="" imageSrc="/coblos/kotak-kosong.svg" angkatan=""/>
                    {
                        senatVoteValue === 2 && (
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
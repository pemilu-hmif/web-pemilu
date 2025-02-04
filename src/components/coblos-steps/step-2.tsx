'use client'
import React from "react"
import Image from "next/image"
import CoblosCard from "../coblos-card"

export default function Step2({ kahimVoteValue, onChange } : {kahimVoteValue: number, onChange : (value : number) => void}) {
    const handleSetVoteValue1 = () => {
        if (kahimVoteValue === 0 || kahimVoteValue === 2) {
            onChange(1);
        }
        else
        {
            onChange(0)
        }
    };
    const handleSetVoteValue2 = () => {
        if (kahimVoteValue === 0 || kahimVoteValue === 1) {
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
                <h1 className="text-3xl font-satoshi text-white">Coblos Calon Ketua Himpunan</h1>
            </div>
            <div className="items-center mb-6">
                <h2 className="text-2xl font-satoshi text-white">Pilih calon ketua himpunan yang ingin dicoblos</h2>
            </div>
            <div className="flex" >
                <button onClick={handleSetVoteValue1} className="mr-8 relative">
                    <CoblosCard number={1} name="Marvin Scifo Y. Hutahaean" imageSrc="/calon/Scifo.webp" angkatan="IF'22"/>
                    {
                        kahimVoteValue === 1 && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <Image
                                    src="/coblos/paku.svg"
                                    alt={`Telah memilih calon 1`}
                                    width={100}
                                    height={100}
                                    className="z-10"
                                />
                            </div>
                        )
                    }
                </button>
                <button onClick={handleSetVoteValue2} className="relative">
                    <CoblosCard number={2} name="Bryan P. Hutagalung" imageSrc="/calon/Bryan.webp" angkatan="STI'22"/>
                    {
                        kahimVoteValue === 2 && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <Image
                                    src="/coblos/paku.svg"
                                    alt={`Telah memilih calon 2`}
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
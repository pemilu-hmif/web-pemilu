'use client'
import React from "react"
import Image from "next/image"
import CoblosCard from "../coblos-card"

export default function Step2({ kahimVoteId, onChange } : {kahimVoteId: number, onChange : (value : number) => void}) {
    const handleSetVoteId1 = () => {
        if (kahimVoteId === 0 || kahimVoteId === 2) {
            onChange(1);
        }
        else
        {
            onChange(0)
        }
    };
    const handleSetVoteId2 = () => {
        if (kahimVoteId === 0 || kahimVoteId === 1) {
            onChange(2);
        }
        else
        {
            onChange(0)
        }
    };
    return (
        <div className="flex-col justify-items-center">
            <div className="items-center mb-20 text-center">
                <h1 className="text-neutral-50 mt-2 font-neuething text-[30px] font-bold tracking-wide leading-[33.60px]">Coblos Calon Ketua Himpunan</h1>
            </div>
            <div className="items-center mb-6 text-center">
                <h2 className="text-2xl font-satoshi text-white">Pilih calon ketua himpunan yang ingin dicoblos</h2>
            </div>
            <div className="flex" >
                <button onClick={handleSetVoteId1} className="mr-8 relative">
                    <CoblosCard number={1} name="Marvin Scifo Y. Hutahaean" imageSrc="/calon/Scifo.webp" angkatan="IF'22"/>
                    {
                        kahimVoteId === 1 && (
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
                <button onClick={handleSetVoteId2} className="relative">
                    <CoblosCard number={2} name="Bryan P. Hutagalung" imageSrc="/calon/Bryan.webp" angkatan="STI'22"/>
                    {
                        kahimVoteId === 2 && (
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
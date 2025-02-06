"use client"
import { useState } from "react";
import Link from "next/link";
import Step1 from "./coblos-steps/step-1";
import Step2 from "./coblos-steps/step-2";
import Step3 from "./coblos-steps/step-3";
import Step4 from "./coblos-steps/step-4";
import SubmittedPage from "./coblos-steps/submitted";

{/* Props for submition */}
type SubmitionProps = {
    kahimVoteId: number;
    senatVoteId: number;
}

{/* 
    To Do
    1. progress dots
    2. aligning buttons nya di height yg sama di setiap page
    3. samain design cardnya dengan yg di figma
    4. mobile version
    
*/}

const steps = [Step1, Step2, Step3, Step4, SubmittedPage]

export default function Onboarding() {
    const [isChecked, setIsChecked] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [step, setStep] = useState(0);

    const [submition, setSubmition] = useState<SubmitionProps>({
        kahimVoteId: 0,
        senatVoteId: 0,
    });

    const handleCheckBoxChange1 = (value: boolean) => {
        setIsChecked(value);
        console.log('Checkbox value:', value);
    }
    const handleKahimVoteId = (value: number) => {
        setSubmition(prev => ({ ...prev, kahimVoteId: value }));
        console.log('Kahim Vote value:', value);
    };

    const handleSenatVoteId = (value: number) => {
        setSubmition(prev => ({ ...prev, senatVoteId: value }));
        console.log(value === 1 ? 'Setuju' : 'Tidak Setuju', `(Value: ${value})`);
    };
    const handleConfirmValue = (value: boolean) => {
        setIsConfirmed(value)
        console.log('Confirm checkbox value: ', value)
    }
    
    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    {/* Handle Submition */}
    //
    //
    
    return (
        <div className="items-center px-4 mt-8">
            {step === 0 && <Step1 onChange={handleCheckBoxChange1} isChecked={isChecked}/>}
            {
                step === 0 && isChecked ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[84px]">
                        <button className="opacity-0 h-[55px] w-[175px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" disabled>
                            Sebelum
                        </button>
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" onClick={handleNext}>
                            Lanjut
                        </button>
                    </div>
                )
                :
                step === 0 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[84px]">
                        <button className="opacity-0 h-[55px] w-[175px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" disabled>
                            Sebelum
                        </button>
                        <button className="opacity-50 h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" disabled>
                            Lanjut
                        </button>
                    </div>
                )
                : 
                null
            }
            {step === 1 && <Step2 onChange={handleKahimVoteId} kahimVoteId={submition.kahimVoteId} />}
            {
                step === 1 && submition.kahimVoteId === 0 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="opacity-50 h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" disabled>
                            Lanjut
                        </button>
                    </div>
                )
                :
                step === 1 && submition.kahimVoteId !== 0 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" onClick={handleNext}>
                            Lanjut
                        </button>
                    </div>
                )
                :
                null
            }
            {step === 2 && <Step3 onChange={handleSenatVoteId} senatVoteId={submition.senatVoteId}/>}
            {
                step === 2 && submition.senatVoteId === 0 ? 
                (
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="opacity-50 h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" disabled>
                            Lanjut
                        </button>
                    </div>
                )
                :
                step === 2 && submition.senatVoteId !== 0 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" onClick={handleNext}>
                            Lanjut
                        </button>
                    </div>
                )
                :
                null
            }
            {step === 3 && <Step4 onChange={handleConfirmValue} isConfirmed={isConfirmed}/>}
            {
                step === 3 && isConfirmed ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[84px]">
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center"onClick={handleNext}>
                            Submit
                        </button>
                    </div>
                )
                :
                step === 3 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[84px]">
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="opacity-50 h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" disabled>
                            Submit
                        </button>
                    </div>
                )
                :
                null
            }
            {step === 4 && <SubmittedPage/>}
            {
                step === 4 ? 
                (
                    <div className="flex items-center justify-center gap-8 mt-[84px]">
                        <Link
                        href="/">

                            <button className="h-[55px] w-[175px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center">
                                Beranda
                            </button>
                            </Link>
                        
                        <button className="opacity-50 h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center">
                            Feedback
                        </button>
                    </div>   
                )
                :
                null
            }
            {
                step < 4 ?
                (
                    <div className="flex justify-center items-center gap-3 mt-4">
                        {[...Array(4)].map((_, index) => (
                            <div
                            key={index}
                            className={`w-3 h-3 mt-10 mb-12 rounded-full ${
                                index === step ? "bg-[#ffbb00]" : "bg-white"
                            } border border-[#ffbb00]`}
                            />
                        ))}
                    </div>
                )
                :
                null
            }
        </div>
    )
}
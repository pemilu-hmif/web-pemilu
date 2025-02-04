"use client"
import { useState } from "react";
import { Checkbox } from "@radix-ui/react-checkbox";
import Step1 from "./coblos-steps/step-1";
import Step2 from "./coblos-steps/step-2";
import Step3 from "./coblos-steps/step-3";
import Step4 from "./coblos-steps/step-4";
import SubmittedPage from "./coblos-steps/submitted";

{/* Props for submition */}
type SubmitionProps = {
    kahimVoteValue: number;
    senatVoteValue: number;
}

const steps = [Step1, Step2, Step3, Step4, SubmittedPage]

export default function Onboarding() {
    const [isChecked, setIsChecked] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [kahimVoteValue, setKahimVoteValue] = useState(0);
    const [senatVoteValue, setSenatVoteValue] = useState(0);
    const [step, setStep] = useState(0);

    const handleCheckBoxChange1 = (value: boolean) => {
        setIsChecked(value);
        console.log('Checkbox value:', value);
    }
    const handleKahimVoteValue = (value: number) => {
        setKahimVoteValue(value)
        console.log('Kahim Vote value: ', value);
    }
    const handleSenatVoteValue = (value: number) => {
        setSenatVoteValue(value)
        if (value === 1) {
            console.log('Setuju (Value: ', value, ')');
        }
        else {
            console.log('Tidak Setuju, (Value: ', value, ')');
        }
    }
    const handleConfirmValue = (value: boolean) => {
        setIsConfirmed(value)
        console.log('Confirm checkbox value: ', value)
    }

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);
    

    return (
        <div className="items-center px-4">
            {step === 0 && <Step1 onChange={handleCheckBoxChange1} isChecked={isChecked}/>}
            {
                step === 0 && isChecked ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[84px]">
                        <button className="opacity-0 h-[53px] w-[150px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" disabled>
                            Sebelum
                        </button>
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" onClick={handleNext}>
                            Lanjut
                        </button>
                    </div>
                )
                :
                step === 0 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[84px]">
                        <button className="opacity-0 h-[53px] w-[150px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" disabled>
                            Sebelum
                        </button>
                        <button className="opacity-50 h-[53px] w-[150px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" disabled>
                            Lanjut
                        </button>
                    </div>
                )
                : 
                null
            }
            {step === 1 && <Step2 onChange={handleKahimVoteValue} kahimVoteValue={kahimVoteValue} />}
            {
                step === 1 && kahimVoteValue === 0 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="opacity-50 h-[53px] w-[150px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" disabled>
                            Lanjut
                        </button>
                    </div>
                )
                :
                step === 1 && kahimVoteValue !== 0 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" onClick={handleNext}>
                            Lanjut
                        </button>
                    </div>
                )
                :
                null
            }
            {step === 2 && <Step3 onChange={handleSenatVoteValue} senatVoteValue={senatVoteValue}/>}
            {
                step === 2 && senatVoteValue === 0 ? 
                (
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="opacity-50 h-[53px] w-[150px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" disabled>
                            Lanjut
                        </button>
                    </div>
                )
                :
                step === 2 && senatVoteValue !== 0 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" onClick={handleNext}>
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
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center">
                            Submit
                        </button>
                    </div>
                )
                :
                step === 3 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[84px]">
                        <button className="h-[53px] w-[150px] px-8 py-3 bg-[#156e3c] border-4 border-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#ffbb00] font-bold flex items-center justify-center" onClick={handlePrev}>
                            Sebelum
                        </button>
                        <button className="opacity-50 h-[53px] w-[150px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center" disabled>
                            Submit
                        </button>
                    </div>
                )
                :
                null
            }
        </div>
    )
}
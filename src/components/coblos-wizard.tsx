"use client"
import { useState } from "react";
import { Checkbox } from "@radix-ui/react-checkbox";
import Step1 from "./coblos-steps/step-1";
import Step2 from "./coblos-steps/step-2";
import Step3 from "./coblos-steps/step-3";
import Step4 from "./coblos-steps/step-4";
// modals to do list:
// 1. check box
// 2. vote
// 3. last check box
// 4. next
// 5. previous (include hide)

const steps = [Step1, Step2, Step3, Step4]

export default function Onboarding() {
    const [isChecked, setIsChecked] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [voted, setVoted] = useState(false);
    const [step, setStep] = useState(0);

    const handleCheckBoxChange1 = (value: boolean) => {
        console.log('Checkbox value:', value);
        setIsChecked(value);
    }

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);


    return (
        <div className="items-center px-4">
            {step === 0 && <Step1 onChange={handleCheckBoxChange1} />}
            {
                isChecked && step === 0 ?
                (
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
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
                    <div className="flex items-center justify-center gap-8 mt-[100px]">
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
            {step === 1 && <Step2 />}
            {step === 2 && <Step3 />}
            {step === 3 && <Step4 />}
        </div>
    )
}
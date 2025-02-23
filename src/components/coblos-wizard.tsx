
"use client"
import { useState } from "react";
import { useSession } from 'next-auth/react';
import Link from "next/link";
import Step1 from "./coblos-steps/step-1";
import Step2 from "./coblos-steps/step-2";
import Step3 from "./coblos-steps/step-3";
import Step4 from "./coblos-steps/step-4";
import SubmittedPage from "./coblos-steps/submitted";

{/* Props for submission */}
type SubmissionProps = {
    userEmail: string;
    kahimEmail: string;
    senatEmail: string;
}

const steps = [Step1, Step2, Step3, Step4, SubmittedPage]

export default function Onboarding() {
    const [isChecked, setIsChecked] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [step, setStep] = useState(0);
    const { data: session, status } = useSession();

    const [submission, setSubmission] = useState<SubmissionProps>({
        userEmail: "",
        kahimEmail: "",
        senatEmail: "",
    });

    const handleCheckBoxChange1 = (value: boolean) => {
        setIsChecked(value);
        console.log('Checkbox value:', value);
    }
    const handleKahimVoteEmail = (value: string) => {
        setSubmission(prev => ({ ...prev, kahimEmail: value }));
        console.log('Kahim Vote value:', value);
    };

    const handleSenatVoteEmail = (value: string) => {
        setSubmission(prev => ({ ...prev, senatEmail: value }));
        console.log(`(Value: ${value})`);
    };
    const handleConfirmValue = (value: boolean) => {
        setIsConfirmed(value)
        console.log('Confirm checkbox value: ', value)
    }

    const handleSubmission = async () => {
        if (!session?.user?.email) {
            console.error("User email not found!");
            return;
        }

        console.log("Submitting vote for email:", session.user.email);
        console.log("Kahim Email:", submission.kahimEmail);
        console.log("Senat Email:", submission.senatEmail);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vote`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail: session.user.email,
                    kahimEmail: submission.kahimEmail,
                    senatEmail: submission.senatEmail, 
                }),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            setStep(step + 1);
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    };
    
    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    {/* Handle Submission */}
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
            {step === 1 && <Step2 onChange={handleKahimVoteEmail} kahimEmail={submission.kahimEmail} />}
            {
                step === 1 && submission.kahimEmail === "" ?
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
                step === 1 && submission.kahimEmail !== "" ?
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
            {step === 2 && <Step3 onChange={handleSenatVoteEmail} senatEmail={submission.senatEmail}/>}
            {
                step === 2 && submission.senatEmail === "" ? 
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
                step === 2 && submission.senatEmail !== "" ?
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
                        <button className="h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center"onClick={handleSubmission}>
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
                        
                        <Link href="https://forms.gle/MgFXABwpVvbnCDMo9">
                        <button className="opacity-50 h-[55px] w-[175px] px-8 py-3 bg-[#ffbb00] rounded-2xl text-2xl font-['Satoshi Variable'] text-[#156e3c] font-bold flex items-center justify-center">
                            Feedback
                        </button>
                        </Link>
                    </div>   
                )
                :
                null
            }
            {
                step < 4 ? (
                    <div className="flex justify-center items-center gap-3 mt-4">
                        {Array.from({ length: 4 }, (_, index) => ( // Fix: Use Array.from with explicit typing
                            <div
                                key={index}
                                className={`w-3 h-3 mt-10 mb-12 rounded-full ${
                                    index === step ? "bg-[#ffbb00]" : "bg-white"
                                } border border-[#ffbb00]`}
                            />
                        ))}
                    </div>
                ) : null
            }
        </div>
    )
}

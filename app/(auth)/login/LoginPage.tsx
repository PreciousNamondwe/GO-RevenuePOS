// app/(auth)/login/page.tsx
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#1b4fa0] flex items-center justify-center p-4 md:p-0 select-none">
      {/* Structural Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[580px] relative">
        
        {/* BRAND COLUMN: Government Crest Visual Base */}
        <div className="w-full md:w-[45%] bg-white flex flex-col items-center justify-center p-8 text-center z-10">
          <div className="relative w-40 h-40 mb-4">
            <Image
              src="/gov_arm.png" 
              alt="Malawi Government Coat of Arms"
              fill
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-[#113264] tracking-tight">
            GO-Revenue
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1.5 max-w-[240px]">
            Secure Government Revenue Management System
          </p>
        </div>

        {/* CSS Angled Separation Slit Effect */}
        <div className="hidden md:block absolute top-0 bottom-0 left-[45%] w-12 bg-white transform -skew-x-12 translate-x-[-50%] z-20 border-r border-slate-100" />

        {/* INPUT COLUMN: Isolated Pluggable Form Node Container */}
        <div className="w-full md:w-[55%] bg-[#16448c] flex flex-col justify-center p-8 sm:p-12 md:pl-16 z-10 text-white">
          <LoginForm />
        </div>

      </div>
    </div>
  );
}
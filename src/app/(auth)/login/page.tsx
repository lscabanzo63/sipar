"use client";
import Image from 'next/image';
export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-brand rounded-[var(--radius-lg)] p-8 shadow-lg
      bg-white">
        <div className="flex justify-center mb-6">
            <Image src='/indigo-group.png' alt="Hero" 
            width={231} 
            height={76} 
            
            />      
        </div>

        <h1 className="text-center text-3xl font-bold">LOGIN</h1>
        <p className="text-center text-sm text-neutral-500 mt-2">
          Please, put the information below:
        </p>

        <form className="mt-8 space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="get@ziontutorial.com"
              className="
                w-full rounded-[var(--radius-ctrl)]
                border border-neutral-300 bg-white px-4 py-3
                outline-none placeholder:text-neutral-400
                focus:border-transparent focus:ring-2 focus:ring-brand
                transition-shadow
              "
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="
                w-full rounded-[var(--radius-ctrl)]
                border border-neutral-300 bg-white px-4 py-3
                outline-none placeholder:text-neutral-400
                focus:border-transparent focus:ring-2 focus:ring-brand
                transition-shadow
              "
            />
          </div>

          <div className="text-sm text-neutral-500 mt-2">Or try to register</div>

          {/* Botones */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              className="
                w-full rounded-[var(--radius-ctrl)]
                bg-brand text-white font-medium px-5 py-3
                hover:bg-brand-600 transition-colors
              "
            >
              Log in
            </button>

            <button
              type="button"
              className="
                w-full rounded-[var(--radius-ctrl)]
                bg-brand text-white font-medium px-5 py-3
                hover:bg-brand-600 transition-colors
              "
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

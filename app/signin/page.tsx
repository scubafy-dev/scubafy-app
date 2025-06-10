// app/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SingIn() {
    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") ?? "/";
    return (
        <button
            onClick={() =>
                signIn("google", {
                    callbackUrl: `/signin/role-selection?callbackUrl=${
                        encodeURIComponent(callbackUrl || "")
                    }`,
                })}
            className="inline-flex items-center bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-6 py-3 rounded-full shadow-lg transition"
        >
            {/* Google “G” logo */}
            <svg
                className="h-6 w-6 mr-3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M21.35 11.1H12v2.8h5.35c-.23 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.15-4.6 3.15-7.65 0-.5-.05-1-.1-1.85z"
                    fill="#4285F4"
                />
                <path
                    d="M12 22c2.7 0 4.9-.9 6.55-2.45l-3.4-2.6c-.9.6-2.05.95-3.15.95-2.4 0-4.45-1.6-5.2-3.8H3.3v2.4C4.95 20.9 8.2 22 12 22z"
                    fill="#34A853"
                />
                <path
                    d="M6.8 14.1c-.2-.6-.35-1.25-.35-1.9s.15-1.3.35-1.9V8.9H3.3c-.7 1.3-1.1 2.75-1.1 4.2s.4 2.9 1.1 4.2l3.5-2.2z"
                    fill="#FBBC05"
                />
                <path
                    d="M12 5.3c1.45 0 2.75.5 3.75 1.45l2.8-2.8C16.95 2.35 14.7 1.4 12 1.4 8.2 1.4 4.95 2.5 3.3 4.9l3.5 2.4c.75-2.2 2.8-3.8 5.2-3.8z"
                    fill="#EA4335"
                />
            </svg>
            Dive in with Google
        </button>
    );
}

export default function SignInPage() {
    return (
        <div
            className="relative flex items-center justify-center h-screen bg-cover bg-center"
            style={{ backgroundImage: 'url("/dive.jpg")' }}
        >
            {/* dark overlay */}
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 text-center text-white px-6">
                <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
                    Welcome to Scubafy
                </h1>
                <p className="mb-8 text-lg drop-shadow">
                    Explore the depths. Track dives. Manage equipments.
                </p>

                <Suspense fallback={<p>Loading...</p>}>
                    <SingIn />
                </Suspense>
            </div>
        </div>
    );
}

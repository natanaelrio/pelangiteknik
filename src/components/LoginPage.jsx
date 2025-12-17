// "use client";
// import { useEffect } from "react";

// export default function LoginPage() {
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (window.google?.accounts) {
//                 clearInterval(interval);

//                 const client = window.google.accounts.oauth2.initCodeClient({
//                     client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//                     scope: "email profile openid",
//                     ux_mode: "popup",
//                     prompt: "select_account",
//                     callback: (res) => {
//                         console.log("Auth Code:", res.code);
//                         // kirim ke API backend kamu di sini
//                         // fetch('/api/auth/google', { method: 'POST', body: JSON.stringify({ code: res.code }) })
//                     },
//                 });

//                 client.requestCode(); // POPUP muncul otomatis
//             }
//         }, 200);
//     }, []);

//     return (
//         <div className="flex items-center justify-center min-h-screen">
//             <p>Memuat login Google…</p>
//         </div>
//     );
// }


"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    useEffect(() => {
        signIn("google");
    }, []);

    return <p>Memuat login…</p>;
}
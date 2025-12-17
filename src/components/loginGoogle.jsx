
'use client'
import styles from '@/components/loginGoogle.module.css'
import { FaGoogle } from "react-icons/fa";
import { useStore } from "@/zustand/zustand";
import { signIn } from "next-auth/react"
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLockBodyScroll } from "@uidotdev/usehooks";

export default function LoginGoogle() {
    useLockBodyScroll();
    const setIsLogin = useStore((state) => state.setIsLogin)
    const pathname = usePathname()
    const url = `${process.env.NEXT_PUBLIC_URL}` + pathname

    const [loading, setLoading] = useState(false)

    const handleSignIn = () => {
        setLoading(true)
        signIn("google", { redirect: false, callbackUrl: url })
        loading(false)
    }

    return (<>
        <div className={styles.bghitam} onClick={() => setIsLogin(loading)}>LoginGoogle</div>
        <div className={styles.container}>
            <div className={styles.judul}>Wellcome Back!</div>
            <div className={styles.subtitle}>Please Sign in to your account</div>
            <div className={styles.tombol} onClick={() => handleSignIn()}><FaGoogle /> &nbsp;{loading ? 'Loading...' : 'Sign in with Google'}</div>
        </div>
    </>
    )
}

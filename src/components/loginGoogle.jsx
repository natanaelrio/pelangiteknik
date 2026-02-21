'use client'

import styles from '@/components/loginGoogle.module.css'
import { FaGoogle } from "react-icons/fa"
import { useStore } from "@/zustand/zustand"
import { signIn } from "next-auth/react"
import { useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLockBodyScroll } from "@uidotdev/usehooks"

export default function LoginGoogle() {
    useLockBodyScroll()

    const setIsLogin = useStore((state) => state.setIsLogin)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [loading, setLoading] = useState(false)

    const handleSignIn = async () => {
        setLoading(true)

        let callbackUrl = ""

        if (pathname === "/search") {
            const q = searchParams.get("q") || ""
            callbackUrl = `${process.env.NEXT_PUBLIC_URL}/search?q=${q}`
        } else {
            callbackUrl = `${process.env.NEXT_PUBLIC_URL}${pathname}`
        }

        await signIn("google", {
            redirect: false,
            callbackUrl
        })

        setLoading(false)
    }

    return (
        <>
            <div
                className={styles.bghitam}
                onClick={() => setIsLogin(false)}
            >
                LoginGoogle
            </div>

            <div className={styles.container}>
                <div className={styles.judul}>Welcome Back!</div>
                <div className={styles.subtitle}>Please Sign in to your account</div>

                <div
                    className={styles.tombol}
                    onClick={handleSignIn}
                >
                    <FaGoogle />
                    &nbsp;
                    {loading ? 'Loading...' : 'Sign in with Google'}
                </div>
            </div>
        </>
    )
}
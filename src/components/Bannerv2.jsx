'use client'

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { useRouter as useRouterv2 } from 'nextjs-toploader/app';
import styles from '@/components/Banner2.module.css'

import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { signOut, useSession } from "next-auth/react"
import Link from 'next/link'
import Image from 'next/image'

import { FaShoppingCart, FaUser } from "react-icons/fa"
import { PiNotepadBold } from "react-icons/pi"

import { Slugify } from "@/utils/slugify"
import { useStore } from "@/zustand/zustand";
import LoginGoogle from "@/components/loginGoogle";

export default function Bannerv2({ data, pathName }) {
    const { data: session, status } = useSession()
    const router = useRouterv2()
    const isLogin = useStore((state) => state.isLogin)
    const setIsLogin = useStore((state) => state.setIsLogin)


    const handleBeliSekarangLogin = async () => {
        setIsLogin()
    }

    const [index, setIndex] = useState(0)

    const [search, setSearch] = useState("")
    const [result, setResult] = useState([])

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true },
        [Autoplay({ delay: 3500, stopOnInteraction: false })]
    )

    /* EMBLA SELECT */

    useEffect(() => {

        if (!emblaApi) return

        const onSelect = () => {
            setIndex(emblaApi.selectedScrollSnap())
        }

        emblaApi.on("select", onSelect)
        onSelect()

    }, [emblaApi])


    /* ENTER SEARCH */

    const handleSearch = () => {

        if (!search.trim()) return

        router.push(`/search?q=${Slugify(search)}`)
    }


    return (
        <>
            <section className={styles.hero}>


                {/* NAVBAR */}

                <div className={styles.navbar}>

                    <Link href="/" className={styles.logo}>

                        <Image
                            src={`${process.env.NEXT_PUBLIC_URL}/logo2.svg`}
                            height={80}
                            width={200}
                            alt="logo"
                        />

                    </Link>


                    <div className={styles.navRight}>

                        {!session ? null : (

                            <>
                                <Link href="/cart" className={styles.navItem}>
                                    <FaShoppingCart size={18} /> Keranjang
                                </Link>

                                <Link href="/order" className={styles.navItem}>
                                    <PiNotepadBold size={18} /> Pesanan
                                </Link>
                            </>

                        )}


                        {!session ? (

                            <div
                                className={styles.navItem}
                                onClick={handleBeliSekarangLogin}
                            >
                                <FaUser size={18} /> Login
                            </div>

                        ) : (

                            <div
                                className={styles.userWrap}
                                onClick={() => signOut({ callbackUrl: pathName })}
                            >

                                <Image
                                    src={session?.user?.image}
                                    width={27}
                                    height={27}
                                    alt="profil"
                                />

                                Logout

                            </div>

                        )}

                    </div>

                </div>



                {/* HERO */}

                <div className={styles.heroContent}>


                    {/* LEFT */}

                    <div className={styles.heroLeft}>

                        <div className={styles.heroBadge}>
                            FEATURED GENERATOR
                        </div>


                        <h1 className={styles.heroTitle}>
                            {data[index]?.title}
                        </h1>


                        <p className={styles.heroDesc}>
                            Katalog mesin terlengkap dengan harga bersaing
                            dan kualitas terbaik untuk mendukung bisnis
                            dan proyek Anda.
                        </p>


                        {/* SEARCH */}

                        <div className={styles.searchBox}>

                            <input
                                type="text"
                                placeholder="Cari produk, merek, atau kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className={styles.searchInput}
                            />


                            {result.length > 0 && (

                                <div className={styles.searchResult}>

                                    {result.map((item, i) => (

                                        <div
                                            key={i}
                                            className={styles.searchItem}
                                            onClick={() =>
                                                router.push(`/search?q=${Slugify(item.title)}`)
                                            }
                                        >

                                            <img
                                                src={item.icon}
                                                className={styles.searchImg}
                                                alt={item.title}
                                            />

                                            <span>{item.title}</span>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>



                    {/* RIGHT */}

                    <div className={styles.heroRight}>

                        <div className={styles.glow}></div>

                        <div className={styles.productWindow}>

                            <div className={styles.windowHeader}>
                                <div className={`${styles.windowDot} ${styles.red}`}></div>
                                <div className={`${styles.windowDot} ${styles.yellow}`}></div>
                                <div className={`${styles.windowDot} ${styles.green}`}></div>
                            </div>


                            <div className={styles.embla} ref={emblaRef}>

                                <div className={styles.emblaContainer}>

                                    {data.map((item, i) => (

                                        <div key={i} className={styles.emblaSlide}>

                                            <Link href={`/category/${item.slugCategory}`}>

                                                <img
                                                    src={item.icon}
                                                    className={styles.productImg}
                                                    alt={item.title}
                                                />

                                            </Link>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>


                </div>

            </section>
            {isLogin && <LoginGoogle />}
        </>
    )
}
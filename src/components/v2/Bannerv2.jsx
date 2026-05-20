'use client'

import { useState, useEffect } from 'react'
import { useRouter as useRouterv2 } from 'nextjs-toploader/app'
import styles from '@/components/v2/Bannerv2.module.css'

import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

import { signOut, useSession } from "next-auth/react"
import Link from 'next/link'
import Image from 'next/image'

import { FaShoppingCart, FaUser, FaBars, FaSearch } from "react-icons/fa"
import { PiNotepadBold } from "react-icons/pi"

import { Slugify } from "@/utils/slugify"
import { useStore } from "@/zustand/zustand"
import LoginGoogle from "@/components/loginGoogle"
import { initFacebookPixel } from '@/utils/facebookPixel'

export default function Bannerv2({ data, pathName, sumView }) {

    const { data: session } = useSession()
    const router = useRouterv2()

    const isLogin = useStore((state) => state.isLogin)
    const setIsLogin = useStore((state) => state.setIsLogin)

    const [index, setIndex] = useState(0)
    const [menuOpen, setMenuOpen] = useState(false)

    const [search, setSearch] = useState("")

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true },
        [Autoplay({ delay: 3500, stopOnInteraction: false })]
    )

    useEffect(() => {
        initFacebookPixel()
    }, [])


    /* EMBLA */

    useEffect(() => {

        if (!emblaApi) return

        const onSelect = () => {
            setIndex(emblaApi.selectedScrollSnap())
        }

        emblaApi.on("select", onSelect)
        onSelect()

    }, [emblaApi])


    /* SEARCH */

    const handleSearch = () => {

        if (!search.trim()) return

        router.push(`/search?q=${Slugify(search)}`)

        setMenuOpen(false)

    }


    /* LOGIN */

    const handleLogin = () => {
        setIsLogin()
    }


    function ekorAngka(n) {
        if (n >= 1000000) return "jutaan";
        if (n >= 1000) return "ribu";
        if (n >= 100) return "ratusan";
        if (n >= 10) return "puluhan";
        return "satuan";
    }


    return (
        <>
            <section className={styles.hero}>


                {/* NAVBAR */}

                <div className={styles.navbar}>


                    {/* LOGO */}

                    <Link href="/" className={styles.logo}>

                        <Image
                            src={`${process.env.NEXT_PUBLIC_URL}/logo2.svg`}
                            height={80}
                            width={200}
                            alt="logo"
                        />

                    </Link>



                    {/* SEARCH DESKTOP */}

                    <div className={styles.navSearch}>

                        <input
                            type="text"
                            placeholder="Cari genset, merek, atau kategori..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className={styles.navSearchInput}
                        />

                    </div>



                    {/* RIGHT */}

                    <div className={styles.navRight}>


                        {/* DESKTOP MENU */}

                        <div className={styles.desktopMenu}>

                            {session && (

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
                                    onClick={handleLogin}
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
                                        width={28}
                                        height={28}
                                        alt="profil"
                                    />

                                    Logout

                                </div>

                            )}

                        </div>



                        {/* HAMBURGER */}

                        <div
                            className={styles.hamburger}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FaBars size={22} />
                        </div>


                    </div>

                </div>



                {/* MOBILE MENU */}

                {menuOpen && (

                    <div className={styles.mobileMenu}>


                        {/* SEARCH */}

                        <div className={styles.mobileSearch}>

                            <input
                                type="text"
                                placeholder="Cari genset..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />

                            <button onClick={handleSearch}>
                                <FaSearch />
                            </button>

                        </div>



                        {session && (

                            <>
                                <Link href="/cart" className={styles.mobileItem}>
                                    <FaShoppingCart /> Keranjang
                                </Link>

                                <Link href="/order" className={styles.mobileItem}>
                                    <PiNotepadBold /> Pesanan
                                </Link>
                            </>

                        )}



                        {!session ? (

                            <div
                                className={styles.mobileItem}
                                onClick={handleLogin}
                            >
                                <FaUser /> Login
                            </div>

                        ) : (

                            <div
                                className={styles.mobileItem}
                                onClick={() => signOut({ callbackUrl: pathName })}
                            >
                                <FaUser /> Logout
                            </div>

                        )}

                    </div>

                )}



                {/* HERO CONTENT */}

                <div className={styles.heroContent}>



                    {/* LEFT */}

                    <div className={styles.heroLeft}>

                        <div className={styles.heroBadge}>
                            <div className={styles.statNumber}>
                                {sumView.toLocaleString('id-ID')} <span className={styles.statSuffix}>{ekorAngka(sumView)}+ Pengunjung</span>
                            </div>
                        </div>

                        <h1 className={styles.heroTitle}>
                            {data[index]?.title}
                        </h1>

                        <p className={styles.heroDesc}>
                            Katalog mesin generator terlengkap dengan harga
                            bersaing dan kualitas terbaik untuk kebutuhan
                            bisnis dan proyek Anda.
                        </p>

                        <button
                            className={styles.heroBtn}
                            onClick={() => router.push("/category")}
                        >
                            Lihat Produk →
                        </button>

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


                            {/* EMBLA */}

                            <div className={styles.embla} ref={emblaRef}>

                                <div className={styles.emblaContainer}>

                                    {data.map((item, i) => (

                                        <div key={i} className={styles.emblaSlide}>

                                            <Link href={`/category/${item.slugCategory}`}>

                                                <div className={styles.productImg}>

                                                    <Image
                                                        src={item.icon}
                                                        width={420}
                                                        height={280}
                                                        alt={item.title}
                                                        priority={i === 0}
                                                    />

                                                </div>

                                            </Link>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* <div className={styles.textoverflay}>
                    {data[index]?.title}
                </div> */}
            </section>

            {isLogin && <LoginGoogle />}

        </>
    )
}
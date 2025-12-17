'use client'

import styles from '@/components/Banner.module.css'
import { GetNumberSalesWA } from '@/controllers/userClient'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'

export default function Banner({ data, sumView }) {
    const [isVisible, setIsVisible] = useState(false)

    const handleScrollToProducts = (e) => {
        e.preventDefault()
        const element = document.getElementById('produk')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    // === keywords + images ===
    const keywords = useMemo(() => data?.map((item) => item?.category) || [], [data])
    const images = useMemo(() => data?.map((item) => item?.icon) || [], [data])
    const slug = useMemo(() => data?.map((item) => item?.slugCategory) || [], [data])

    const [wordIndex, setWordIndex] = useState(0) // index kata
    const [visible, setVisible] = useState([]) // index huruf yg muncul
    const [imageVisible, setImageVisible] = useState(false) // animasi gambar

    // hitung huruf tiap kata dengan aman
    const letters = useMemo(() => {
        if (!keywords.length) return []
        return keywords[wordIndex]?.split("") || []
    }, [keywords, wordIndex])

    // tampilkan section ketika komponen mount
    useEffect(() => {
        setIsVisible(true)
    }, [])

    // animasi per huruf + pergantian kata
    useEffect(() => {
        if (!letters.length) return

        setVisible([]) // reset huruf
        setImageVisible(false) // reset gambar

        // animasi huruf per huruf
        letters.forEach((_, index) => {
            setTimeout(() => {
                setVisible((prev) => [...prev, index])
            }, index * 120)
        })

        // nyalakan gambar fade-in
        const imgTimer = setTimeout(() => {
            setImageVisible(true)
        }, 100)

        // ganti kata + gambar setelah selesai animasi
        const timeout = setTimeout(() => {
            setWordIndex((prev) => (prev + 1) % keywords.length)
        }, letters.length * 120 + 1500)

        return () => {
            clearTimeout(timeout)
            clearTimeout(imgTimer)
        }
    }, [letters]) // ⚡ dependensinya letters, bukan wordIndex

    // === handle WA button ===
    const [isLoading, setIsLoading] = useState(false)

    const handleWhatsapp = async () => {
        setIsLoading(true)
        const phoneNumbers = await GetNumberSalesWA()

        const { trackEvent } = await import('@/utils/facebookPixel');
        process.env.NODE_ENV === 'production' && trackEvent("Contact", {
            method: "WhatsApp",
            currency: "IDR",
            value: 0, // biasanya 0, karena bukan transaksi
            content_name: `WA ${phoneNumbers?.name} - ${phoneNumbers?.numberForm}`
        });

        const encodedMessage = encodeURIComponent(
            `Halo ${phoneNumbers?.name}, saya butuh bantuan lebih lanjut mengenai product Pelangi Teknik`
        )
        const randomPhoneNumber = phoneNumbers.numberWA
        const waUrl = `https://wa.me/${randomPhoneNumber}?text=${encodedMessage}`
        setIsLoading(false)
        window.open(waUrl, "_blank")
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
            <div className={styles.container}>
                <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
                    {/* === text + animasi === */}
                    <div className={styles.textSection}>
                        <h1 className={styles.title2}>
                            Temukan{" "}
                            <span className={styles.highlight}>
                                {letters.map((char, i) => (
                                    <span
                                        key={i}
                                        className={`${styles.word} ${visible.includes(i) ? styles.show : ""
                                            }`}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>
                            <br />
                        </h1>


                        <div className={styles.statsBox}>
                            <div className={styles.statNumber}>
                                {sumView.toLocaleString('id-ID')}<span className={styles.statSuffix}>{ekorAngka(sumView)}+</span>
                            </div>
                            <p className={styles.statDesc}>orang menjelajahi katalog kami</p>
                        </div>

                        <p className={styles.desc}>
                            Katalog mesin terlengkap dengan harga bersaing dan kualitas terbaik
                            untuk mendukung bisnis dan proyek Anda.
                        </p>


                        <Link
                            href={'/product'}
                            target='_blank'
                            // className={styles.cta}
                            className={styles.button}
                        // onClick={handleScrollToProducts}
                        >
                            Jelajahi Katalog <span className={styles.arrow}>→</span>
                        </Link>
                    </div>

                    {/* === image dinamis === */}
                    <Link href={`/category/${slug[wordIndex]}`} target='_blank'>
                        <div className={styles.imageSection}>
                            <Image
                                width={450}
                                height={450}
                                key={wordIndex}
                                src={images[wordIndex]}
                                alt={keywords[wordIndex]}
                                className={`${styles.bannerImage} ${imageVisible ? styles.show : ""
                                    }`}
                            />
                        </div>
                    </Link>
                </div>
            </div>

            {/* === Marquee === */}
            {/* <div className={styles.bannerWrapper}>
                    <div className={styles.marquee}>
                        <div className={styles.marqueeGroup}>
                            <span>
                                ⛈️Dapatkan Diskon dan Tas, setiap Transaksi via Website 🔥{" "}
                                <button onClick={handleWhatsapp}>
                                    {isLoading ? 'Loading...' : 'Chat Sekarang'}     <IoIosArrowForward />
                                </button>
                            </span>
                            <span>
                                ⛈️Dapatkan Diskon dan Tas, setiap Transaksi via Website 🔥{" "}
                                <button onClick={handleWhatsapp}>
                                    {isLoading ? 'Loading...' : 'Chat Sekarang'} <IoIosArrowForward />
                                </button>
                            </span>
                        </div>
                        <div className={styles.marqueeGroup}>
                            <span>
                                ⛈️Dapatkan Diskon dan Tas, setiap Transaksi via Website 🔥{" "}
                                <button onClick={handleWhatsapp}>
                                    {isLoading ? 'Loading...' : 'Chat Sekarang'} <IoIosArrowForward />
                                </button>
                            </span>
                            <span>
                                ⛈️Dapatkan Diskon dan Tas, setiap Transaksi via Website 🔥{" "}
                                <button onClick={handleWhatsapp}>
                                    {isLoading ? 'Loading...' : 'Chat Sekarang'} <IoIosArrowForward />
                                </button>
                            </span>
                        </div>
                    </div>
                </div> */}
        </>
    )
}

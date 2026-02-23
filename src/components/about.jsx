'use client'

import { useState } from 'react'
import styles from '@/components/about.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { IoMdDownload } from "react-icons/io"

export default function About() {

    const [lang, setLang] = useState('id')

    const content = {
        id: {
            tentang: "Tentang Kami",
            deskripsi: `PT Pelangi Teknik Indonesia berdiri sejak tahun 2013,
memproduksi dan mendistribusikan berbagai kebutuhan mesin untuk sektor pertanian,
konstruksi, industri, hingga genset untuk pabrik dan rumahan.

Produk dengan merek Tsuzumi Japan menjadi salah satu pilihan terlaris di pasaran.
Kepuasan pelanggan adalah prioritas utama dengan menghadirkan kualitas terbaik dan layanan profesional.`,
            visiTitle: "Visi",
            visi: "Menjadi perusahaan terkemuka dalam penjualan alat teknik di Indonesia yang berorientasi pada kepuasan pelanggan.",
            misiTitle: "Misi",
            misi1: "Memberikan produk terbaik serta layanan purna jual yang profesional.",
            misi2: "Mengelola perusahaan dengan prinsip good corporate governance dan SDM profesional.",
            portfolio: "PORTOFOLIO",
            download: "Surat Tanda Pendaftaran Distributor/Agen"
        },
        en: {
            tentang: "About Us",
            deskripsi: `PT Pelangi Teknik Indonesia was established in 2013,
manufacturing and distributing machinery for agriculture,
construction, industrial sectors, and generators for factories and residential use.

Products under the Tsuzumi Japan brand are among the best-selling in the market.
Customer satisfaction is our top priority by delivering quality products and professional service.`,
            visiTitle: "Vision",
            visi: "To become a leading company in technical equipment sales in Indonesia with a strong focus on customer satisfaction.",
            misiTitle: "Mission",
            misi1: "Deliver high-quality products with professional after-sales service.",
            misi2: "Manage the company with good corporate governance supported by professional human resources.",
            portfolio: "PORTFOLIO",
            download: "Distributor/Agent Registration Certificate"
        }
    }

    return (
        <>
            {/* LANGUAGE SWITCH */}
            <div className={styles.langSwitcher}>
                <button
                    onClick={() => setLang('id')}
                    className={`${styles.langButton} ${lang === 'id' ? styles.active : ''}`}
                >
                    <span className={styles.flag}>🌐</span>
                    ID
                </button>

                <button
                    onClick={() => setLang('en')}
                    className={`${styles.langButton} ${lang === 'en' ? styles.active : ''}`}
                >
                    <span className={styles.flag}>🌐</span>
                    EN
                </button>
            </div>

            {/* HERO SECTION */}
            <div className={styles.container}>
                <div className={styles.gambar}>
                    <div className={styles.gambarasli}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_URL}/1.jpg`}
                            width={4080}
                            height={3072}
                            alt="company"
                        />
                        <div className={styles.gradient}></div>
                    </div>
                    <div className={styles.mask}></div>
                    <div className={styles.tulisan}>
                        <div className={styles.isi}>
                            <div className={styles.judul}>
                                {content[lang].tentang}
                            </div>
                            <div className={styles.desc}>
                                {content[lang].deskripsi}
                                <div className={styles.download}>
                                    <Link href={'/SURAT-TANDA-PENDAFTARAN-DISTRIBUTOR-ATAU-AGEN-PELANGITEKNIKINDONESIA.pdf'}>
                                        {content[lang].download} <IoMdDownload />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* VISI MISI */}
            <div className={styles.container}>
                <div className={styles.containerbawah}>
                    <div className={styles.gambarbawah}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_URL}/2.png`}
                            width={1080}
                            height={1072}
                            alt="vision"
                        />
                    </div>
                    <div className={styles.text}>
                        <div>
                            <div className={styles.judul}>
                                {content[lang].visiTitle}
                            </div>
                            <div className={styles.desc}>
                                {content[lang].visi}
                            </div>
                        </div>

                        <div>
                            <div className={styles.judul}>
                                {content[lang].misiTitle}
                            </div>
                            <div className={styles.desc}>
                                <ol>
                                    <li>{content[lang].misi1}</li>
                                    <li>{content[lang].misi2}</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PORTFOLIO */}
            <div className={styles.container}>
                <div className={styles.containerprotofolio}>
                    <div className={styles.judul} style={{ textAlign: 'center', padding: '30px 0px' }}>PORTOFOLIO</div>
                    <div className={styles.containerkotak}>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/1.jpg`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/2.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/3.jpg`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/4.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/5.jpg`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/6.jpg`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/7.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/8.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/9.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/10.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/11.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/12.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/13.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/14.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/15.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/16.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/17.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/18.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/19.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/20.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/21.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/22.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/23.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/24.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
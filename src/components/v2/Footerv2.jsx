'use client'

import styles from '@/components/v2/Footerv2.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi"
import TombolWA from '@/components/TombolWA'

export default function FooterV2() {

    const payments = [
        "white-logo-visa.svg",
        "white-logo-mastercard.webp",
        "white-logo-jcb.webp",
        "white-logo-amex.webp",
        "white-logo-bri.webp",
        "white-logo-bni.webp",
        "white-logo-bca.webp",
        "white-logo-mandiri.webp",
    ]

    return (
        <>
            <footer className={styles.footer}>

                <div className={styles.container}>

                    {/* BRAND */}

                    <div className={styles.brand}>

                        <h2 className={styles.logo}>
                            Pelangi Teknik Indonesia
                        </h2>

                        <p className={styles.desc}>
                            Distributor genset terpercaya untuk kebutuhan industri,
                            proyek konstruksi, serta solusi listrik cadangan
                            dengan kualitas mesin terbaik dan dukungan teknis profesional.
                        </p>


                        <div className={styles.contact}>

                            <div className={styles.contactItem}>
                                <FiMapPin />
                                LTC Glodok, Lantai GF2, Blok B7.5
                            </div>

                            <div className={styles.contactItem}>
                                <FiMail />
                                pelangiteknik@rocketmail.com
                            </div>

                            <div className={styles.contactItem}>
                                <FiPhone />
                                0859-3855-2576
                            </div>

                            <div className={styles.contactItem}>
                                <FiPhone />
                                0877-3923-5740
                            </div>

                            <div className={styles.contactItem}>
                                <FiPhone />
                                0859-3855-2586
                            </div>

                        </div>


                        <div className={styles.buttons}>

                            <Link href="/contact" className={styles.primaryBtn}>
                                Hubungi Kami →
                            </Link>

                            <Link href="/blog" className={styles.secondaryBtn}>
                                Blog
                            </Link>

                        </div>

                    </div>


                    {/* PAYMENT */}

                    <div className={styles.footerSection}>

                        <h3>Metode Pembayaran</h3>

                        <div className={styles.paymentGrid}>

                            {payments.map((img, i) => (
                                <Image
                                    key={i}
                                    src={`https://storage.googleapis.com/clevertap-assets/paper-lp/bank-logo/${img}`}
                                    alt={img}
                                    width={60}
                                    height={40}
                                    loading="lazy"
                                />
                            ))}

                            <div className={styles.morePayment}>
                                dan <br /> lainnya
                            </div>

                        </div>

                    </div>



                    {/* QUICK LINKS */}

                    <div className={styles.links}>

                        <h3>Quick Links</h3>

                        <Link href="/product">Produk</Link>
                        <Link href="/about">Tentang Kami</Link>
                        <Link href="/blog">Artikel</Link>
                        <Link href="/contact">Kontak</Link>

                    </div>

                </div>



                {/* BOTTOM */}

                <div className={styles.bottom}>

                    <p>
                        © {new Date().getFullYear()} Pelangi Teknik Indonesia.
                        All rights reserved.
                    </p>

                    <div className={styles.policy}>

                        <Link href="/policies/privacy-policy">
                            Privacy Policy
                        </Link>

                        <Link href="/policies/term-and-condition">
                            Terms of Service
                        </Link>

                        <Link href="/policies/return-refund-policy">
                            Return & Refund Policy
                        </Link>

                        <Link href="/policies/delivery-policy">
                            Delivery Policy
                        </Link>

                    </div>

                </div>

            </footer>

            <TombolWA />
        </>
    )
}
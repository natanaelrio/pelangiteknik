'use client'

import styles from '@/components/Footerv2.module.css'
import Link from 'next/link'
import { FaYoutube, FaTiktok, FaInstagram, FaLinkedin } from "react-icons/fa"
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi"
import TombolWA from './TombolWA'

export default function FooterV2({ data }) {

    return (
        <>
            <footer className={styles.footer}>

                <div className={styles.container}>


                    {/* LEFT */}

                    <div className={styles.brand}>

                        <h2 className={styles.logo}>
                            Pelangi Teknik Indonesia
                        </h2>

                        <p className={styles.desc}>
                            Distributor genset terpercaya untuk industri,
                            proyek konstruksi, dan kebutuhan listrik
                            dengan kualitas mesin terbaik.
                        </p>


                        <div className={styles.contact}>

                            <div className={styles.contactItem}>
                                <FiMapPin /> LTC Glodok, Lantai GF2, Blok B7. 5
                            </div>

                            <div className={styles.contactItem}>
                                <FiMail /> pelangiteknik@rocketmail.com
                            </div>

                            <div className={styles.contactItem}>
                                <FiPhone /> 0859-3855-2576
                            </div>
                            <div className={styles.contactItem}>
                                <FiPhone /> 0877-3923-5740
                            </div>
                            <div className={styles.contactItem}>
                                <FiPhone /> 0859-3855-2586
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



                    {/* SERVICES */}

                    <div className={styles.links}>

                        <h3>Produk</h3>
                        {data?.map((data, i) => {
                            return (
                                <Link key={i} href={`/category/${data.slugCategory}`}>{data.category}</Link>
                            )
                        })}
                        {/* <Link href="/category/genset-diesel">Genset Diesel</Link>
                    <Link href="/category/genset-silent">Genset Silent</Link>
                    <Link href="/category/genset-industrial">Genset Industrial</Link>
                    <Link href="/category/sparepart">Sparepart</Link> */}

                    </div>



                    {/* QUICK LINKS */}

                    <div className={styles.links}>

                        <h3>Quick Links</h3>

                        <Link href="/product">Produk</Link>
                        <Link href="/about">Tentang Kami</Link>
                        <Link href="/blog">Artikel</Link>
                        <Link href="/contact">Kontak</Link>

                    </div>



                    {/* SOCIAL */}

                    <div className={styles.social}>

                        <h3>Follow Us</h3>

                        <div className={styles.icons}>

                            <Link href="#">
                                <FaYoutube />
                            </Link>

                            <Link href="#">
                                <FaTiktok />
                            </Link>

                            <Link href="#">
                                <FaLinkedin />
                            </Link>

                            <Link href="#">
                                <FaInstagram />
                            </Link>

                        </div>

                    </div>

                </div>



                {/* BOTTOM */}

                <div className={styles.bottom}>

                    <p>
                        © {new Date().getFullYear()} Pelangi Teknik. All rights reserved.
                    </p>

                    <div className={styles.policy}>

                        <Link href="/policies/privacy-policy">Privacy Policy</Link>
                        <Link href="/policies/term-and-condition">Terms of Service</Link>
                        <Link href="/policies/return-refund-policy">Return & Refund Policy</Link>
                        <Link href="/policies/delivery-policy">Delivery Policy</Link>

                    </div>

                </div>
            </footer>
            <TombolWA />
        </>
    )
}
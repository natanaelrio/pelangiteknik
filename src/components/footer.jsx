'use client'
import styles from "@/components/footer.module.css"
import { TbHelpSquareFilled } from "react-icons/tb";
import { BsBorderStyle } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaCalendar } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import { useEffect, useRef } from "react";
import { useStore } from "@/zustand/zustand";
import Link from "next/link";
import Image from "next/image";

export default function Footer({ data }) {
  const ref = useRef(null);
  const setIsIntersecting = useStore((state) => state.setIsIntersecting)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null, // Menggunakan viewport sebagai root
        rootMargin: "0px",
        threshold: 0.1 // Elemen dianggap terlihat jika 10% dari ukurannya terlihat di viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const encodedMessage = 'Halo, PT Pelangi Teknik Indonesia'

  return (
    <div className={styles.container} ref={ref}>
      <footer>
        <div className={styles.atas}>
          <div className={styles.atasatas}>
            <div className={styles.help}>
              <div className={styles.judul}>
                Butuh bantuan?
              </div> Kami siap membantu 24 jam sehari, 7 hari seminggu.
            </div>
            <div className={styles.tombol}>
              <button className={styles.satu}> <TbHelpSquareFilled size={20} /> Help Center</button>
              {/* <button className={styles.dua}><FaPhone size={15} /> 0818-0706-7555</button> */}
              <button className={styles.dua}><MdEmail size={15} />Email Us</button>
              <button className={styles.tiga}><BsBorderStyle size={15} /> Order Parts</button>
            </div>
            <div className={styles.garis}></div>

            <div className={styles.list}>
              <div className={styles.produkkategori}>
                <div className={styles.judul}>Produk</div>
                {data?.map((data, i) => {
                  return (
                    <Link key={i} href={`/category/${data.slugCategory}`}>{data.category}</Link>
                  )
                })}
              </div>
              <div className={styles.pusatbantuan}>
                <div className={styles.judul}>Pusat Bantuan</div>
                <Link href="/about">Tentang Kami</Link>
                <Link href="/blog">Blog</Link>
                {/* <Link href="/">Kontak Kami</Link> */}
                <Link href="/">Pelangi Teknik</Link>
                <Link href="/policies/term-and-condition">Syarat dan Ketentuan</Link>
                <Link href="/policies/privacy-policy">Kebijakan Privasi</Link>
                <Link href="/policies/return-refund-policy">Kebijakan Pengembalian & Pengembalian Dana</Link>
                <Link href="/policies/delivery-policy">Kebijakan Pengiriman</Link>
                <Link href="/contact">Hubungi Kami</Link>
                <div className={styles.sosmed}>
                  <FaFacebookSquare /> Facebook
                </div>
                <div className={styles.sosmed}>
                  <FaInstagramSquare /> Instagram
                </div>
                <div className={styles.sosmed}>
                  <FaYoutube /> Youtube
                </div>
                <div className={styles.judul}>Keamanan Data Transaksi</div>
                {/* <Image src={`https://dashboard.duitku.com/Content/Image/logo-duitku-white.png`} alt="sertifikasi" width={200} height={50}></Image> */}
                <div className={styles.duavendor}>
                  <Image src={`https://midtrans.com/assets/img/logo.svg`} alt="sertifikasi" width={120} height={100}></Image>
                  <Image src={`https://storage.googleapis.com/clevertap-assets/paper-lp/paper-logo-light.svg`} alt="sertifikasi" width={120} height={100}></Image>
                </div>
                {/* <Image src={`${process.env.NEXT_PUBLIC_URL}/icon_certificates.jpg`} alt="sertifikasi" width={170} height={100}></Image> */}
                <div className={styles.footerGroup}>
                  {/* Logo Bank / Kartu */}
                  <div className={styles.footerSection}>
                    {[
                      "white-logo-visa.svg",
                      "white-logo-mastercard.webp",
                      "white-logo-jcb.webp",
                      "white-logo-amex.webp",
                      "white-logo-bri.webp",
                      "white-logo-bni.webp",
                      "white-logo-bca.webp",
                      "white-logo-mandiri.webp",
                    ].map((img, i) => (
                      <Image
                        key={i}
                        src={`https://storage.googleapis.com/clevertap-assets/paper-lp/bank-logo/${img}`}
                        alt={img.split("-")[2]?.toUpperCase() + " Logo"}
                        width={60}
                        height={40}
                        loading="lazy"
                      />
                    ))}
                    <div className="footerTextlowOpacity">
                      dan<br />lainnya
                    </div>
                  </div>

                </div>

              </div>
              <div className={styles.alamat}>
                <div className={styles.judul}>Alamat</div>
                <div className={styles.listalamat} style={{ alignItems: 'flex-start' }}>
                  <div className={styles.ikon}>
                    <IoHomeSharp />
                  </div>
                  Alamat : LTC Glodok, Lantai GF2, Blok B7. 5, Jl. Hayam Wuruk No.127, Mangga Besar, Kec. Taman Sari, Daerah Khusus Ibukota Jakarta 11180
                </div>
                <div className={styles.listalamat} >
                  <div className={styles.ikon}>
                    <FaPhoneSquareAlt />
                  </div>
                  <Link href={`https://wa.me/6285938552576?text=${encodedMessage}`}>  Nomer: 0859-3855-2576</Link>
                </div>
                <div className={styles.listalamat} >
                  <div className={styles.ikon}>
                    <FaPhoneSquareAlt />
                  </div>
                  <Link href={`https://wa.me/6287739235740?text=${encodedMessage}`}>  Nomer: 0877-3923-5740</Link>
                </div>
                <div className={styles.listalamat} >
                  <div className={styles.ikon}>
                    <FaPhoneSquareAlt />
                  </div>
                  <Link href={`https://wa.me/6285938552586?text=${encodedMessage}`}>  Nomer: 0859-3855-2586</Link>
                </div>
                {/* <div className={styles.listalamat} >
                  <div className={styles.ikon}>
                    <MdEmail />
                  </div>
                  Email: pelangiteknik@rocketmail.com
                </div> */}
                <div className={styles.listalamat} >
                  <div className={styles.ikon}>
                    <FaCalendar />
                  </div>
                  Monday-Friday: 9:00 AM - 6:00 PM
                </div>
                <div className={styles.listalamat} >
                  <div className={styles.ikon}>
                    <FaCalendar />
                  </div>
                  Saturday: 9:00 AM - 5:00 PM
                </div>
                <iframe className={styles.map} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63470.143651135986!2d106.7407549486328!3d-6.146281799999984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f79b5218b78d%3A0x92b919673c00d2c2!2sPT.%20Pelangi%20Teknik%20Indonesia!5e0!3m2!1sen!2sid!4v1722924758833!5m2!1sen!2sid" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bawah}>
          <div className={styles.bawahbawah}>
            E-Commerce Pelangi Teknik Indonesia © 2026 EPTI All rights reserved.
          </div>
        </div>
      </footer >
    </div >
  )
}

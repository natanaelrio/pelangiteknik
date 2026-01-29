'use client'
import styles from "@/components/header.module.css"
import Image from "next/image"
import Search from "@/components/search"
import { useStore } from "@/zustand/zustand"
import ProductHeaderMelayang from "./productHeaderMelayang"
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa"
import Skeleton from 'react-loading-skeleton'
import { PiNotepadBold } from "react-icons/pi"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { initFacebookPixel } from "@/utils/facebookPixel"
import { Slugify } from "@/utils/slugify"
import TanggalGA from "@/utils/TanggalGA"
import HandleKonversiWA from "@/utils/HandleKonversiWA"
import toast from "react-hot-toast"
import { useRouter } from 'nextjs-toploader/app';

export default function Header({ data, tombolwa, ListSearch }) {
  const setIsLogin = useStore((state) => state.setIsLogin)
  const { data: session, status } = useSession()

  const router = useRouter()

  const pathName = usePathname()
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || '';     // ambil ?q=

  const setProductMelayangHeader = useStore((state) => state.setProductMelayangHeader)
  const productMelayangHeader = useStore((state) => state.productMelayangHeader)
  const setIsMobileMenuOpenPencarian = useStore((state) => state.setIsMobileMenuOpenPencarian)
  const isMobileMenuOpenPencarian = useStore((state) => state.isMobileMenuOpenPencarian)
  const Tanggal = TanggalGA()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const setIsLoadingWA = useStore((state) => state.setIsLoadingWA)
  const isLoadingWA = useStore((state) => state.isLoadingWA)

  useEffect(() => {
    initFacebookPixel()
  }, [])

  const HandlePilihProduct = () => {
    // setProductMelayangHeader(true)
    setIsMobileMenuOpenPencarian(false)
  }

  const handleWhatsapp = async () => {
    try {
      setIsLoadingWA(true)
      const waUrl = await HandleKonversiWA({
        Header: {
          q: q,
          pathName: pathName
        }
      });
      setIsLoadingWA(false)
      window.open(waUrl, "_blank");
    } catch (e) {
      console.log(e);
      toast.error('Gagal membuka WhatsApp. Silakan coba lagi.')
      setIsLoadingWA(false)
    }
  };
  const handleWhatsappVoucher = async () => {
    try {
      setIsLoadingWA(true)
      const waUrl = await HandleKonversiWA({
        fromDataVoucher: true
      });
      setIsLoadingWA(false)
      window.open(waUrl, "_blank");
    } catch (e) {
      console.log(e);
      toast.error('Gagal membuka WhatsApp. Silakan coba lagi.')
      setIsLoadingWA(false)
    }
  };

  const handleBeliSekarangLogin = async () => {
    setIsLogin()
  }

  const navRefMobile = useRef(null)
  const navRefMobilePencarian = useRef(null)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRefMobile.current && !navRefMobile.current.contains(e.target)) {
        setIsMobileMenuOpen(false)
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutsidePencarian = (e) => {
      if (navRefMobilePencarian.current && !navRefMobilePencarian.current.contains(e.target)) {
        setIsMobileMenuOpenPencarian(false)
      }
    }
    if (isMobileMenuOpenPencarian) {
      document.addEventListener("mousedown", handleClickOutsidePencarian)
    } else {
      document.removeEventListener("mousedown", handleClickOutsidePencarian)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePencarian)
    }
  }, [isMobileMenuOpenPencarian])

  const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#C77DFF', '#FF8C32', '#00C49A', '#845EC2', '#FF9671', '#FFC75F'];

  // Acak urutan array warna agar tiap render berbeda
  const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

  const [visible, setVisible] = useState(true);



  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (!scrollRef.current) return
    const distance = 200
    scrollRef.current.scrollBy({
      left: direction === 'right' ? distance : -distance,
      behavior: 'smooth',
    })
  }
  return (
    <header className={styles.header}>

      {Boolean(tombolwa) && (

        <button
          disabled={isLoadingWA}
          className={styles.tombolwa}
          id="whatsapp-button"
          onClick={handleWhatsapp}>
          <div className={styles.tombolwadalam}>
            <Image src={`${process.env.NEXT_PUBLIC_URL}/whatsapp.webp`} height={25} width={25} alt="logo" />
            <div className={styles.wakuy}>
              <span className={styles.wadiskon}>Diskon 3%</span>
              <span>{isLoadingWA ? 'Loading...' : 'WhatsApp'}</span>
            </div>
          </div>
        </button>
      )}

      <div className={styles.atas}>
        <div className={styles.container}>
          {/* MOBILE MENU ICON */}
          <div className={styles.mobileMenuIcon} onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen) }}>
            {isMobileMenuOpen ? <FaTimes size={27} /> : <FaBars size={27} />}
          </div>
          {/* LOGO */}
          <div className={styles.logomobile}>
            <Link href={'/'}>
              <div className={styles.gambar}>
                <Image src={`${process.env.NEXT_PUBLIC_URL}/logo2.svg`} height={80} width={200} alt="logo" />
              </div>
            </Link>
          </div>
          <div className={styles.kirideskop}>
            <Link href={'/'}>
              <div className={styles.gambar}>
                <Image src={`${process.env.NEXT_PUBLIC_URL}/logo2.svg`} height={80} width={180} alt="logo" />
              </div>
            </Link>
            {/* <Link href="/product" className={styles.text3}>
              <div className={styles.about}>List Product</div>
            </Link>

            <div className={styles.text1}>
              <Link href={'/category'}>
                Kategori
              </Link>
            </div> */}
            {/* 
            <Link href="/blog" className={styles.text1}><div className={styles.about}>Blog</div></Link>
            <Link href="/about" className={styles.text3}><div className={styles.about}>Tentang Kami</div></Link> */}
          </div>
          {/* 🔎 Input pencarian */}
          <div className={styles.pencariandeskop}>
            <Search ListSearch={ListSearch} />
          </div>

          {/* DESKTOP MENU */}
          <div className={styles.desktopMenu}>



            {/* ICON GROUP */}
            <div className={styles.iconGroup}>
              {session && <Link href="/cart"><FaShoppingCart size={24} /></Link>}
              {session && <Link href="/order"><PiNotepadBold size={24} /></Link>}

              {!session ? (
                status === 'loading' ? (
                  <>
                    <Skeleton width={50} height={40} borderRadius={24} customHighlightBackground="white" baseColor="white" />
                    <Skeleton width={50} height={40} borderRadius={24} customHighlightBackground="white" baseColor="white" />
                    <Skeleton width={100} height={40} borderRadius={24} customHighlightBackground="white" baseColor="white" />
                  </>
                ) : (
                  <>
                    <FaShoppingCart onClick={handleBeliSekarangLogin} size={24} />
                    <PiNotepadBold onClick={handleBeliSekarangLogin} size={24} />
                    <button className={styles.loginBtn} onClick={handleBeliSekarangLogin}>Login</button>
                  </>
                )
              ) : (
                <>
                  <Link href="/order">
                    <Image src={session?.user?.image} alt="profil" width={27} height={27} />
                  </Link>
                  <span onClick={() => signOut({ callbackUrl: pathName })} className={styles.loginBtn}>Logout</span>
                </>
              )}
            </div>
          </div>

          {/* MOBILE MENU ICON */}
          <div className={styles.mobileMenuIconPencarian} onClick={() => setIsMobileMenuOpenPencarian(!isMobileMenuOpenPencarian)}>
            {isMobileMenuOpenPencarian ? <FaTimes size={27} /> : <FaSearch size={27} />}
          </div>
        </div>


        <div className={styles.header2}>
          <div className={styles.containerlayangan}>
            <button
              className={`${styles.arrow} ${styles.left}`}
              onClick={() => scroll('left')}
            >
              ‹
            </button>

            <div ref={scrollRef} className={styles.layangan}>
              {data?.map((item, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/category/${item?.slugCategory}`)}
                >
                  {item?.category}
                </button>
              ))}
            </div>

            <button
              className={`${styles.arrow} ${styles.right}`}
              onClick={() => scroll('right')}
            >
              ›
            </button>
          </div>
        </div>


        {/* MENU MOBILE */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu} ref={navRefMobile}>
            <Link onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} href="/product" className={styles.mobileItem}>LIST PRODUK</Link>
            <Link onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} href="/category"><div className={styles.mobileItem} >KATEGORI</div></Link>
            <Link onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} href="/blog" className={styles.mobileItem}>BLOG</Link>
            <Link onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} href="/about" className={styles.mobileItem}>TENTANG KAMI</Link>
            {!session ? null : (
              <>
                <div className={styles.mobileItem} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Link href="/cart"><FaShoppingCart size={20} /> Keranjang</Link></div>
                <div className={styles.mobileItem} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Link href="/order"><PiNotepadBold size={20} /> Pesanan</Link></div>
              </>
            )}

            <div className={styles.mobileItem}>
              {!session ? (
                status === 'loading' ? (
                  <Skeleton width={27} height={27} borderRadius={50} />
                ) : (
                  <div onClick={() => { handleBeliSekarangLogin(); setIsMobileMenuOpen(!isMobileMenuOpen) }}><FaUser size={20} /> Login</div>
                )
              ) : (
                <div onClick={() => { signOut({ callbackUrl: pathName }); setIsMobileMenuOpen(!isMobileMenuOpen) }} className={styles.userWrap}>
                  <Image src={session?.user?.image} alt="profil" width={27} height={27} />
                  <span>Logout</span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* MENU MOBILE PENCARIAN*/}
        {isMobileMenuOpenPencarian && (
          <div className={styles.mobileMenu} ref={navRefMobilePencarian}>
            <div className={styles.mobileItem}>
              <Search />
              <div className={styles.rekomendasiWrap}>
                <h4 className={styles.rekomendasiTitle}>🔥 Pencarian Populer</h4>
                <div className={styles.rekomendasiList}>
                  {ListSearch?.map((item, idx) => (
                    <Link
                      key={idx}
                      onClick={() => setIsMobileMenuOpenPencarian(false)}
                      href={`/search?q=${Slugify(item)}`}
                      className={styles.rekomendasiItem}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* {!session ? null : (
              <>
                <div onClick={() => setIsMobileMenuOpenPencarian(false)} className={styles.mobileItem}><Link href="/cart"><FaShoppingCart size={20} /> Keranjang</Link></div>
                <div onClick={() => setIsMobileMenuOpenPencarian(false)} className={styles.mobileItem}><Link href="/order"><PiNotepadBold size={20} /> Pesanan</Link></div>
              </>
            )} */}

            {!isMobileMenuOpenPencarian &&
              <div className={styles.mobileItem}>
                {!session ? (
                  status === 'loading' ? (
                    <Skeleton width={27} height={27} borderRadius={50} />
                  ) : (
                    <div onClick={handleBeliSekarangLogin}><FaUser size={20} /> Login</div>
                  )
                ) : (
                  <div onClick={() => signOut({ callbackUrl: pathName })} className={styles.userWrap}>
                    <Image src={session?.user?.image} alt="profil" width={27} height={27} />
                    <span>Logout</span>
                  </div>
                )}
              </div>}
          </div>

        )}

        {productMelayangHeader && <ProductHeaderMelayang data={data} />}
      </div>


    </header >
  )
}

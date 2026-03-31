'use client'

import styles from "@/components/v2/ListProducts.module.css"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { GetProductClient } from '@/controllers/userClient'
import { toast } from "react-hot-toast"
import { useStore } from "@/zustand/zustand";
import { IoIosArrowForward, IoMdEye } from "react-icons/io";

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
};

export default function ListProducts({ data, title }) {
    const setIsPenawaran = useStore((state) => state.setIsPenawaran)
    const setDataPenawaran = useStore((state) => state.setDataPenawaran)
    const [loadingSlug, setLoadingSlug] = useState(null)

    const handleClickPenawaran = async (e, item) => {
        e.preventDefault()
        e.stopPropagation()
        setLoadingSlug(item.slugProduct)

        try {
            const dataku = await GetProductClient(item.slugProduct)
            const { trackEvent } = await import('@/utils/facebookPixel')

            if (process.env.NODE_ENV === 'production') {
                trackEvent("InitiateCheckout", {
                    content_ids: [dataku[0]?.slugProduct],
                    content_type: `${dataku[0]?.user?.categoryProductUtama?.category} - ${dataku[0]?.user?.category}`,
                    value: parseFloat(dataku[0]?.productPriceFinal),
                    currency: "IDR",
                    num_items: 1
                })
            }

            setDataPenawaran(dataku[0])
            setIsPenawaran(true)
        } catch (err) {
            console.log(err)
            toast.error("Terjadi Kesalahan, Silahkan Coba Lagi")
        } finally {
            setLoadingSlug(null)
        }
    }

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title || "Produk Terpopuler"}</h2>
                <p className={styles.desc}>
                    Pilihan genset paling banyak dicari untuk industri,
                    proyek konstruksi, dan kebutuhan listrik skala besar.
                </p>
            </div>

            <div className={styles.grid}>
                {data?.map((item, i) => (
                    <div key={i} className={styles.card}>
                        <Link href={`/product/${item.slugProduct}`} className={styles.cardLink}>
                            <div className={styles.imageWrap}>
                                <Image
                                    src={item.imageProductUtama?.secure_url || `${process.env.NEXT_PUBLIC_URL}/notfoundicon.jpg`}
                                    alt={item.productName}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className={styles.image}
                                />
                                <span className={styles.badge}>
                                    {item?.fMerek?.[0]?.name?.toUpperCase() || "Industrial Generator"}
                                </span>
                            </div>
                            <div className={styles.info}>
                                <h3 className={styles.name}>{item.productName}</h3>
                                <div className={styles.price}>
                                    {formatRupiah(item?.productPriceFinal)}
                                </div>
                            </div>
                        </Link>
                        <Link href={`/product/${item.slugProduct}`} className={styles.detailBtn}>
                            <IoMdEye size={16} />
                            Detail
                        </Link>
                        <button
                            className={styles.penawaranBtn}
                            onClick={(e) => handleClickPenawaran(e, item)}
                            disabled={loadingSlug === item.slugProduct}
                        >
                            {loadingSlug === item.slugProduct ? (
                                "Memproses..."
                            ) : (
                                <>
                                    Minta Surat Penawaran
                                    <IoIosArrowForward size={16} />
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.moreWrap}>
                <Link href="/product" className={styles.viewMore}>
                    Lihat Semua Produk
                    <IoIosArrowForward size={18} />
                </Link>
            </div>
        </section>
    )
}

'use client'

import styles from "@/components/v2/ListProducts.module.css"
import Link from "next/link"
import { useState } from "react"
import { GetProductClient } from '@/controllers/userClient'
import { toast } from "react-hot-toast"
import { useStore } from "@/zustand/zustand";
import { IoIosArrowForward } from "react-icons/io";
import ProductCard from '@/components/ProductCard';

export default function ListProducts({ data, title }) {
    const setIsPenawaran = useStore((state) => state.setIsPenawaran)
    const setDataPenawaran = useStore((state) => state.setDataPenawaran)
    const [loadingSlug, setLoadingSlug] = useState(null)

    const handleClickPenawaran = async (item) => {
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
                    <ProductCard
                        key={i}
                        product={item}
                        index={i}
                        loadingSlug={loadingSlug}
                        onPenawaran={handleClickPenawaran}
                    />
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

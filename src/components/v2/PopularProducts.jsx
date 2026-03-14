'use client'

import styles from "@/components/v2/PopularProducts.module.css"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { GetProductClient } from '@/controllers/userClient'
import { toast } from "react-hot-toast"
import { useStore } from "@/zustand/zustand";

export default function PopularProducts({
    data,
}) {
    const setIsPenawaran = useStore((state) => state.setIsPenawaran)
    const setDataPenawaran = useStore((state) => state.setDataPenawaran)
    const [loadingSlug, setLoadingSlug] = useState(null)

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };


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
                    content_type:
                        dataku[0]?.user?.categoryProductUtama?.category +
                        " - " +
                        dataku[0]?.user?.category,
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

                <h2 className={styles.title}>
                    Produk Genset Populer
                </h2>

                <p className={styles.desc}>
                    Pilihan genset paling banyak dicari untuk industri,
                    proyek konstruksi, dan kebutuhan listrik skala besar.
                </p>

            </div>


            <div className={styles.grid}>

                {data?.map((item, i) => (

                    <div
                        key={i}
                        href={`/product/${item.slugProduct}`}
                        className={styles.card}
                    >
                        <Link href={`/product/${item.slugProduct}`}>
                            <div className={styles.imageWrap}>
                                <Image
                                    width={500}
                                    height={500}
                                    src={item.imageProductUtama?.secure_url}
                                    alt={item.productName}
                                    className={styles.image}
                                />

                            </div>
                        </Link>

                        <div className={styles.info}>
                            <Link href={`/product/${item.slugProduct}`}>
                                <h3 className={styles.name}>
                                    {item.productName}
                                </h3>
                            </Link>
                            <Link href={`/product/${item.slugProduct}`}>
                                <p className={styles.meta}>
                                    {item?.fMerek?.[0]?.name?.toUpperCase() || "Industrial Generator"}
                                </p>
                            </Link>
                            <Link href={`/product/${item.slugProduct}`}>
                                <div className={styles.price}>
                                    {formatRupiah(item?.productPrice)}
                                </div>
                            </Link>
                            <button
                                className={styles.penawaranBtn}
                                onClick={(e) => handleClickPenawaran(e, item)}
                            >
                                {loadingSlug === item.slugProduct
                                    ? "Memproses..."
                                    : "Minta Surat Penawaran"}
                            </button>

                        </div>

                    </div>

                ))}

            </div>


            <div className={styles.moreWrap}>

                <Link
                    href="/product"
                    className={styles.viewMore}
                >
                    Lihat Semua Produk →
                </Link>

            </div>

        </section>

    )
}
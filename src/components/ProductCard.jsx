'use client'
import Link from 'next/link'
import Image from 'next/image'
import { MdOutlineSimCardDownload } from 'react-icons/md'
import { IoMdEye } from 'react-icons/io'

// Utils
import convertToRupiah from '@/utils/ConvertRupiah'

// Styles
import styles from '@/components/listProduct.module.css'

export default function ProductCard({ product, index, angka, loadingSlug, onPenawaran }) {
    const productType = product?.productType?.toUpperCase() || ''
    const isThisLoading = loadingSlug === product?.slugProduct

    return (
        <div className={styles.kotak}>
            <div>
                <Link href={`/product/${product?.slugProduct}`}>
                    <div className={styles.gambarbawah}>
                        <Image
                            src={
                                product?.imageProductUtama?.secure_url ||
                                product?.imageProductUtama ||
                                `${process.env.NEXT_PUBLIC_URL}/notfoundicon.jpg`
                            }
                            alt={product?.productName}
                            width={250}
                            height={250}
                        />
                        <div className={styles.typemerek}>
                            <span
                                className={styles.fMerek}
                                dangerouslySetInnerHTML={{
                                    __html: product?.highlight?.productType || productType,
                                }}
                            />
                        </div>
                    </div>
                    <div
                        className={styles.name}
                        dangerouslySetInnerHTML={{
                            __html: product?.highlight?.productName || product?.productName,
                        }}
                    />
                    <div className={styles.price}>
                        {convertToRupiah(Number(product?.productPriceFinal))}
                    </div>
                </Link>
            </div>

            {angka && product?.length && (
                <Link href={`/product/${product?.slugProduct}`}>
                    <div className={styles.angka}>
                        <span className={styles.satu}>TOP {index + 1}</span>
                        <span className={styles.dua} />
                    </div>
                </Link>
            )}

            <div className={styles.bawahdetail}>
                <button
                    disabled={isThisLoading}
                    className={styles.penawaran}
                    onClick={() => onPenawaran(product)}
                >
                    <MdOutlineSimCardDownload /> &nbsp;
                    {isThisLoading ? 'Loading...' : 'Surat Penawaran'}
                </button>
                <div className={styles.penawaran}>
                    <Link href={`/product/${product?.slugProduct}`}>
                        <IoMdEye size={16} /> Detail Product
                    </Link>
                </div>
            </div>
        </div>
    )
}

import React from "react";
import styles from "@/components/artikel/ProductCard.module.css";
import Link from "next/link";

export default function ProductCard({ product }) {
    return (
        <div className={styles.productCard}>
            <img
                src={product?.imageProductUtama?.secure_url}
                alt={product?.productName}
                className={styles.productImage}
            />

            <div className={styles.productInfo}>
                <div className={styles.productTitle}>{product?.productName}</div>
                {/* <p className={styles.productSpek}>{product.spekNew?.[2]?.isi || ""}</p> */}

                <p className={styles.productStock}>
                    Stok: <span>{product?.stockProduct}</span>
                </p>

                <p className={styles.productPrice}>
                    Rp {Number(product?.productPriceFinal).toLocaleString("id-ID")}
                </p>

                <Link
                    href={`/product/${product?.slugProduct}`}
                    className={styles.btnBeli}
                >
                    Beli Sekarang
                </Link>
            </div>
        </div>
    );
}

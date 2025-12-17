import React from "react";
import styles from "@/components/test/loading.module.css";

export default function Loading({ text = "Loading...", full = true }) {
    return (
        <>
            <div className={full ? styles.fullScreen : styles.inline}></div>
            <img
                src={`${process.env.NEXT_PUBLIC_URL}/logov2.svg`} // ganti sesuai lokasi gambarmu
                alt="Loading"
                className={styles.spinner}
            />
            <p className={styles.text}>{text}</p>
        </>
    );
}

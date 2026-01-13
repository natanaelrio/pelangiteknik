'use client';
import styles from '@/components/productHeaderMelayang.module.css'
import Image from 'next/image';
import { useRouter } from 'nextjs-toploader/app';
import { useStore } from "@/zustand/zustand";
import { useEffect, useRef } from 'react';

export default function ProductHeaderMelayang({ data }) {
    const router = useRouter()
    const navRef = useRef(null);

    const setProductMelayangHeader = useStore((state) => state.setProductMelayangHeader)
    const productMelayangHeader = useStore((state) => state.productMelayangHeader)

    const handleKlikProduct = (e) => {
        router.push(`/category/` + e)
        setProductMelayangHeader()
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setProductMelayangHeader(false)
            }
        };

        if (productMelayangHeader) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [productMelayangHeader]);


    return (
        <>
            <div className={styles.melayang}></div>
            <div className={styles.isimelayang} ref={navRef}>
                <div className={styles.isimelayangdalam}>
                    <div className={styles.dalamkontainer}>
                        {data?.map((data, i) => {
                            return (
                                <div className={styles.kotak}
                                    key={i}
                                    onClick={() => handleKlikProduct(data?.slugCategory)}
                                >
                                    <Image
                                        src={data?.icon}
                                        alt={data?.category}
                                        width={100}
                                        height={100}
                                    />
                                    {data?.category}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

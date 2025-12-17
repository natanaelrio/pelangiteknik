'use client'
import Image from "next/image";
import styles from '@/components/category.module.css'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Category({ data, kondisi }) {
    const pathname = usePathname()
    const subCategoryName = pathname.split("?")[0].split("/").pop();

    return (
        <div className={styles.container}>
            <div className={styles.dalamcontainer}>
                <div className={styles.grid}>
                    {data?.map((data, i) => {
                        return (
                            data?.icon != "https://www.pelangiteknik.com/notfoundicon.jpg" &&
                            <Link
                                key={i}
                                href={kondisi ? `/category/` + `${subCategoryName}/` + data?.slugCategory : `/category/` + data?.slugCategory}
                                className={styles.kotakisi}>
                                <div className={styles.gambar}>
                                    <Image
                                        src={data?.icon}
                                        alt={data?.category}
                                        width={300}
                                        height={300}
                                    ></Image>
                                </div>
                                <div className={styles.text}>{data?.category}</div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

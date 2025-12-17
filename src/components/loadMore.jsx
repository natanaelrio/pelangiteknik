'use client'

import styles from '@/components/loadMore.module.css'
import { MdArrowForwardIos } from "react-icons/md";
import Link from 'next/link';

export default function LoadMore() {
    return (
        <div className={styles.container} >
            <Link href={'/product'}>
                <div className={styles.dalamcontainer} >
                    <button>Load More <MdArrowForwardIos /></button>
                </div>
            </Link>
        </div>
    )
}

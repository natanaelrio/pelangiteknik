import styles from '@/components/judulPencarian.module.css'
import { UnslugifyMerek } from '@/utils/unSlugifyMerek'
import { usePathname, useSearchParams } from 'next/navigation'

export default function JudulPencarian({ judul }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const m = searchParams.get('m')
    return (
        <div className={styles.container}>
            <h1 className={styles.dalamkontainer}>
                {pathname == '/product' || pathname == '/shop' && judul}
                {pathname == '/search' && judul + ' ' + decodeURIComponent(m ? UnslugifyMerek(m) : '')}
            </h1>
        </div>
    )
}
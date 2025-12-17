import styles from '@/components/judul.module.css'

export default function Judul({ judul }) {
    return (
        <div className={styles.container}>
            <div className={styles.dalamkontainer}>
                {judul}
            </div>
        </div>
    )
}

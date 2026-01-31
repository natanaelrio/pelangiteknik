import styles from '@/components/productDetail.module.css'

export default function ProductDetail({ data }) {

    return (
        <>
            <div className={styles.deskripsiNew} dangerouslySetInnerHTML={{ __html: data }} />
        </>
    );
}

import styles from '@/components/product.module.css'

export default function ProductSpecs({ data }) {

    return (
        <div className={styles.specs}>
            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Specification</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) => {
                        return (
                            <tr>
                                <td>{data.input}</td>
                                <td>{data.isi}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

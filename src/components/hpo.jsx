import styles from '@/components/hpo.module.css'
import { RiQuestionnaireFill } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { RiKeyboardBoxFill } from "react-icons/ri";
import Link from 'next/link';

export default function Hpo() {
    return (
        <div className={styles.container}>
            <div className={styles.containerdalam}>
                <div className={styles.list} >
                    <RiQuestionnaireFill className={styles.help} />
                    <div className={styles.text}>
                        HELP CENTER
                    </div>
                </div>
                <div className={styles.list} >
                    <FaRegEdit className={styles.productregistion} />
                    <div className={styles.text}>
                        PRODUCT REGISTRATION
                    </div>
                </div>
                <div
                    className={styles.list} >
                    <RiKeyboardBoxFill className={styles.orderparts} />
                    <Link href={'/product'}>
                        <div className={styles.text}>
                            ORDER PARTS
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    )
}

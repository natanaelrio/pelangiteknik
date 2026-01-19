'use client'
import styles from '@/components/listProduct.module.css'
import convertToRupiah from '@/utils/ConvertRupiah'
import useWindowDimensions from '@/utils/getWindowDimensions'
import Image from 'next/image'
import { useState } from 'react'
import { CiFilter } from "react-icons/ci";
import Judul from './judul';
import Link from 'next/link';
import LoadingList from '@/components/skleton/loadingList'
import { useStore } from "@/zustand/zustand";
import { GetKategori, GetProduct } from "@/controllers/userNew";
import { MdOutlineSimCardDownload } from "react-icons/md";
import { IoIosArrowDropright } from "react-icons/io";
import { useRouter } from 'nextjs-toploader/app';
import { useRouter as useRouterReal } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ListProduct({ bestProduk, Listdata, FilterCategory, Lfilter, Fillter, textSearch, angka, loadmore }) {
    const { width } = useWindowDimensions()
    const router = useRouter()
    const routerReal = useRouterReal()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const match = pathname.match(/^\/category\//);
    const baseCategory = match ? match[0] : "";
    const category = pathname.split('/').pop();

    const m = searchParams.get('m')

    const kondisiLebar = width <= 1000

    const [dataProduct, setDataProduct] = useState(Listdata)
    const [kategori, setKategori] = useState(!kondisiLebar)
    const setIsPenawaran = useStore((state) => state.setIsPenawaran)
    const setDataPenawaran = useStore((state) => state.setDataPenawaran)
    const isLoading = useStore((state) => state.isLoading)
    const setIsLoading = useStore((state) => state.setIsLoading)

    const handleKategori = () => {
        kondisiLebar ? setKategori(!kategori) : setKategori(true)
    }

    const HandlePenawaran = async (e) => {
        setIsLoading(true)
        try {
            setIsLoading(true)
            const dataku = await GetProduct(e.slugProduct)
            const { trackEvent } = await import('@/utils/facebookPixel');
            process.env.NODE_ENV === 'production' && trackEvent("InitiateCheckout", {
                content_ids: [dataku[0]?.slugProduct],
                content_type: dataku[0]?.user?.categoryProductUtama?.category + " - " + dataku[0]?.user.category,
                value: parseFloat(dataku[0]?.productPriceFinal),
                currency: 'IDR',
                num_items: 1
            });
            setIsLoading(false)
            setDataPenawaran(dataku[0])
            setIsPenawaran()
        } catch (err) {
            setIsLoading(false)
            console.log(err);
            toast.error('Terjadi Kesalahan, Silahkan Coba Lagi')
        }

        // process.env.NODE_ENV === 'production' && trackEvent("Lead", {
        //     content_ids: [dataku[0]?.slugProduct],
        //     content_type: dataku[0]?.user?.categoryProductUtama?.category + " - " + dataku[0]?.user.category,
        //     value: parseFloat(dataku[0]?.productPriceFinal),
        //     currency: 'IDR',
        //     num_items: 1
        // });
    }

    const handleLoadMore = () => {
        router.push('/product')
    }

    const HandleFillter = async (id, e) => {
        const data = await GetKategori(category, e)
        baseCategory == '/category/' && setDataProduct(data[0]?.listProducts)
        baseCategory == '/category/' && router.push(`${pathname}?${id == 'idM' && `m=${e}`}`)
        routerReal.refresh()
    }

    const HandleCloseFillter = async (id) => {
        const data = await GetKategori(category, 'undefined')
        baseCategory == '/category/' && setDataProduct(data[0]?.listProducts)
        baseCategory == '/category/' && router.push(`${pathname}?${id == 'idM' && `m=${''}`}`)
        routerReal.refresh()
    }

    const merekClass = {
        'montoya': styles.montoya,
        'faw vw': styles.fawvw,
        'champion': styles.champion,
        'tsuzumi japan': styles.tsuzumi,
        'isuzu': styles.isuzu,
        'hidemitsu': styles.hidemitsu,
        'isuzu tsuzumi': styles.isuzutsuzumi,
    };
    return (
        <div className={styles.container} >
            <div className={styles.dalamkontainer} >
                {textSearch && <Judul judul={decodeURIComponent(textSearch)} />}
                <div className={styles.bawah}>
                    {Lfilter &&
                        <div className={styles.filter}>
                            <div className={styles.dalamfilter}>
                                <div className={styles.judul} onClick={handleKategori}>
                                    <div className={styles.text}>Merek</div>
                                    <div className={styles.icon}><CiFilter /></div>
                                </div>
                                {m ?
                                    <div className={styles.filternya}>
                                        <div className={styles.box}>{m}</div>
                                        <div className={styles.close} onClick={() => HandleCloseFillter('idM')}>x</div>
                                    </div> :
                                    kategori &&
                                    <div className={styles.kategori}>
                                        {Fillter?.map((data, i) => {
                                            if (!data?.name) return null; // Sembunyikan jika nama kosong
                                            return (
                                                <div style={data._count.Merek == 0 ? { display: 'none' } : { display: 'flex' }} className={styles.list} key={i} onClick={(e) => HandleFillter('idM', data?.name)}>
                                                    <label className={styles.checkboxLabel}>
                                                        <input
                                                            type="checkbox"
                                                            className={styles.checkbox}
                                                            onChange={(e) => HandleFillter('idM', data?.name, e.target.checked)}
                                                        />
                                                        <span className={styles.text}>{data?.name}({data._count.Merek})</span>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>

                                }
                            </div>
                        </div>
                    }
                    <div className={styles.listproduct}>
                        <div className={styles.grid} id='produk'>
                            {dataProduct?.length ?
                                dataProduct?.map((data, i) => {
                                    const namaMerek = data?.fMerek?.[0]?.name.toUpperCase();
                                    const typeMerek = data?.productType
                                    return (
                                        <div key={i} className={styles.kotak}>
                                            <div>
                                                <Link href={`/product/${data?.slugProduct}`}>
                                                    <div className={styles.gambarbawah}>
                                                        <Image
                                                            src={data?.imageProductUtama?.secure_url}
                                                            alt={data?.productName}
                                                            width={250}
                                                            height={250}
                                                        // fill
                                                        // sizes="(max-width: 600px) 100vw,
                                                        //  (max-width: 1200px) 50vw,
                                                        //   33vw"
                                                        // priority
                                                        >
                                                        </Image>
                                                        {!bestProduk &&
                                                            <>
                                                                <div className={styles.typemerek}>
                                                                    <span className={`${styles.fMerek} ${merekClass[namaMerek?.toLowerCase()] || ''
                                                                        }`}
                                                                    >{typeMerek.toUpperCase()}</span>
                                                                    {/* <span className={styles.type}>{typeMerek}</span> */}
                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                                    <div className={styles.name}>
                                                        {data?.productName}
                                                    </div>

                                                    <div className={styles.price}>
                                                        {convertToRupiah(Number(data?.productPriceFinal))}
                                                    </div>
                                                </Link>
                                            </div>
                                            {
                                                dataProduct?.length && angka && <Link href={`/product/${data?.slugProduct}`}>
                                                    <div className={styles.angka}>
                                                        <span className={styles.satu} >TOP {i + 1}</span>
                                                        <span className={styles.dua}></span>
                                                    </div>
                                                </Link>
                                            }
                                            <div className={styles.bawahdetail}>
                                                <button disabled={isLoading} className={styles.penawaran} onClick={() => HandlePenawaran(data)} >
                                                    <MdOutlineSimCardDownload /> &nbsp;{isLoading ? "Loading..." : "Surat Penawaran"}
                                                </button>
                                                <div className={styles.penawaran}><Link href={`/product/${data?.slugProduct}`}>Detail Product </Link></div>
                                            </div>
                                        </div>
                                    )
                                })
                                : <LoadingList />}
                            {dataProduct?.length && loadmore && <div className={styles.kotak} onClick={handleLoadMore}>
                                <div className={styles.loadmore}>
                                    <div>
                                        <IoIosArrowDropright size={40} />
                                    </div>
                                    <div>
                                        Load More
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

'use client'
import styles from '@/components/listProduct.module.css'
import convertToRupiah from '@/utils/ConvertRupiah'
import useWindowDimensions from '@/utils/getWindowDimensions'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CiFilter } from "react-icons/ci";
import Link from 'next/link';
import LoadingList from '@/components/skleton/loadingList'
import { GetSearchServerElasticSearch } from '@/controllers/userNewC'
import { IoIosArrowDropright } from "react-icons/io";
import { MdOutlineSimCardDownload } from "react-icons/md";
import { useStore } from "@/zustand/zustand";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app';
import { usePathname } from 'next/navigation'
import JudulPencarian from './judulPencarian'
import { Slugify } from '@/utils/slugify'
import { UnslugifyMerek } from '@/utils/unSlugifyMerek'
import { sendGAEventL } from '@/lib/ga'
import toast from 'react-hot-toast'
import { GetProductClient } from '@/controllers/userClient'

export default function ListProductUser({ angka, Lfilter, res, t, q }) {

    const { width } = useWindowDimensions()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const m = searchParams.get('m')
    const kondisiLebar = width <= 1000

    const match = pathname.match(/^\/category\//);
    const baseCategory = match ? match[0] : "";

    const [kategori, setKategori] = useState(!kondisiLebar)
    const handleKategori = () => {
        kondisiLebar ? setKategori(!kategori) : setKategori(true)
    }

    const setIsPenawaran = useStore((state) => state.setIsPenawaran)
    const setDataPenawaran = useStore((state) => state.setDataPenawaran)
    const isLoading = useStore((state) => state.isLoading)
    const setIsLoading = useStore((state) => state.setIsLoading)


    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [filterMerek, setFilterMerek] = useState([])

    useEffect(() => {
        try {
            // const fetchDataFilter = async () => {
            //     const res = await GetFilterProduct()
            //     setDataFilterMerek(res)
            // }
            // fetchDataFilter()
            const fetchDataShop = async () => {
                setLoading(false)
                baseCategory == '/category/' && setData(res?.data?.listProducts || [])
                pathname == '/search' && setData(res?.data?.data || [])
                pathname == '/product' && setData(res?.data?.data || [])
                setFilterMerek(res?.dataPreviewMerek || [])
            }
            fetchDataShop()
        }
        catch (e) {
            console.log(e)
        }

    }, [res])

    useEffect(() => {
        process.env.NODE_ENV === 'production' && sendGAEventL("search_view", {
            product_search: q,
            product_link: window.location.href,
        });
    }, [pathname]);

    const HandleTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const HandlePenawaran = async (e) => {
        setIsLoading(true)
        try {
            setIsLoading(true)
            const dataku = await GetProductClient(e.slugProduct)
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
    }

    const HandleLoadMore = () => {
        if (pathname == '/search' && t >= 5) return;

        const newTake = t + 1;
        setLoading(true);
        // setTake(newTake);

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("t", newTake);

        router.push(
            `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`,
            { scroll: false }
        );
    };


    const HandleFillter = (id, value) => {
        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;

        if (id === "idM") params.set("m", Slugify(value));
        if (pathname === "/search" && Slugify(q)) params.set("q", Slugify(q));

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const HandleCloseFillter = (id) => {
        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;

        if (id === "idM") params.delete("m");
        if (pathname === "/search" && Slugify(q)) params.set("q", Slugify(q));

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

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
        <>
            <div className={styles.container}>
                <div className={styles.dalamkontainer} style={Lfilter ? { margin: '30px 0', padding: '0 30px' } : { margin: 0 }}>
                    {pathname == '/product' || pathname == '/shop' && <JudulPencarian judul={decodeURIComponent(m)} />}
                    {q && <JudulPencarian judul={decodeURIComponent(q)} />}
                    {/* {tag && <JudulPencarian judul={decodeURIComponent(tag)} />} */}
                    <div className={styles.bawah} >
                        {Lfilter &&
                            <div className={styles.filter}>
                                <span style={{ visibility: 'hidden' }}>d</span>
                                <div className={styles.dalamfilter}>
                                    <div className={styles.judul} onClick={handleKategori}>
                                        <div className={styles.text}>Merek</div>
                                        <div className={styles.icon}><CiFilter /></div>
                                    </div>
                                    {m ?
                                        <div className={styles.filternya}>
                                            <div className={styles.box}>{UnslugifyMerek(m)}</div>
                                            <div className={styles.close} onClick={() => HandleCloseFillter('idM')}>x</div>
                                        </div> :
                                        kategori &&
                                        <div className={styles.kategori}>
                                            {filterMerek?.map((data, i) => {
                                                if (!data?.name) return null; // Sembunyikan jika nama kosong
                                                return (
                                                    <div style={data?._count.Merek == 0 ? { display: 'none' } : { display: 'flex' }} className={styles.list} key={i} onClick={(e) => HandleFillter('idM', data?.name)}>
                                                        <label className={styles.checkboxLabel}>
                                                            <input
                                                                type="checkbox"
                                                                className={styles.checkbox}
                                                                onChange={(e) => HandleFillter('idM', data?.name, e.target.checked)}
                                                            />
                                                            {/* <span className={styles.text}>{(data?.name)}{`(${data._count.Merek})`} </span> */}
                                                            <span className={styles.text}>{(data?.name)} </span>
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
                            <span className={styles.angkatotal}>Menampilkan {baseCategory === '/category/' && res?.totalProduct >= res?.data?._count?.listProducts ? baseCategory === '/category/' && res?.data?._count?.listProducts : baseCategory === '/category/' && res?.totalProduct}{pathname === '/search' && res?.totalProduct >= res?.totalMaxProduct ? pathname === '/search' && res?.totalMaxProduct : pathname === '/search' && res?.totalProduct}{pathname === '/product' && res?.totalProduct >= res?.totalMaxProduct ? pathname === '/product' && res?.totalMaxProduct : pathname === '/product' && res?.totalProduct} dari {baseCategory == '/category/' && res?.data?._count?.listProducts || pathname == '/product' && res?.totalMaxProduct || pathname == '/search' && res?.totalMaxProduct}
                            </span>
                            <div className={styles.grid}>
                                {data?.length ?
                                    data?.map((data, i) => {
                                        const namaMerek = data?.fMerek?.[0]?.name.toUpperCase();
                                        const typeMerek = data?.productType.toUpperCase()
                                        return (
                                            <div key={i} className={styles.kotak}>
                                                <div>
                                                    <Link href={`/product/${data?.slugProduct}`}>
                                                        <div className={styles.gambarbawah}>
                                                            <Image
                                                                src={data?.imageProductUtama.secure_url || data?.imageProductUtama}
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
                                                            {
                                                                <>
                                                                    <div className={styles.typemerek}>
                                                                        <span className={`${styles.fMerek} ${merekClass[namaMerek?.toLowerCase()] || ''
                                                                            }`}
                                                                        >{typeMerek}</span>
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
                                                    data?.length && angka && <Link href={`/product/${data?.slugProduct}`}>
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
                                {Boolean(data?.length) &&
                                    pathname == '/search' && Number(t) >= 5 || res?.totalMaxProduct <= 7 ||
                                    baseCategory == '/category/' && res?.data?._count?.listProducts < res?.totalProduct ||
                                    pathname == '/product' && res?.totalMaxProduct < res?.totalProduct
                                    ? <div className={styles.kotak} onClick={HandleTop}>
                                        <div className={styles.loadmore}>
                                            <div style={{ transform: 'rotate(-95deg)' }}>
                                                <IoIosArrowDropright size={40} />
                                            </div>
                                            <div>
                                                Kembali Ke atas
                                            </div>
                                        </div>
                                    </div> :
                                    Boolean(data?.length) && <div className={styles.kotak} onClick={HandleLoadMore}>
                                        <div className={styles.loadmore}>
                                            <div>
                                                <IoIosArrowDropright size={40} />
                                            </div>
                                            <div>
                                                {loading ? 'Loading...' : 'Load More'}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

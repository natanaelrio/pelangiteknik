'use client'
import styles from '@/components/product.module.css'
import { FaWhatsapp } from "react-icons/fa";
import convertToRupiah from '@/utils/ConvertRupiah'
import ProductDetail from '@/components/productDetail';
import ProductSpecs from '@/components/productSpecs';
import ProductBeliMobile from "@/components/productBeliMobile";
import { useState, useEffect } from 'react';
import { FaCaretUp } from "react-icons/fa"
import { useStore } from '@/zustand/zustand';
import { usePathname } from 'next/navigation';
import EmblaCarousel from '@/components/EmblaCarousel'
import { CreateItem, GetCart } from '@/controllers/cart';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners'
import { useRouter } from 'nextjs-toploader/app';
import Link from 'next/link';
import Bagikan from '@/components/bagikan'
import { FaShareAlt } from "react-icons/fa";
import { MdOutlineSimCardDownload } from "react-icons/md";
import { CapitalizeWords } from '@/utils/CapitalizeWords';
import { Slugify } from '@/utils/slugify';
import { sendGAEventL } from '@/lib/ga';
import HandleKonversiWA from '@/utils/HandleKonversiWA';
import Image from 'next/image';
import ProductTags from './productTags';

export default function Product({ data, season }) {
    // console.log(season);
    const userEmail = season?.user?.email
    const userImageAvatar = season?.user?.image
    const userName = season?.user?.name
    const userId = season?.user?.id
    const setIsLogin = useStore((state) => state.setIsLogin)
    const setIsPenawaran = useStore((state) => state.setIsPenawaran)
    const setDataPenawaran = useStore((state) => state.setDataPenawaran)
    const pathname = usePathname()
    const url = `${process.env.NEXT_PUBLIC_URL}${pathname}`
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const { trackEvent } = await import('@/utils/facebookPixel');
            process.env.NODE_ENV === 'production' && trackEvent("ViewProduct", {
                content_name: data?.productName,
                content_category: data.user.categoryProductUtama.category + ' - ' + data.user.category,
                value: Number(data?.productPriceFinal),
                currency: "IDR"
            });
        };
        fetchData();
    }, []);

    useEffect(() => {
        process.env.NODE_ENV === 'production' && sendGAEventL("product_view", {
            product_name: data?.productName,
            product_category: `${data?.user?.categoryProductUtama?.category} - ${data?.user?.category}`,
            product_value: Number(data?.productPriceFinal),
            product_link: url,
        });
    }, [pathname]);


    // const { isLoaded, session, isSignedIn } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    const setIsLoadingWA = useStore((state) => state.setIsLoadingWA)
    const isLoadingWA = useStore((state) => state.isLoadingWA)
    const isIntersecting = useStore((state) => state.isIntersecting)
    const isShare = useStore((state) => state.isShare)
    const setIsShare = useStore((state) => state.setIsShare)
    // const isLoading = useStore((state) => state.isLoading)
    // const setIsLoading = useStore((state) => state.setIsLoading)

    const [valueQty, setValueQty] = useState(1);

    const decrease = () => {
        if (valueQty > 1) {
            setValueQty(valueQty - 1);
        } else {
            toast.error('Jumlah minimal pembelian adalah 1');
        }
    };

    const increase = () => {
        if (valueQty < data?.stockProduct) {
            setValueQty(valueQty + 1)
        } else {
            toast.error(`Stok produk hanya tersedia ${data?.stockProduct} saja`);
        }
    };


    const handleChangeQty = (e) => {
        const val = e.target.value;

        // hanya izinkan angka
        if (!/^\d*$/.test(val)) return;

        // jika kosong, set jadi "" biar user bisa edit
        if (val === "") {
            setValueQty("");
            return;
        }

        // ubah ke number
        const num = parseInt(val, 10);

        // minimal 1
        if (num < 1) {
            setValueQty(1);
            return;
        }

        if (num > data?.stockProduct) {
            toast.error(`Stok produk hanya tersedia ${data?.stockProduct} saja`);
            return;
        }
        setValueQty(num);
    };

    const handleBeliSekarangLogin = async () => {
        setIsLogin()
    }

    const handleBeliSekarang = async () => {
        try {
            setIsLoading(!isLoading)
            const res = await GetCart(userId)
            const jumlahBarangOri = res?.items?.filter(item => item.productId === data?.id)[0]?.product?.jumlah_barang
            const jumlahBarangNow = res?.items.filter(item => item.productId === data?.id)[0]?.quantity

            console.log(jumlahBarangOri);
            console.log(jumlahBarangNow);

            // if (Boolean(res?.items.filter(item => item.productId === data?.id).length)) {

            //     const fetchData = async () => await CreateItem({
            //         "CART_ID": userId,
            //         "PRODUCT_ID": data?.id,
            //         "QUANTITY":
            //             pathname == '/cart' ?
            //                 1 >= jumlahBarangOri ? jumlahBarangOri : 1

            //                 : (1 + jumlahBarangNow) >= jumlahBarangOri ? jumlahBarangOri : (1 + jumlahBarangNow),
            //         "CHECKLIST": true,
            //         "NOTE": data?.productType
            //     }, "PUT")
            //     await toast.promise(
            //         fetchData(),
            //         {
            //             loading: 'Create Cart...',
            //             success: <b>Wait a minute!</b>,
            //             error: <b>Try again</b>,
            //         }
            //     )
            // } else {

            //     const fetchData = async () => await CreateItem({
            //         "CART_ID": userId,
            //         "PRODUCT_ID": data?.id,
            //         "QUANTITY": 1,
            //         "CHECKLIST": true,
            //         "NOTE": data?.productType
            //     }, "POST")
            //     await toast.promise(
            //         fetchData(),
            //         {
            //             loading: 'Create Cart...',
            //             success: <b>Wait a minute!</b>,
            //             error: <b>Try again</b>,
            //         }
            //     );

            // }

            const fetchData = async () => await CreateItem({
                "EMAIL": userEmail,
                "NAME": userName,
                "AVATAR": userImageAvatar,
                "VOUCHER_ID": 'NOVOUCHER',

                "CART_ID": userId,
                "PRODUCT_ID": data?.id,
                "QUANTITY": valueQty > jumlahBarangNow ? jumlahBarangNow : valueQty,
                "CHECKLIST": true,
                "NOTE": data?.productType
            }, "POST")
            await toast.promise(
                fetchData(),
                {
                    loading: 'Buat Keranjang...',
                    success: <b>Wait a minute!</b>,
                    error: <b>Try again</b>,
                }
            );
            setIsLoading(!isLoading)
            router.push('/cart')
        } catch (e) {
            console.log(e);
            setIsLoading(!isLoading)
            toast.error('This is an error!');
        }
        setIsLoading(false)
    }

    // Fungsi untuk menghandle klik WhatsApp
    const handleWhatsapp = async () => {
        try {
            setIsLoadingWA(true)
            const waUrl = await HandleKonversiWA({ productDetail: data });
            setIsLoadingWA(false)
            window.open(waUrl, "_blank");
        } catch (e) {
            console.log(e);
            toast.error('Gagal membuka WhatsApp. Silakan coba lagi.')
            setIsLoadingWA(false)
        }
    };

    const [pilihan, setPilihan] = useState('detail')

    const handlePilihBawah = (e) => {
        e == 'detail' && setPilihan('detail')
        e == 'specs' && setPilihan('specs')
    }


    const dataGambarUtama = [data?.imageProductUtama]
    const dataListGambar = data?.url_image_product

    const GabungDataGambar = [...dataGambarUtama, ...dataListGambar]

    const HandlePenawaran = (e) => {
        setIsPenawaran()
        setDataPenawaran(e)
        trackEvent("InitiateCheckout", {
            content_ids: [data?.slugProduct],
            content_type: data?.user?.categoryProductUtama?.category + " - " + data.user.category,
            value: parseFloat(data?.productPriceFinal),
            currency: 'IDR',
            num_items: 1
        });
        // trackEvent("Lead", {
        //     content_ids: [data?.slugProduct],
        //     content_type: data?.user?.categoryProductUtama?.category + " - " + data.user.category,
        //     value: parseFloat(data?.productPriceFinal),
        //     currency: 'IDR',
        //     num_items: 1
        // });
    }
    const [copied, setCopied] = useState(false);
    const shareUrl = `${process.env.NEXT_PUBLIC_URL}/product/${data?.slug}`;
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Gagal menyalin:", err);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.dalamcontainer}>

                    <div className={styles.atas}>
                        <div className={styles.swipperexluar}>
                            <div className={styles.swipperex}>
                                <div className={styles.detailplus}>
                                    <div className={styles.detailRow}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>Dimensi</span>
                                            {data?.lengthProduct || data?.widthProduct || data?.heightProduct ? (
                                                <span className={styles.value}>
                                                    : {data?.lengthProduct}cm x {data?.widthProduct}cm x {data?.heightProduct}cm
                                                </span>
                                            ) : (
                                                <span className={styles.value} style={{ color: 'red' }}>
                                                    : Belum Ada Dimensi
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>Berat</span>
                                            <span className={styles.value}>: {data?.weightProduct}kg</span>
                                        </div>
                                    </div>
                                </div>
                                <EmblaCarousel fMerek={data.fMerek} type={data?.productType} productName={data?.productName} e={GabungDataGambar} yt={data.urlYoutube} />

                                {/* <ShortsYoutube id={'Rm3x_2CeeBw'} /> */}
                            </div>
                        </div>
                        <div className={styles.review}>

                            <div className={styles.kategory}>
                                <ul className={styles.dalamkategory}>
                                    <li className={styles.tulisan}>
                                        <Link href={`/`}>
                                            <div >Home</div>
                                        </Link>
                                        <svg
                                            className="unf-icon"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="var(--NN500, #7C8597)"
                                            style={{ display: 'inline-block', verticalAlign: 'middle' }}
                                        >
                                            <path d="M9.5 17.75a.75.75 0 0 1-.5-1.28L13.44 12 9 7.53a.75.75 0 0 1 1-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.74.74 0 0 1-.5.22Z"></path>
                                        </svg>
                                    </li>
                                    <li className={styles.tulisan}>
                                        <Link href={`/category/${data.user.categoryProductUtama.slugCategory}`}>
                                            <div >{data.user.categoryProductUtama.category}</div>
                                        </Link>
                                        <svg
                                            className="unf-icon"
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="var(--NN500, #7C8597)"
                                            style={{ display: 'inline-block', verticalAlign: 'middle' }}
                                        >
                                            <path d="M9.5 17.75a.75.75 0 0 1-.5-1.28L13.44 12 9 7.53a.75.75 0 0 1 1-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.74.74 0 0 1-.5.22Z"></path>
                                        </svg>
                                    </li>
                                    <li className={styles.tulisan}>
                                        <Link href={`/category/${data.user.categoryProductUtama.slugCategory}/${data.user.slugCategory}`}>
                                            <div className={styles.tulisan}>{data.user.category}</div>
                                        </Link>
                                    </li>
                                    {/* <li></li>

                                            <IoIosArrowForward /> */}
                                </ul>
                                <div className={styles.bagikan} onClick={setIsShare}>
                                    <FaShareAlt size={20} />
                                </div>
                            </div>
                            <h1 className={styles.judul}>
                                {data?.productName}
                            </h1>

                            <div className={styles.pricedanstock}>
                                <div className={styles.price}>
                                    {convertToRupiah(Number(data?.productPriceFinal))} {Boolean(data?.productDiscount) && <span style={{ textDecoration: 'line-through', color: 'grey' }}> {convertToRupiah(Number(data?.productPrice))}</span>}
                                </div>
                                {/* <div className={styles.stock}>
                                    Stock:  {data?.stockProduct}
                                </div> */}
                            </div>

                            <div className={styles.qty}>
                                <label className={styles.label}>Quantity</label>

                                <div className={styles.boxqty}>
                                    <div className={styles.box}>
                                        <button className={styles.btn} onClick={decrease}>−</button>
                                        <input className={styles.value} value={valueQty} onChange={handleChangeQty}></input>
                                        <button className={styles.btn} onClick={increase}>+</button>
                                    </div>

                                    <span>Stock:  {data?.stockProduct}</span>
                                </div>

                            </div>

                            <div className={styles.buu}>
                                <div className={styles.slide1}>

                                    {season ? <button disabled={isLoading} onClick={handleBeliSekarang}>
                                        {isLoading ? <BeatLoader color='white' /> : 'Tambah Keranjang'}
                                    </button> : <button disabled={isLoading} onClick={handleBeliSekarangLogin}>
                                        {isLoading ? <BeatLoader color='white' /> : 'Beli Sekarang'}
                                    </button>}
                                    <button onClick={() => HandlePenawaran(data)} className={styles.penawaran}>
                                        <MdOutlineSimCardDownload /> &nbsp; Surat Penawaran
                                    </button>
                                </div>

                                {/* <div className={styles.waandpenawaran}>
                                    <button id="whatsapp-button" disabled={isLoadingWA} onClick={handleWhatsapp} className={styles.whatsapp}>
                                        <FaWhatsapp size={20} /> &nbsp; {isLoadingWA ? 'Loading' : 'Whatsapp'}
                                    </button>
                                </div> */}

                            </div>

                            <h2 className={styles.descMeta}>
                                {data.descMetaProduct}
                            </h2>

                            <div className={styles.tags}>
                                tags:&nbsp;
                                {/* <span className={styles.tag}>
                                    <Link href={`/search?sub=${data?.subKategoriProduct}`}>
                                        {data?.subKategoriProduct}
                                    </Link>
                                </span> */}
                                {/* <span className={styles.tag}>
                                    <Link href={`/search?type=${data?.productType}`}>
                                        {data?.productType}
                                    </Link>
                                </span> */}
                                {data?.tagProduct.split(",").map((item, index) => {
                                    return (
                                        <Link href={`/search?q=${Slugify(item)}`}>
                                            <h3 className={styles.tag} key={item}>
                                                {CapitalizeWords(item)}
                                            </h3>
                                        </Link>
                                    )
                                })}
                            </div>

                            <div className={styles.paymentmethod}>
                                <label className={styles.label}>Payment Method</label>
                                <div className={styles.footerSection}>
                                    {[
                                        "white-logo-visa.svg",
                                        "white-logo-mastercard.webp",
                                        "white-logo-jcb.webp",
                                        "white-logo-amex.webp",
                                        "white-logo-bri.webp",
                                        "white-logo-bni.webp",
                                        "white-logo-bca.webp",
                                        "white-logo-mandiri.webp",
                                    ].map((img, i) => (
                                        <Image
                                            key={i}
                                            src={`https://storage.googleapis.com/clevertap-assets/paper-lp/bank-logo/${img}`}
                                            alt={img.split("-")[2]?.toUpperCase() + " Logo"}
                                            width={60}
                                            height={40}
                                            loading="lazy"
                                        />
                                    ))}
                                    <div className={styles.footerTextlowOpacity}>
                                        dan lainnya
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className={styles.bawah}>
                        {/* <div className={styles.bawahjudul}>
                            <div
                                className={styles.detailjudul}
                                style={pilihan == 'detail' ? { background: 'var(--colorthrid)', color: 'var(--colorsekunder)', fontWeight: '700' } : {}}
                                onClick={() => handlePilihBawah('detail')}
                            >
                                Detail
                                {pilihan == 'detail' && <div className={styles.ikon}><FaCaretUp size={30} color='var(--colorbggreyutama)' /></div>}
                            </div>

                            <div
                                className={styles.detailjudul}
                                onClick={() => handlePilihBawah('specs')}
                                style={pilihan == 'specs' ? { background: 'var(--colorthrid)', color: 'var(--colorsekunder)', fontWeight: '700' } : {}}
                            >
                                Specs
                                {pilihan == 'specs' && <div className={styles.ikon}><FaCaretUp size={30} color='var(--colorbggreyutama)' /></div>}
                            </div>
                        </div> */}
                        <div className={styles.bawahpilihan}>
                            <ProductDetail data={data?.descProduct} />
                            <ProductSpecs data={data?.spekNew} />
                            <ProductTags dataTag={data?.tagProduct} />
                        </div>
                    </div>
                    {!isIntersecting &&
                        <ProductBeliMobile

                            HandlePenawaran={HandlePenawaran}
                            data={data}
                            handleBeliSekarang={handleBeliSekarang}
                            handleBeliSekarangLogin={handleBeliSekarangLogin}
                            season={season}
                            handleWhatsapp={handleWhatsapp}
                            price={convertToRupiah(Number(data?.productPriceFinal))}
                            stock={data?.stockProduct}
                            isLoading={isLoading}

                            handleCopy={handleCopy}
                            copied={copied}
                        />}
                    {isShare && <Bagikan
                        data={data}
                        handleCopy={handleCopy}
                        copied={copied} />}
                </div>
            </div >

        </>
    )
}

'use client'
import styles from '@/components/formData.module.css';
import { CreateDataPesanan, GetVoucher, UpdateVoucher, UpserFromData, UpserOngkosKirim } from '@/controllers/cart';
import { GetNumberSalesWA } from '@/controllers/userClient';
import { GeneratePaymentMid } from '@/controllers/userNew';
import HandleInvoicePaperID from '@/service/handleInvoicePaperID';
import { useStore } from '@/zustand/zustand';
import HandleRateBitship from '@/service/handleRateBiteShip';
import convertToRupiah from "@/utils/ConvertRupiah";
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import { customAlphabet } from 'nanoid';
import { signOut, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter as useRouter2 } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBox, FaCheck, FaMapMarkerAlt, FaTruck } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowUp } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FadeLoader } from 'react-spinners';
import * as Yup from 'yup';
import HandleKonversiWAPenawaran from '@/utils/HandleKonversiWAPenawaran';

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function FormData({ data, dataBank, email, idCart, cities, provinces }) {

    const totalAllWeight = data?.items?.reduce((total, item) => {
        return total + item?.quantity * item?.product.weightProduct;
    }, 0);

    const { data: session, status } = useSession();
    const router2 = useRouter2()
    const [ongkosKirim, setOngkosKirim] = useState(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            signOut({ callbackUrl: '/' });
        }
    }, [status]);

    const quantityWeight = data?.items.map((data) => ({
        quantityWeight: data.quantity * data.product.weightProduct,
    }))
    const BeratBarang = quantityWeight?.reduce((total, item) => total + item.quantityWeight, 0);

    const router = useRouter()
    const userId = idCart

    const PengalihanWhatsapp = async () => {
        const NumberSales = await GetNumberSalesWA()
        const productNames = data?.items?.map(item => `${item?.product.productName} (${item?.quantity}x)`).join('\n');
        const encodedMessage = encodeURIComponent(`Halo, saya tertarik untuk membeli:\n${productNames}`);
        const randomPhoneNumber = NumberSales.numberWA;
        router.push(`https://wa.me/${randomPhoneNumber}?text=${encodedMessage}`)
    };

    const nanoidFrom = customAlphabet('1234567890', 9)
    const nanoid = customAlphabet('1234567890ABCDEFZSI', 10)
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formatted = `${day}${month}${year}`;
    const id = `INV/${formatted}/P-${nanoid()}`;

    const pricesOngkir = Number(ongkosKirim?.price) ? Number(ongkosKirim?.price) : 0
    const pricesProducts = data?.items?.map(item => parseInt(item.product?.productPriceFinal * item.quantity, 10));
    const totalPriceProduct = pricesProducts?.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const totalPrice = totalPriceProduct

    const setIsLoadingWA = useStore((state) => state.setIsLoadingWA)
    const isLoadingWA = useStore((state) => state.isLoadingWA)
    const [loading, setLoading] = useState(false)
    const [pay, setPay] = useState(false)
    const [formData, setFromData] = useState(data?.formData)
    const [arrowUP, setArrowUP] = useState(false)

    const [loadingV, setLoadingV] = useState(false)
    const [voucher, setVoucher] = useState('')
    const [kondisiV, setKondisiV] = useState(null)

    useEffect(() => {
        if (data) window.scrollTo(0, 0);
    }, [data]);

    const HandleVoucher = async () => {
        try {
            setLoadingV(true)
            const res = await GetVoucher(voucher)
            const totalHarga = pricesOngkir + totalPrice - (totalPrice * (kondisiV?.diskon ? kondisiV?.diskon : 0)) / 100
            if (totalHarga >= res?.harga) {
                setKondisiV(res ? res : {
                    "id": "NOVOUCHER",
                    "kode": "NOVOUCHER",
                    "harga": 0,
                    "nominal": res?.tipe == "nominal" && res?.nominal || 0,
                    "diskon": res?.tipe == "percent" && res?.diskon || 0,
                    "expiredAt": res?.expiredAt
                })
                res && toast.success('🎉 Voucher berhasil ditambahkan!')
            } else {
                res == undefined ? toast.error(' Voucher tidak tersedia, hub sales') : toast.error(`minimal pembelian ${convertToRupiah(Number(res?.harga))}`)
            }
            setLoadingV(false)
        } catch (e) {
            console.error('Error fetching voucher:', e)
            toast.error('❌ Voucher tidak tersedia atau tidak valid.')
            setLoadingV(false)
        }
    }

    const [showShippingOptions, setShowShippingOptions] = useState(false)

    const defaultOngkir = [
        {
            name: "shipping", type: "radio", icon: <FaMapMarkerAlt />,
            value: { id: "self-pickup", nama: "Self Pickup", label: "Ambil langsung di gudang Tsuzumi / Pelangi Teknik.", harga: 0 },
            label: { title: "Self Pickup", description: "Ambil langsung di gudang Tsuzumi / Pelangi Teknik." }
        },
        {
            name: "shipping", type: "radio", icon: <FaTruck />,
            value: { id: "pelangi-courier", nama: "Pelangi Teknik Courier", label: "Pesanan diantar langsung oleh kurir internal Pelangi Teknik.", harga: 0 },
            label: { title: "Pelangi Teknik Courier", description: "Pesanan diantar langsung oleh kurir internal Pelangi Teknik." }
        }
    ]

    const HandleEditForm = () => {
        setShippingOptions(defaultOngkir)
        setPay(false)
        setFromData(false)
        setLoading(false)
        setShowShippingOptions(false)
    }

    const [shippingOptions, setShippingOptions] = useState(defaultOngkir);

    const HandlePilihEkspedisi = async () => {
        setLoading(true)

        if (email == 'it.pt.pelangiteknikindonesia@gmail.com') {
            try {
                const FormItemDetailPaperID = data?.items?.map((e) => ({
                    name: e?.product?.productName.slice(0, 50),
                    description: e.product?.descMetaProduct,
                    value: Number(e?.product?.productPriceFinal),
                    quantity: Number(e?.quantity),
                    length: e?.product?.lengthProduct,
                    width: e?.product?.widthProduct,
                    height: e?.product?.heightProduct,
                    weight: e?.product?.weightProduct,
                }))

                const resRate = await HandleRateBitship({ kodePosUser: Number(data?.formData?.kode_pos_user) }, FormItemDetailPaperID)

                setShippingOptions(prev => [
                    ...prev,
                    ...resRate?.pricing?.map((item) => ({
                        name: "shipping", type: "radio", icon: <FaBox />,
                        value: {
                            id: `${item?.courier_code}-${item?.courier_service_code}`,
                            nama: `${item?.courier_name} ${item?.courier_service_name}`,
                            label: `${item?.description} (Estimasi ${item?.duration})`,
                            harga: item?.price
                        },
                        label: {
                            title: `${item?.courier_name} ${item?.courier_service_name}`,
                            description: `${item?.description} (Estimasi ${item?.duration}).`
                        }
                    }))
                ])
            } catch (e) {
                toast.error('coba lagi..')
            }
        }
        setPay(false)
        setShowShippingOptions(true)
        setLoading(false)
    }

    let parsedLocation = { lat: -6.200000, lng: 106.816666 };
    try {
        const detail = data?.formData?.alamat_detail;
        parsedLocation = typeof detail === 'string' ? JSON.parse(detail) : detail || parsedLocation;
    } catch (e) {
        console.error('Alamat detail invalid JSON:', e);
    }

    const initialValues = {
        fullName: data ? data?.formData?.nama_lengkap_user : '',
        address: data ? data?.formData?.alamat_lengkap_user : '',
        note: data ? data?.formData?.catatan_pengiriman : '',
        location: parsedLocation,
        country: '',
        postalCode: data ? data?.formData?.kode_pos_user : '',
        number: data ? data?.formData?.no_hp_user : '',
        province: data?.formData?.province ? data.formData.province : '',
        city: data?.formData?.city ? data.formData.city : ''
    };

    const validationSchema = Yup.object({
        fullName: Yup.string().max(150, 'Max 150 karakter').required('Nama Lengkap wajib diisi'),
        address: Yup.string().max(99999, 'Terlalu panjang').required('Alamat wajib diisi'),
        location: Yup.object().nullable().required('Silakan pilih lokasi di peta'),
        number: Yup.number().max(99999999999999, 'Nomor tidak valid').required('Nomor HP wajib diisi'),
        postalCode: Yup.number().max(99999999, 'Kode pos tidak valid').required('Kode pos wajib diisi'),
    })

    const handleSubmit = async (value) => {
        setLoading(true)
        try {
            const fetchData = async () => {
                await UpserFromData({
                    "cartID": userId,
                    "nama_lengkap_user": value.fullName,
                    "alamat_lengkap_user": `${value.address}`,
                    "alamat_detail": value.location,
                    "kode_pos_user": Number(value.postalCode),
                    "no_hp_user": Number(value.number),
                    "province": value.province,
                    "city": value.city,
                    "catatan_pengiriman": value.note ? value.note : 'tidak ada catatan'
                })
                setFromData(true)
                setLoading(false)
            }
            await toast.promise(fetchData(), {
                loading: 'Tunggu Sebentar...',
                success: <b>Berhasil disimpan data Pengiriman</b>,
                error: <b>Gagal Menyimpan</b>,
            });
        } catch (e) {
            console.log(e)
            toast.error('Gagal, coba lagi nanti');
            setLoading(false)
            PengalihanWhatsapp()
        }
    }

    const handleWhatsapp = async () => {
        try {
            setIsLoadingWA(true)
            const waUrl = await HandleKonversiWAPenawaran({ fromDataVoucher: true });
            setIsLoadingWA(false)
            window.open(waUrl, "_blank");
        } catch (e) {
            console.log(e);
            toast.error('Gagal membuka WhatsApp. Silakan coba lagi.')
            setIsLoadingWA(false)
        }
    }

    const formikPayment = useFormik({
        initialValues: {
            metode: 'paperid', // ✅ Default PaperID
        },
        onSubmit: (values) => {
            if (values.metode === 'midtrans') {
                HandleCheckOut('midtrans', 'Midtrans')
            } else if (values.metode === 'paperid') {
                HandleCheckOut('paperid', 'PaperID')
            }
        },
    })

    const HandleCheckOut = async (kodeBank, judul) => {
        setLoading(true)
        const OngkosKirim = [{
            id: Number(nanoidFrom()),
            name: ongkosKirim?.productName,
            productName: ongkosKirim?.productName,
            price: Number(ongkosKirim?.price),
            quantity: 1,
            priceOriginal: Number(ongkosKirim?.price),
            note: 'ongkir',
            methodPayment: judul
        }]


        const FormItemDetailMidstrans = [...data?.items?.map((e) =>
        ({
            id: Number(nanoidFrom()),
            name: e?.product?.productName.slice(0, 50),
            productName: e?.product?.productName,
            // price: Number(e?.product?.productPriceFinal * e?.quantity - ((e?.product?.productPriceFinal * e?.quantity) * (kondisiV?.diskon ? kondisiV?.diskon : 0)) / 100),
            price: Number(e?.product?.productPriceFinal - ((e?.product?.productPriceFinal) * (kondisiV?.diskon ? kondisiV?.diskon : 0)) / 100),
            // price: Number(e?.product?.productPrice * e?.quantity),
            quantity: Number(e?.quantity),
            priceOriginal: Number(e?.product?.productPriceFinal),
            note: e?.product?.productType,
            methodPayment: judul,
            image: e?.product?.imageProductUtama?.secure_url,
            slugProduct: e?.product.slugProduct,
            merchantOrderId: id,
        })), ...OngkosKirim]


        const OngkosKirimPaperID = [{
            // id: Number(nanoidFrom()),
            name: ongkosKirim?.productName,
            description: 'Ongkos Kirim',
            quantity: 1,
            price: Number(ongkosKirim?.price),
            discount: 0,
            tax_id: '',
            additional_info: {},
        }]


        const FormItemDetailPaperID = [...data?.items?.map((e) => ({
            // id: Number(nanoidFrom()),
            name: e?.product?.productName.slice(0, 150),
            description: e.product?.descMetaProduct,
            quantity: Number(e?.quantity),
            price: Number(e?.product?.productPriceFinal),
            discount: kondisiV?.diskon ? kondisiV?.diskon : 0,
            tax_id: '',
            additional_info: {},
        }))]

        const DataMidtrans = {
            "order_id": id,
            "first_name": data?.formData?.nama_lengkap_user,
            "phone": data?.formData?.no_hp_user,
            "email": email,
            "kode_pos": data?.formData.kode_pos_user,
            "address": data?.formData?.alamat_lengkap_user,
            "payment": [
                kodeBank
            ],
            "item_details": FormItemDetailMidstrans
        }
        const DataPaperID = {
            "order_id": id,
            "first_name": data?.formData?.nama_lengkap_user,
            "phone": data?.formData?.no_hp_user,
            "email": email,
            "catatan": 'Expedisi: ' + ongkosKirim?.productName + ' - ' + ongkosKirim?.label,
            "delivery_fee": Number(ongkosKirim?.price),
            "item_details": FormItemDetailPaperID,
            "additional_discount": Number(kondisiV?.nominal) || 0,
        }

        // UNTUK DATABASE ASLI
        const OngkosKirimDataBase = [{
            id: Number(nanoidFrom()),
            productName: ongkosKirim?.productName,
            price: Number(ongkosKirim?.price),
            quantity: 1,
            priceOriginal: Number(ongkosKirim?.price),
            note: 'ongkir',
            methodPayment: judul
        }]

        const FormItemDetailDataBase = [...data?.items?.map((e) =>
        ({
            // price: Number(e?.product?.productPrice * e?.quantity - ((e?.product?.productPrice * e?.quantity) * (kondisiV?.diskon ? kondisiV?.diskon : 0)) / 100),
            id: Number(nanoidFrom()),
            productName: e?.product?.productName,
            price: Number(e?.product?.productPrice * e?.quantity),
            quantity: Number(e?.quantity),
            priceOriginal: Number(e?.product?.productPriceFinal),
            note: e?.product?.productType,
            methodPayment: judul,
            image: e?.product?.imageProductUtama?.secure_url,
            slugProduct: e?.product.slugProduct,
            merchantOrderId: id,
            // nota_url: resPaperID?.data?.pdf_url_short || '',
        })), ...OngkosKirimDataBase]

        let resPaperID;


        try {
            if (kodeBank == 'midtrans') {
                const dataMid = await GeneratePaymentMid(DataMidtrans);
                const pushUrlLinkMidtrans = dataMid?.data?.redirect_url;
                router.push(pushUrlLinkMidtrans);
            }

            if (kodeBank == 'paperid') {
                resPaperID = await HandleInvoicePaperID(DataPaperID);
                const resPayurl = 'https://' + resPaperID?.data?.payper_url;
                router.push(resPayurl);
            }

            process.env.NODE_ENV === 'production' && await CreateDataPesanan({
                merchantOrderId: id,
                reference: resPaperID?.data?.id ? resPaperID?.data?.id : id,
                cartID: userId,
                nama_lengkap_user: data?.formData?.nama_lengkap_user,
                alamat_lengkap_user: data?.formData?.alamat_lengkap_user,
                alamat_detail: data?.formData?.alamat_detail,
                kode_pos_user: data?.formData?.kode_pos_user,
                no_hp_user: data?.formData?.no_hp_user,
                catatan_pengiriman: data?.formData?.catatan_pengiriman,
                kode: kondisiV?.kode ? kondisiV?.kode : 'NOVOUCHER',
                diskon: kondisiV?.diskon ? kondisiV?.diskon : 0,
                diskon_nominal: kondisiV?.nominal ? kondisiV?.nominal : 0,
                nota_url: resPaperID?.data?.pdf_url_short || '',
            }, FormItemDetailDataBase);

            // process.env.NODE_ENV === 'production' && await UpserOngkosKirim({
            //     "cartID": userId,
            //     "productName": ongkosKirim?.productName,
            //     "price": Number(ongkosKirim?.price),
            //     "quantity": 1
            // })


            setLoading(false);
            router2.refresh();
        } catch (e) {
            router2.refresh();
            router.push('/contact');
            toast.error('Error silahkan hubungi sales');
            setLoading(false);
        }
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContainer}>

                {/* Header Back */}
                <div className={styles.headerSection}>
                    <button disabled={loading} onClick={() => router.push('/cart')} className={styles.btnBack}>
                        <IoIosArrowBack size={20} /> Kembali ke Keranjang
                    </button>
                </div>

                <div className={styles.contentGrid}>

                    {/* BAGIAN KIRI: Form Flow */}
                    <div className={styles.formSection}>

                        {/* STEP 1: INFORMASI PENGIRIMAN */}
                        <div className={`${styles.stepCard} ${formData ? styles.stepCompleted : ''}`}>
                            <div className={styles.stepHeader}>
                                <div className={formData ? styles.iconSuccess : styles.iconNumber}>
                                    {formData ? <FaCheck /> : "1"}
                                </div>
                                <h2>Informasi Pengiriman</h2>
                            </div>

                            <div className={styles.stepBody}>
                                {formData ? (
                                    <div className={styles.savedData}>
                                        <div className={styles.addressInfo}>
                                            <p className={styles.name}>{data?.formData?.nama_lengkap_user}</p>
                                            <p className={styles.phone}>{data?.formData?.no_hp_user}</p>
                                            <p className={styles.address}>
                                                {data?.formData?.alamat_lengkap_user}, {data?.formData?.kode_pos_user}
                                            </p>
                                            {data?.formData?.catatan_pengiriman && (
                                                <div className={styles.noteBox}>
                                                    Catatan: {data?.formData?.catatan_pengiriman}
                                                </div>
                                            )}
                                        </div>
                                        <button className={styles.btnOutline} onClick={HandleEditForm} disabled={loading}>
                                            Ubah Data
                                        </button>
                                    </div>
                                ) : (
                                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                        {({ setFieldValue, errors, touched }) => (
                                            <Form className={styles.formLayout}>
                                                <div className={styles.mapContainer}>
                                                    <MapPicker value={initialValues.location} onChange={(c) => setFieldValue('location', c)} />
                                                    {errors.location && touched.location && <div className={styles.errorMsg}>{errors.location}</div>}
                                                </div>

                                                <div className={styles.inputRow}>
                                                    <div className={styles.inputGroup}>
                                                        <label>Nama Penerima</label>
                                                        <Field type="text" name="fullName" className={styles.inputField} disabled={loading} />
                                                        <ErrorMessage name="fullName" component="span" className={styles.errorMsg} />
                                                    </div>
                                                    <div className={styles.inputGroup}>
                                                        <label>No. Handphone</label>
                                                        <Field name="number">
                                                            {({ field, form }) => (
                                                                <input {...field} type="text" className={styles.inputField} disabled={loading} onChange={(e) => {
                                                                    let value = e.target.value.replace(/\D/g, '');
                                                                    if (!value.startsWith('62') && value.length > 0) {
                                                                        value = '62' + value.replace(/^0+/, '');
                                                                    }
                                                                    form.setFieldValue('number', value);
                                                                }} />
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="number" component="span" className={styles.errorMsg} />
                                                    </div>
                                                </div>

                                                <div className={styles.inputGroup}>
                                                    <label>Detail Alamat Lengkap</label>
                                                    <Field as="textarea" rows="3" name="address" className={styles.inputField} disabled={loading} />
                                                    <ErrorMessage name="address" component="span" className={styles.errorMsg} />
                                                </div>

                                                <div className={styles.inputRow}>
                                                    <div className={styles.inputGroup}>
                                                        <label>Kode Pos</label>
                                                        <Field type="text" name="postalCode" className={styles.inputField} disabled={loading} />
                                                        <ErrorMessage name="postalCode" component="span" className={styles.errorMsg} />
                                                    </div>
                                                    <div className={styles.inputGroup}>
                                                        <label>Catatan Kurir (Opsional)</label>
                                                        <Field type="text" name="note" className={styles.inputField} disabled={loading} />
                                                    </div>
                                                </div>

                                                <div className={styles.actionRow}>
                                                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                                                        {loading ? <FadeLoader color="#fff" height={10} width={3} radius={2} margin={-5} /> : 'Simpan & Lanjut'}
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                )}
                            </div>
                        </div>

                        {/* STEP 2: METODE PENGIRIMAN */}
                        <div className={`${styles.stepCard} ${!formData ? styles.stepDisabled : ''}`}>
                            <div className={styles.stepHeader}>
                                <div className={ongkosKirim ? styles.iconSuccess : styles.iconNumber}>
                                    {ongkosKirim ? <FaCheck /> : "2"}
                                </div>
                                <h2>Metode Pengiriman</h2>
                            </div>

                            {formData && (
                                <div className={styles.stepBody}>
                                    {!showShippingOptions ? (
                                        <button className={styles.btnOutlineWide} onClick={HandlePilihEkspedisi} disabled={loading}>
                                            {loading ? 'Memuat Ekspedisi...' : 'Pilih Ekspedisi'}
                                        </button>
                                    ) : (
                                        <div className={styles.radioList}>
                                            {shippingOptions.map((opt, idx) => (
                                                <label key={idx} className={`${styles.radioCard} ${ongkosKirim?.id === opt.value.id ? styles.radioCardActive : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        value={opt.value.id}
                                                        checked={ongkosKirim?.id === opt.value.id}
                                                        onChange={() => {
                                                            setOngkosKirim({ ...opt.value, productName: opt.value.nama });
                                                            setPay(true);
                                                        }}
                                                    />
                                                    <div className={styles.radioContent}>
                                                        <div className={styles.radioIcon}>{opt.icon}</div>
                                                        <div className={styles.radioText}>
                                                            <span className={styles.radioTitle}>{opt.label.title}</span>
                                                            <span className={styles.radioDesc}>{opt.label.description}</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.radioPrice}>
                                                        {opt.value.harga === 0 ? 'Gratis' : convertToRupiah(opt.value.harga)}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* STEP 3: PEMBAYARAN */}
                        <div className={`${styles.stepCard} ${!pay ? styles.stepDisabled : ''}`}>
                            <div className={styles.stepHeader}>
                                <div className={styles.iconNumber}>3</div>
                                <h2>Pembayaran</h2>
                            </div>

                            {pay && (
                                <div className={styles.stepBody}>
                                    <form onSubmit={formikPayment.handleSubmit} className={styles.paymentForm}>
                                        <label className={`${styles.radioCard} ${formikPayment.values.metode === 'paperid' ? styles.radioCardActive : ''}`}>
                                            <input type="radio" name="metode" value="paperid" onChange={formikPayment.handleChange} checked={formikPayment.values.metode === 'paperid'} />
                                            <div className={styles.radioContent}>
                                                <div className={styles.radioText}>
                                                    <span className={styles.radioTitle}>Payment via PaperID</span>
                                                </div>
                                            </div>
                                            <div className={styles.bankLogos}>
                                                <Image src="https://api-sandbox.duitku.com/pgimages/pg/BC.svg" width={40} height={20} alt="BCA" style={{ objectFit: 'contain' }} />
                                                <Image src={`${process.env.NEXT_PUBLIC_URL}/qris.svg`} width={40} height={20} alt="QRIS" style={{ objectFit: 'contain' }} />
                                                <Image src="https://api-prod.duitku.com/pgimages/pg/VC.svg" width={40} height={20} alt="VISA" style={{ objectFit: 'contain' }} />
                                                <span className={styles.moreMethod}>+22</span>
                                            </div>
                                        </label>

                                        {/* Jika IT Pelangi Teknik (Bisa Midtrans) */}
                                        {email === 'it.pt.pelangiteknikindonesia@gmail.com' && (
                                            <label className={`${styles.radioCard} ${formikPayment.values.metode === 'midtrans' ? styles.radioCardActive : ''}`} style={{ marginTop: '12px' }}>
                                                <input type="radio" name="metode" value="midtrans" onChange={formikPayment.handleChange} checked={formikPayment.values.metode === 'midtrans'} />
                                                <div className={styles.radioContent}>
                                                    <div className={styles.radioText}>
                                                        <span className={styles.radioTitle}>Payment via Midtrans</span>
                                                    </div>
                                                </div>
                                                <div className={styles.bankLogos}>
                                                    <Image src="https://api-sandbox.duitku.com/pgimages/pg/BC.svg" width={40} height={20} alt="BCA" style={{ objectFit: 'contain' }} />
                                                    <Image src={`${process.env.NEXT_PUBLIC_URL}/qris.svg`} width={40} height={20} alt="QRIS" style={{ objectFit: 'contain' }} />
                                                    <Image src="https://api-prod.duitku.com/pgimages/pg/VC.svg" width={40} height={20} alt="VISA" style={{ objectFit: 'contain' }} />
                                                    <span className={styles.moreMethod}>+22</span>
                                                </div>
                                            </label>
                                        )}

                                        <div className={styles.disclaimerBox}>
                                            <MdOutlinePayment size={45} color="#cbd5e1" />
                                            <p>Setelah klik <b>“Bayar Sekarang”</b>, Anda akan diarahkan ke <b>{formikPayment.values.metode === 'midtrans' ? 'Midtrans' : 'PaperID Invoice'}</b> untuk menyelesaikan pembayaran dengan aman.</p>
                                        </div>

                                        <button type="submit" className={styles.btnPrimaryWide} disabled={loading}>
                                            {loading ? 'Memproses...' : 'Bayar Sekarang'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* BAGIAN KANAN: RINGKASAN PESANAN (Sticky Sidebar) */}
                    <aside className={styles.sidebarSection}>
                        <div className={styles.summaryBox}>

                            {/* BAGIAN VOUCHER */}
                            <div className={styles.voucherWidget}>
                                <div className={styles.voucherHeader}>
                                    <span className={styles.voucherTitle}>VOUCHER</span>
                                    <button type="button" disabled={isLoadingWA} className={styles.linkVoucher} onClick={handleWhatsapp}>
                                        (dapatkan voucher) {isLoadingWA && "..."}
                                    </button>
                                </div>
                                <div className={styles.voucherInputGroup}>
                                    <input type="text" placeholder="Masukkan kode..." value={voucher} onChange={(e) => setVoucher(e.target.value)} disabled={loadingV} />
                                    <button type="button" onClick={HandleVoucher} disabled={loadingV}>
                                        {loadingV ? 'Tunggu..' : 'Gunakan'}
                                    </button>
                                </div>
                            </div>

                            <h3 className={styles.ringkasanTitle}>Ringkasan Pesanan</h3>

                            <div className={styles.orderItems}>
                                {data?.items?.map((item, i) => (
                                    <div key={i} className={styles.itemRow}>
                                        <div className={styles.itemLabel}>
                                            <span className={styles.itemName}>{item.product.productName} <b>({item.quantity}x)</b></span>
                                            <span className={styles.itemMeta}>Total Berat: {item.product.weightProduct * item.quantity} kg</span>
                                        </div>
                                        <div className={styles.itemValue}>
                                            {convertToRupiah(Number(item.product.productPriceFinal * item.quantity))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.costBreakdown}>
                                <div className={styles.costRow}>
                                    <span>Total Berat Semua</span>
                                    <span>{totalAllWeight} kg</span>
                                </div>
                                <div className={styles.costRow}>
                                    <span>Subtotal Produk</span>
                                    <span>{convertToRupiah(totalPrice)}</span>
                                </div>
                                {ongkosKirim && (
                                    <div className={styles.costRow}>
                                        <span>Ongkos Kirim</span>
                                        <span>{convertToRupiah(Number(ongkosKirim.price ? ongkosKirim.price : 0))}</span>
                                    </div>
                                )}
                                {kondisiV && (
                                    <div className={`${styles.costRow} ${styles.discountText}`}>
                                        <span>Diskon Voucher</span>
                                        <span>
                                            {kondisiV?.tipe === 'nominal' && `-${convertToRupiah(Number(kondisiV?.nominal))}`}
                                            {kondisiV?.tipe === 'percent' && `-${convertToRupiah((totalPrice * (kondisiV?.diskon || 0)) / 100)} (${kondisiV?.diskon}%)`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.grandTotal}>
                                <span>Total Tagihan</span>
                                <span className={styles.totalPrice}>
                                    {!kondisiV && convertToRupiah(pricesOngkir + totalPrice)}
                                    {kondisiV?.tipe === 'nominal' && convertToRupiah(pricesOngkir + totalPrice - kondisiV?.nominal)}
                                    {kondisiV?.tipe === 'percent' && convertToRupiah(pricesOngkir + totalPrice - (totalPrice * (kondisiV?.diskon || 0)) / 100)}
                                </span>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    )
}
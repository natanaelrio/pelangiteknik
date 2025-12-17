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
import HandleKonversiWA from '@/utils/HandleKonversiWA';
const MapPicker = dynamic(() => import("@/components/MapPicker"), {
    ssr: false, // <--- penting!
});
export default function FormData({ data, dataBank, email, idCart, cities, provinces }) {

    const totalAllWeight = data?.items?.reduce((total, item) => {
        return total + item?.quantity * item?.product.weightProduct;
    }, 0);

    const { data: session, status } = useSession();

    const router2 = useRouter2()

    const [ongkosKirim, setOngkosKirim] = useState(null)

    console.log(ongkosKirim);

    useEffect(() => {
        if (status === 'unauthenticated') {
            signOut({ callbackUrl: '/' }); // Mengarahkan pengguna ke halaman utama setelah logout
        }
    }, [status]);

    // const BeratBarang = data?.items?.map((data) => data?.product).reduce((total, product) => total + product?.weightProduct, 0)
    const quantityWeight = data?.items.map((data) =>
    ({
        quantityWeight: data.quantity * data.product.weightProduct,
    })
    )
    const BeratBarang = quantityWeight?.reduce((total, item) => total + item.quantityWeight, 0);

    const router = useRouter()
    const userId = idCart

    const PengalihanWhatsapp = async () => {
        const NumberSales = await GetNumberSalesWA()
        // Membuat pesan WhatsApp dengan informasi produk, setiap produk di baris baru
        const productNames = data?.items?.map(item => `${item?.product.productName} (${item?.quantity}x)`).join('\n');
        const encodedMessage = encodeURIComponent(`Halo, saya tertarik untuk membeli:\n${productNames}`);

        // Nomor WA tujuan, sesuaikan dengan data atau variabel yang benar
        const randomPhoneNumber = NumberSales.numberWA;

        router.push(`https://wa.me/${randomPhoneNumber}?text=${encodedMessage}`)
        // Menggunakan window.open untuk membuka WhatsApp di tab baru
        // window.open(`https://wa.me/${randomPhoneNumber}?text=${encodedMessage}`, '_blank');
    };

    const nanoidFrom = customAlphabet('1234567890', 9)

    // const { snapEmbedDuitku } = useSnapDuitku()
    const nanoid = customAlphabet('1234567890ABCDEFZSI', 10)
    // const id = 'P' + '-' + nanoid()
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formatted = `${day}${month}${year}`;

    const id = `INV/${formatted}/P-${nanoid()}`;
    // const id = 'INV/{date}P' + '-' + nanoid()

    const pricesOngkir = Number(ongkosKirim?.price) ? Number(ongkosKirim?.price) : 0

    const pricesProducts = data?.items?.map(item => parseInt(item.product?.productPriceFinal * item.quantity, 10));
    const totalPriceProduct = pricesProducts?.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const totalPrice = totalPriceProduct

    const setIsLoadingWA = useStore((state) => state.setIsLoadingWA)
    const isLoadingWA = useStore((state) => state.isLoadingWA)
    const [loading, setLoading] = useState(false)
    // const [pay, setPay] = useState(false)
    // const [formData, setFromData] = useState(false)
    const [pay, setPay] = useState(false)
    const [formData, setFromData] = useState(data?.formData)
    const [arrowUP, setArrowUP] = useState(false)

    // console.log(ongkosKirim?.price);
    const [loadingV, setLoadingV] = useState(false)
    const [voucher, setVoucher] = useState('')
    const [kondisiV, setKondisiV] = useState(null)
    useEffect(() => {
        if (data) window.scrollTo(0, 0);
    }, [data]);

    // 🔹 Handle submit voucher
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

    // const [shippingOption, setShippingOption] = useState(null)
    const [showShippingOptions, setShowShippingOptions] = useState(false)

    const defaultOngkir = [
        {
            name: "shipping",
            type: "radio",
            icon: <FaMapMarkerAlt />,
            value: {
                id: "self-pickup",
                nama: "Self Pickup",
                label: "Ambil langsung di gudang Tsuzumi / Pelangi Teknik.",
                harga: 0
            },
            label: {
                title: "Self Pickup",
                description: "Ambil langsung di gudang Tsuzumi / Pelangi Teknik."
            }
        },
        {
            name: "shipping",
            type: "radio",
            icon: <FaTruck />,
            value: {
                id: "pelangi-courier",
                nama: "Pelangi Teknik Courier",
                label: "Pesanan diantar langsung oleh kurir internal Pelangi Teknik.",
                harga: 0
            },
            label: {
                title: "Pelangi Teknik Courier",
                description: "Pesanan diantar langsung oleh kurir internal Pelangi Teknik."
            }
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
                        name: "shipping",
                        type: "radio",
                        icon: <FaBox />,
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
                setPay(false)
                setShowShippingOptions(false)
                setLoading(false)
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
        fullName: Yup.string()
            .max(150, 'Must be 15 characters or less')
            .required(' (Nama Lengkap Belum diisi )'),
        address: Yup.string()
            .max(99999, 'Must be 15 characters or less')
            .required(' (Alamat Belum diisi)'),
        location: Yup.object()
            .nullable()
            .required('*Silakan pilih lokasi di peta'), // <-- validasi untuk MapPicker
        // note: Yup.string()
        //     .max(150, 'Must be 15 characters or less')
        //     .required('*'),
        // country: Yup.string()
        //     .max(200, 'Must be 20 characters or less')
        //     .required('*'),
        number: Yup.number()
            .max(9999999999999, 'Must be 20 characters or less')
            .required('*Belum diisi'),
        postalCode: Yup.number()
            .max(99999999, 'Must be 20 characters or less')
            .required('*Belum diisi'),
        // province: Yup.string().required(" (Provinsi wajib dipilih) "),
        // city: Yup.string().required(" (Kota wajib dipilih) "),
    })

    const handleSubmit = async (value) => {
        setLoading(true)
        try {
            setLoading(true)

            // const NamaKota = cities.find((data) => data.city_id == value.city).city_name
            // const NamaProvince = provinces.find((data) => data.province_id == value.province).province

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
                // setShowShippingOptions(true)
                setLoading(false)

                // const PriceOngkir = await GetPriceOngkir({
                //     "origin": "152",
                //     "destination": String(value.city),
                //     "weight": Number(BeratBarang * 1000),
                //     // "weight": Number(BeratBarang),
                //     "courier": "jne"
                // })

                // const priceOngkir = PriceOngkir.rajaongkir.results[0].costs[0].cost[0].value

                // setPay(true)

            }
            await toast.promise(
                fetchData(),
                {
                    loading: 'Tunggu Sebentarrr...',
                    success: <b>Berhasil disimpan data Pengiriman</b>,
                    error: <b>Tunggu...</b>,
                }
            );
            // setOpenFormData()

        } catch (e) {
            console.log(e)
            toast.error('Tunggu...');
            setLoading(false)
            PengalihanWhatsapp()
        }

    }

    const handleWhatsapp = async () => {
        try {
            setIsLoadingWA(true)
            const waUrl = await HandleKonversiWA({ fromDataVoucher: true });
            setIsLoadingWA(false)
            window.open(waUrl, "_blank");
        } catch (e) {
            console.log(e);
            toast.error('Gagal membuka WhatsApp. Silakan coba lagi.')
            setIsLoadingWA(false)
        }
    }

    const initialValuesPengiriman = {
        shipping: data ? data?.ongkosKirim?.productName : '',
    };
    const validationSchemaPengiriman = Yup.object({
        shipping: Yup.string().required("Pilih metode pengiriman terlebih dahulu."),
    });


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
            name: e?.product?.productName.slice(0, 50),
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
        <>
            <div className={styles.container}>
                <div className={styles.dalamcontainer}>
                    <div className={styles.back}>
                        <button disabled={loading} onClick={() => router.push('/cart')}>
                            <IoIosArrowBack />   Kembali
                        </button>
                    </div>
                    <div className={styles.dalamformdantransaksi}>
                        <div className={styles.kiri}>
                            <>
                                <div className={styles.formContainer}>
                                    {formData ?
                                        <>
                                            <div className={styles.judul}>
                                                <div className={styles.angkajudulsuccess} ><FaCheck /></div>
                                                &nbsp; Informasi Pengiriman
                                                {/* <button onClick={() => paymentGateway(dataKeranjang)}>MIDSTRANS</button> */}
                                            </div>
                                            <div className={styles.informasidata}>
                                                <div>
                                                    <p>
                                                        {data?.formData?.nama_lengkap_user}
                                                    </p>
                                                    <p> {data?.formData?.no_hp_user}</p>
                                                    <p>   {data?.formData?.alamat_lengkap_user}&nbsp; {data?.formData?.kode_pos_user} </p>
                                                    <div className={styles.catatan}>
                                                        <div className={styles.kotakcatatan}></div>
                                                        <div className={styles.dalamcatatan}>   {data?.formData?.catatan_pengiriman}</div>
                                                    </div>
                                                </div>
                                                <button className={styles.edit} disabled={loading} onClick={HandleEditForm} >Edit</button>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className={styles.judul}>
                                                <div className={styles.angkajudul}>1</div>
                                                &nbsp; Informasi Pengiriman
                                            </div>

                                            <Formik
                                                initialValues={initialValues}
                                                validationSchema={validationSchema}
                                                onSubmit={async (values, { setSubmitting }) => {
                                                    try {
                                                        await handleSubmit(values);
                                                    } finally {
                                                        setSubmitting(false);
                                                    }
                                                }}
                                            >
                                                {({ handleSubmit, isSubmitting, values, setFieldValue, errors, touched }) => {
                                                    return (
                                                        <Form >
                                                            <MapPicker
                                                                loading={loading}
                                                                value={values?.location}
                                                                onChange={(coords) => {
                                                                    setFieldValue('location', coords);
                                                                }}
                                                                error={errors?.location}            // error message dari Formik
                                                                touched={touched?.location}         // apakah field sudah disentuh
                                                            />

                                                            <div>
                                                                <label htmlFor="fullName">Nama Lengkap<ErrorMessage name="fullName" className={styles.er} component="div" /> </label>
                                                                <Field type="text" name="fullName" disabled={loading} />
                                                            </div>
                                                            <div>
                                                                <label htmlFor="number">No HP<ErrorMessage name="number" className={styles.er} component="div" /></label>
                                                                <Field name="number">
                                                                    {({ field, form }) => (
                                                                        <input
                                                                            {...field}
                                                                            type="text"
                                                                            disabled={loading}
                                                                            onChange={(e) => {
                                                                                let value = e.target.value.replace(/\D/g, ''); // hapus semua karakter non-digit

                                                                                // kalau belum diawali 62, tambahkan
                                                                                if (!value.startsWith('62')) {
                                                                                    value = '62' + value.replace(/^0+/, ''); // hapus nol di depan sebelum tambahkan 62
                                                                                }

                                                                                form.setFieldValue('number', value);
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div>
                                                                <label htmlFor="address">Detail Alamat<ErrorMessage name="address" className={styles.er} component="div" /></label>
                                                                <Field type="text" name="address" disabled={loading} />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="postalCode">Kode Pos<ErrorMessage name="postalCode" className={styles.er} component="div" /></label>
                                                                <Field type="text" name="postalCode" disabled={loading} />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="note">Catatan (opsional)<ErrorMessage name="note" className={styles.er} component="div" /></label>
                                                                <Field type="text" name="note" disabled={loading} />
                                                            </div>

                                                            <button type="submit" disabled={loading}>
                                                                {loading ? 'Loading...' : 'Lanjutkan ke Metode Pengiriman'}
                                                            </button>
                                                        </Form>
                                                    )
                                                }
                                                }
                                            </Formik>
                                        </>
                                    }

                                </div>
                                <div className={styles.formContainer}>
                                    <div className={styles.judul}>
                                        <div className={styles.angkajudulsuccess}>
                                            <FaCheck />
                                        </div>
                                        &nbsp; Informasi Metode Pengiriman
                                    </div>
                                    {formData && showShippingOptions ?
                                        (
                                            <Formik
                                                enableReinitialize
                                                initialValues={initialValuesPengiriman}
                                                validationSchema={validationSchemaPengiriman}
                                            >
                                                {({ values, setFieldValue, isSubmitting, submitForm }) => (
                                                    <Form className={styles.formContainershipping}>
                                                        {shippingOptions.map((option, index) => (
                                                            <label key={index} className={styles.shippingItem}>
                                                                <Field
                                                                    type="radio"
                                                                    name="shipping"
                                                                    value={JSON.stringify(option.value)}
                                                                    onChange={async (e) => {
                                                                        setLoading(true);

                                                                        const selected = JSON.parse(e.target.value);

                                                                        setFieldValue('shipping', e.target.value);
                                                                        setPay(true);

                                                                        setOngkosKirim({
                                                                            cartID: userId,
                                                                            productName: selected?.nama,
                                                                            label: selected?.label,
                                                                            price: Number(selected?.harga),
                                                                            quantity: 1
                                                                        });

                                                                        toast.success(`Metode pengiriman berhasil dipilih: ${selected?.nama}`);

                                                                        setLoading(false);
                                                                    }}
                                                                    disabled={loading}
                                                                />
                                                                <div className={styles.shippingText}>
                                                                    <strong>{option.icon} {option.label.title}</strong>
                                                                    <p>{option.label.description}</p>
                                                                    {Boolean(option.value.harga) && <p>{convertToRupiah(option.value.harga)}</p>}

                                                                </div>
                                                            </label>
                                                        ))}
                                                    </Form>
                                                )}
                                            </Formik>

                                        )
                                        :
                                        (
                                            <div>
                                                {/* <div className={styles.judul}>
                                                    <div className={styles.angkajudulsuccess}>
                                                        <FaCheck />
                                                    </div>
                                                    &nbsp; Informasi Metode Pengiriman
                                                </div> */}
                                                <div className={styles.informasidata}>
                                                    <div className={styles.shippingText}>
                                                        <strong>Metode Pengiriman:</strong>
                                                        <p>SELF PICKUP, PELANGI KURIR, JNE REG, JNE YES, JNE TRUCK</p>
                                                    </div>
                                                    {
                                                        Boolean(formData || showShippingOptions) &&
                                                        <button
                                                            className={styles.edit}
                                                            disabled={loading}
                                                            onClick={HandlePilihEkspedisi}
                                                        >
                                                            {loading ? 'Loading' : 'Pilih Ekpedisi'}
                                                        </button>

                                                    }

                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                {Boolean(formData && pay) ?
                                    <>
                                        <form onSubmit={formikPayment.handleSubmit} className={styles.pembayaran2}>
                                            <div className={styles.judul2}>Payment</div>
                                            <div className={styles.notifmid}>
                                                All transactions are secure and encrypted
                                            </div>

                                            {/* Opsi PaperID */}
                                            {<label className={styles.kotakpembayaran}>
                                                <div className={styles.inputnama}>
                                                    <input
                                                        type="radio"
                                                        name="metode"
                                                        value="paperid"
                                                        disabled={loading}
                                                        checked={formikPayment.values.metode === 'paperid'}
                                                        onChange={formikPayment.handleChange}
                                                        className={styles.radio}
                                                    />
                                                    <div className={styles.kotak1}>
                                                        Payment via PaperID
                                                    </div>
                                                </div>
                                                <div className={styles.kotak2}>
                                                    <div className={styles.metodpay}>
                                                        <Image
                                                            src="https://api-sandbox.duitku.com/pgimages/pg/BC.svg"
                                                            width={40}
                                                            height={20}
                                                            alt="BCA"
                                                        />
                                                    </div>
                                                    <div className={styles.metodpay}>
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_URL}/qris.svg`}
                                                            width={40}
                                                            height={20}
                                                            alt="QRIS"
                                                        />
                                                    </div>
                                                    <div className={styles.metodpay}>
                                                        <Image
                                                            src="https://api-prod.duitku.com/pgimages/pg/VC.svg"
                                                            width={40}
                                                            height={20}
                                                            alt="VISA"
                                                        />
                                                    </div>
                                                    <div className={styles.metodpay2}>+22</div>
                                                </div>
                                            </label>
                                            }
                                            {email == 'it.pt.pelangiteknikindonesia@gmail.com' &&
                                                <label className={styles.kotakpembayaran}>
                                                    <div className={styles.inputnama}>
                                                        <input
                                                            type="radio"
                                                            name="metode"
                                                            value="midtrans"
                                                            disabled={loading}
                                                            checked={formikPayment.values.metode === 'midtrans'}
                                                            onChange={formikPayment.handleChange}
                                                            className={styles.radio}
                                                        />
                                                        <div className={styles.kotak1}>
                                                            Payment via Midtrans
                                                        </div>
                                                    </div>
                                                    <div className={styles.kotak2}>
                                                        <div className={styles.metodpay}>
                                                            <Image
                                                                src="https://api-sandbox.duitku.com/pgimages/pg/BC.svg"
                                                                width={40}
                                                                height={20}
                                                                alt="BCA"
                                                            />
                                                        </div>
                                                        <div className={styles.metodpay}>
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_URL}/qris.svg`}
                                                                width={40}
                                                                height={20}
                                                                alt="QRIS"
                                                            />
                                                        </div>
                                                        <div className={styles.metodpay}>
                                                            <Image
                                                                src="https://api-prod.duitku.com/pgimages/pg/VC.svg"
                                                                width={40}
                                                                height={20}
                                                                alt="VISA"
                                                            />
                                                        </div>
                                                        <div className={styles.metodpay2}>+22</div>
                                                    </div>
                                                </label>
                                            }
                                            {/* Info setelah klik */}
                                            <div className={styles.afterklik}>
                                                <div>
                                                    <MdOutlinePayment size={70} color="#b5b5b5ff" />
                                                </div>
                                                <div className={styles.text2}>
                                                    After clicking <b>“Bayar Sekarang”</b>, you will be redirected to{' '}
                                                    <b>
                                                        {formikPayment.values.metode === 'midtrans'
                                                            ? 'Midtrans'
                                                            : 'PaperID Invoice'}
                                                    </b>{' '}
                                                    to complete your purchase securely.
                                                </div>
                                            </div>

                                            <div className={styles.skt}>
                                                Dengan klik “Bayar Sekarang”, saya menyetujui{' '}
                                                <span className={styles.sk}>
                                                    <Link href="/policies/term-and-condition">Syarat dan Ketentuan</Link>
                                                </span>{' '}
                                                PelangiTeknik
                                            </div>

                                            <button type="submit" disabled={loading} className={styles.paynow}>
                                                {loading ? 'Loading...' : 'Bayar Sekarang'}
                                            </button>
                                        </form>
                                    </>
                                    :
                                    <div className={styles.judul}>
                                        <div className={styles.angkajudul}>3</div>
                                        &nbsp; Pembayaran
                                    </div>
                                }
                            </>
                        </div>
                        <div className={styles.formdata}>

                            <div className={styles.kotak}>
                                {loading ? <div className={styles.loading}>
                                    <FadeLoader color='#152f66' />
                                </div> :
                                    <>
                                        <div className={styles.responsive} style={arrowUP ? { display: 'block' } : {}}>
                                            <div className={styles.arrowatasclose} onClick={() => setArrowUP(!arrowUP)}><div></div><div><RxCross2 color='red' size={30} /></div></div>
                                            <div className={styles.dalamkananvcdeskop}>
                                                <div className={styles.judulvc}>VOUCHER <button disabled={isLoadingWA} style={{ textDecoration: 'underline' }} onClick={handleWhatsapp}>(dapatkan voucher) {isLoadingWA && "Loading..."}</button></div>
                                                <div className={styles.inputenter}>
                                                    <input type='text' onChange={(e) => setVoucher(e.target.value)} value={voucher} placeholder='masukan sini...'></input>
                                                    <button disabled={loadingV} className={styles.buttonvocher} onClick={() => HandleVoucher()}>{loadingV ? "Loading.." : "Tambahkan"}</button>
                                                </div>
                                            </div>
                                            <div className={styles.judulringkasan}>Ringkasan Pesanan</div>

                                            {data?.items?.map((data, i) => {
                                                return (
                                                    <div key={i} className={styles.product}>
                                                        <div className={styles.textkiri}>{data?.product.productName} (<b>{data?.quantity}x</b>)- total:  {data?.product?.weightProduct * data?.quantity} kg </div>
                                                        <div className={styles.textkanan}>{convertToRupiah(Number(data?.product.productPriceFinal * data?.quantity))}</div>
                                                    </div>
                                                )
                                            })}
                                            {ongkosKirim &&
                                                <>
                                                    <div className={styles.product}>
                                                        <div className={styles.textkiri}>Ongkos Kirim</div>
                                                        <div className={styles.textkanan}>{convertToRupiah(Number(ongkosKirim?.price))}</div>
                                                    </div>
                                                    <div className={styles.subjudul}>
                                                        <div className={styles.textkiri}>Total Berat</div>
                                                        <div className={styles.textkanan}>{totalAllWeight} kg</div>
                                                    </div>
                                                </>
                                            }
                                            <div className={styles.subjudul} style={{ borderTop: '1px solid var(--colorbggrey)', paddingTop: '10px ' }}>
                                                <div className={styles.textkiri}>Subtotal</div>
                                                <div className={styles.textkanan}>{Number(ongkosKirim?.price) ? convertToRupiah(totalPrice + Number(ongkosKirim?.price)) : convertToRupiah(totalPrice)}</div>
                                            </div>

                                            <div className={styles.subjudul} >
                                                <div className={styles.textkiri}>Diskon</div>
                                                {!kondisiV && 0}
                                                {kondisiV?.tipe == 'nominal' && <div className={styles.textkanan}>{convertToRupiah(Number(kondisiV?.nominal))}</div>}
                                                {kondisiV?.tipe == 'percent' && <div className={styles.textkanan}>{convertToRupiah((totalPrice * (kondisiV?.diskon ? kondisiV?.diskon : 0)) / 100) + ' (' + (kondisiV?.diskon + '%') + ')'}</div>}
                                            </div>
                                            <div className={styles.total} style={{ borderTop: '1px solid var(--colorbggrey)' }}>
                                                <div className={styles.texttotal}>Total</div>
                                                {!kondisiV && <div className={styles.texttotal}>{convertToRupiah(convertToRupiah((pricesOngkir + totalPrice - (totalPrice * (kondisiV?.diskon ? kondisiV?.diskon : 0)) / 100)))}</div>}
                                                {kondisiV?.tipe == 'nominal' && <div className={styles.texttotal}>{convertToRupiah((pricesOngkir + totalPrice - kondisiV?.nominal))}</div>}
                                                {kondisiV?.tipe == 'percent' && <div className={styles.texttotal}>{convertToRupiah((pricesOngkir + totalPrice - (totalPrice * (kondisiV?.diskon ? kondisiV?.diskon : 0)) / 100))}</div>}
                                            </div>
                                        </div>

                                        <div className={styles.dalamkananvcmobile}>
                                            <div className={styles.judulvc}>VOUCHER <button disabled={isLoadingWA} style={{ textDecoration: 'underline' }} onClick={handleWhatsapp}>(dapatkan voucher) {isLoadingWA && "Loading..."}</button></div>
                                            <div className={styles.inputenter2}>
                                                <input type='text' onChange={(e) => setVoucher(e.target.value)} value={voucher} placeholder='masukan sini...'></input>
                                                <button disabled={loadingV} className={styles.buttonvocher2} onClick={() => HandleVoucher()}>{loadingV ? "Loading.." : "Tambahkan"}</button>
                                            </div>
                                        </div>
                                        {!arrowUP &&
                                            <div className={styles.arrowatas} onClick={() => setArrowUP(true)}>
                                                <div>Lihat Detail</div>
                                                <div className={styles.iconarrow}><IoIosArrowUp size={20} /></div>
                                            </div>
                                        }
                                        <div className={styles.totalmobile} onClick={() => setArrowUP(true)}>
                                            <div className={styles.texttotal}>Total</div>
                                            {!kondisiV && <div className={styles.texttotal}>{convertToRupiah(convertToRupiah((pricesOngkir + totalPrice - (totalPrice * (kondisiV?.diskon ? kondisiV?.diskon : 0)) / 100)))}</div>}
                                            {kondisiV?.tipe == 'nominal' && <div className={styles.texttotal}>{convertToRupiah((pricesOngkir + totalPrice - kondisiV?.nominal))}</div>}
                                            {kondisiV?.tipe == 'percent' && <div className={styles.texttotal}>{convertToRupiah((pricesOngkir + totalPrice - (totalPrice * (kondisiV?.diskon ? kondisiV?.diskon : 0)) / 100))}</div>}
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}
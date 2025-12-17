'use client'
import styles from '@/components/Penawaran.module.css'
import { useStore } from "@/zustand/zustand";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import convertToRupiah from '@/utils/ConvertRupiah';
import toast from 'react-hot-toast';
// import pdfMake from 'pdfmake/build/pdfmake';
import LogoAtas from './logo/logoAtas';
import TTD from './logo/ttd';
import { GetRandomPenyemangat, PostSuratPenawaran } from '@/controllers/userNew';
import QRCode from 'qrcode';
import { sendGAEventL } from '@/lib/ga';
import { usePathname } from 'next/navigation';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { sendGTMEventt } from '@/lib/gtm';
import { HandleNotifikasiPerson, HandleNotifikasiWA } from '@/service/handleNotifikasiWA';
import { GetNumberSalesForm } from '@/controllers/userClient';

export default function Penawaran({ data }) {
    useLockBodyScroll();

    // const spec = data?.spec_product
    const logoBase64 = LogoAtas()// Pendek karena hanya contoh.
    const logoTTD = TTD()// Pendek karena hanya contoh.

    const pathname = usePathname()
    const url = `${process.env.NEXT_PUBLIC_URL}${pathname}`

    // Fungsi untuk generate PDF
    const [loading, setLoading] = useState(false)
    const setIsPenawaran = useStore((state) => state.setIsPenawaran)
    const initialValues = {
        name: '',
        number: '',
        email: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .max(300, 'max 300 karakter')
            .required('Name is required'),
        number: Yup.number()
            .max(9999999999999, 'Must be 13 characters or less')
            .required('Nomer Headphone/Telp is required'),
        // email: Yup.string()
        //     .email('Invalid Email')
        //     // .max(99999, 'Must be 150 characters or less')
        //     .required('Email is required'),
    });


    const generateQRCode = async (text) => {
        try {
            return await QRCode.toDataURL(text); // Menghasilkan QR Code dalam format base64
        } catch (err) {
            console.error(err);
            return '';
        }
    };


    // const [qr, setQr] = useState()
    const handleSubmit = async (values) => {
        if (!values.name || !values.number) {
            alert('Harap lengkapi semua field yang wajib diisi!');
            toast.error('This is an error!');
            return;
        }

        try {
            setLoading(true)
            const NumberSales = await GetNumberSalesForm()

            const qrCodeData = await generateQRCode(`${process.env.NEXT_PUBLIC_URL}/product/${data.slugProduct}`);
            // setQr(qrCodeData)
            const docDefinitionv = {
                content: [
                    {
                        columns: [
                            {
                                image: qrCodeData, // Tambahkan QR Code base64 sebagai gambar
                                width: 70, // Ukuran gambar
                                style: 'qr'
                            },
                            {
                                stack: [
                                    {
                                        image: logoBase64, // Menyisipkan gambar logo
                                        width: 250, // Ukuran logo
                                        alignment: 'right', // Posisi logo
                                        style: 'gambarlogo'
                                    },
                                    { text: 'Lindeteves Trade Center Lt. GF2 Blok B7 No. 05', style: 'atasLogo', alignment: 'right' },
                                    { text: 'Jl. Hayam Wuruk No.127 - Jakarta Barat', style: 'atasLogo', alignment: 'right' },
                                    { text: 'Tel.021-62303512; pelangiteknik@rocketmail.com', style: 'atasLogo', alignment: 'right' },
                                    { text: 'www.pelangiteknik.com', style: 'atasLogo', alignment: 'right' },
                                ],
                            },
                        ],
                        columnGap: 10, // Jarak antar kolom
                    },
                    { text: '\n' },
                    { text: '\n' },
                    { text: '\n' },
                    { text: `Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, style: 'defaultStyle' },
                    { text: '\n' },
                    { text: 'Kepada Yth,', style: 'Blode' },
                    { text: `${values.name}`, style: 'Blode' },
                    { text: '\n' },
                    { text: `Perihal       : Surat Penawaran`, style: 'Blode' },
                    { text: '\n' },
                    { text: `Dengan hormat, demikian disampaikan informasi dari barang yang saudara butuhkan :`, style: 'defaultStyle' },

                    { text: '\n' },
                    { text: `${data.productName} - ${convertToRupiah(Number(data.productPriceFinal))}`, style: 'productjudul' },
                    data.spekNew.map((data) => {
                        return (
                            { text: `${data.input} : ${data.isi}`, style: 'product' }
                        )
                    }),
                    { text: '\n' },
                    { text: `Demikian disampaikan,untuk informasi lebih lanjut hubungi ${NumberSales.name} ( ${NumberSales.numberForm} ) .  Atas perhatiannya kami ucapkan terima kasih.`, style: 'defaultStyle' },
                    { text: '\n' },
                    { text: '\n' },
                    { text: 'Salam,', style: 'ttd', alignment: 'right' },
                    {
                        image: logoTTD, // Menyisipkan gambar logo
                        width: 150, // Ukuran logo
                        alignment: 'right', // Posisi logo
                        style: 'gambarlogo'
                    },
                    { text: 'Jakarta,', style: 'ttd', alignment: 'right' }
                ],
                styles: {
                    atasLogo: {
                        fontSize: 9,
                        marginLeft: 30,
                        marginRight: 30,
                    },
                    Blode: {
                        fontSize: 11,
                        bold: true,
                        marginLeft: 30,
                        marginRight: 30,
                    },
                    ttd: {
                        fontSize: 11,
                        bold: true,
                        marginLeft: 70,
                        marginRight: 70,
                    },
                    productjudul: {
                        fontSize: 11,
                        marginLeft: 70,
                        marginRight: 30,
                        bold: true,
                    },
                    product: {
                        fontSize: 11,
                        marginLeft: 70,
                        // bold: true,
                    },
                    defaultStyle: {
                        fontSize: 11,
                        marginLeft: 30,
                        marginRight: 30,
                    },
                    qr: {
                        fontSize: 11,
                        marginLeft: 30,
                        marginRight: 30,
                        marginTop: 10
                    },
                    gambarlogo: {
                        marginRight: 14,
                    },
                    footerText: {
                        fontSize: 10,
                        alignment: 'left',
                        color: 'gray',
                    }
                },
                background: [
                    {
                        text: `${process.env.NEXT_PUBLIC_URL}/product/${data.slugProduct}`,
                        absolutePosition: { x: 40, y: 800 }, // Atur posisi absolut
                        style: 'footerText',
                    },
                ],
            };
            pdfMake.createPdf(docDefinitionv).download(`surat_penawaran - ${values.name} - ${data.productName}.pdf`);

            const fetchData = async () => {
                try {
                    const randomPenyemangat = await GetRandomPenyemangat();
                    const NumberSales = await GetNumberSalesForm();
                    const now = new Date();

                    // Format tanggal & jam
                    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
                    const tanggal = now.toLocaleDateString('id-ID', options);
                    const jam = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
                    const tanggalJam = `${tanggal}, jam ${jam}`;

                    // Ambil data customer & product dari values / data
                    const pesanWA = `==| ${tanggalJam} |==

*Hallo ${NumberSales?.name}, ada yang mengajukan penawaran 🚀*

_info_: 
- Nama Customer: ${values?.name}
- Nomor Telp: ${values?.number}
- Email: ${values?.email ? values.email : '-'}
- Product: ${data?.productName} 
- Link: ${process.env.NEXT_PUBLIC_URL}/product/${data?.slugProduct}
- PIC Sales: ${NumberSales?.name}

${randomPenyemangat.hashtag}`;
                    process.env.NODE_ENV === 'production' && await PostSuratPenawaran({
                        nameProduct: data?.productName,
                        slugProduct: data?.slugProduct,
                        name: values?.name,
                        email: values?.email ? values?.email : '-',
                        noHP: values?.number,
                        note: 'belum ada',
                        sales: NumberSales.name,
                    });

                    // const encodedMessage = encodeURIComponent(
                    //     `Halo ${NumberSales?.name}, saya butuh bantuan lebih lanjut mengenai product ${data?.productName} Pelangi Teknik`
                    // );
                    // const randomPhoneNumber = NumberSales?.numberWA;
                    // const waUrl = `https://wa.me/${randomPhoneNumber}?text=${encodedMessage}`;

                    // Tracking pixel
                    try {
                        const { trackEvent } = await import('@/utils/facebookPixel');
                        if (process.env.NODE_ENV === 'production') {
                            sendGTMEventt({ event: 'form_penawaran_googleAds', value: NumberSales?.numberForm || '' });

                            trackEvent('Purchase', {
                                content_ids: [data.id],
                                content_type: `${data.user.categoryProductUtama.category} - ${data.user.category}`,
                                value: parseFloat(data.productPriceFinal),
                                currency: 'IDR',
                                num_items: 1,
                            });

                            // trackEvent('CompleteRegistration', {
                            //     content_ids: [data.id],
                            //     content_type: `${data.user.categoryProductUtama.category} - ${data.user.category}`,
                            //     value: parseFloat(data.productPriceFinal),
                            //     currency: 'IDR',
                            //     num_items: 1,
                            // });

                            sendGAEventL('form_penawaran', {
                                form_name: values?.name,
                                form_email: values?.email || 'tidak email',
                                form_phone: values?.number,
                                product_name: data?.productName,
                                product_value: parseFloat(data.productPriceFinal),
                                product_category: `${data?.user?.categoryProductUtama?.category} - ${data?.user?.category}`,
                                product_link: url,
                                sales_name: NumberSales.name,
                                sales_number: NumberSales.numberForm,
                            });
                            await HandleNotifikasiWA('120363280120926056@g.us', pesanWA)
                            await HandleNotifikasiPerson(`${NumberSales?.numberWA?.replace("+", "")}@c.us`, 'cek grup PD, ada penawaran 🚀')
                        }
                        toast.success('Berhasil mengirim data penawaran ke sales!');
                    } catch (err) {
                        console.warn('Tracking error:', err);
                    }

                    // Tambahkan delay 5 detik sebelum buka WhatsApp
                    await new Promise((resolve) => setTimeout(resolve, 3000));
                    // buka WhatsApp setelah semua proses berhasil dijalankan
                    // window.open(waUrl, '_blank');
                    setIsPenawaran();
                } catch (error) {
                    console.error('Gagal mengirim data penawaran:', error);
                    alert('Terjadi kesalahan saat mengirim data, silakan coba lagi / hubungi sales.');
                }
            };


            toast.promise(
                fetchData(),
                {
                    loading: 'Wait!',
                    success: <b>Berhasil didownload dan kirim!</b>,
                    error: <b>Try again</b>,
                }
            );
            setLoading(false)
        } catch (e) {
            setLoading(false)
        }
    }

    return (
        <>
            <div className={styles.bghitam} onClick={() => setIsPenawaran()}>LoginGoogle</div>
            <div className={styles.container}>
                <div className={styles.dalamcontainer}>
                    <div className={styles.text}>
                        Butuh Penawaran <b>{data?.productName}</b>? Lengkapi Data Anda!<br /><br />
                        Isi formulir di bawah untuk mendapatkan Surat Permintaan Penawaran sesuai kebutuhan Anda.

                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, errors, touched }) => (
                            <Form>

                                <div className={styles.input}>
                                    <label htmlFor="name">
                                        {/* {errors.hargaDitawarkan && touched.hargaDitawarkan ? <div style={{ color: 'red' }}>{errors.hargaDitawarkan}Belum diisi!!</div> : ''} */}
                                        <ErrorMessage name="name" className={styles.er} component="div" />
                                    </label>
                                    <Field type="text" name="name" placeholder={'Nama Lengkap'} disabled={loading} />
                                </div>
                                <div className={styles.input}>
                                    <label htmlFor="number">
                                        {/* {errors.hargaDitawarkan && touched.hargaDitawarkan ? <div style={{ color: 'red' }}>{errors.hargaDitawarkan}Belum diisi!!</div> : ''} */}
                                        <ErrorMessage name="number" className={styles.er} component="div" />
                                    </label>
                                    <Field type="number" name="number" placeholder={'Nomor Headphone/Telp'} disabled={loading} />
                                </div>
                                <div className={styles.input}>
                                    <label htmlFor="email">
                                        {/* {errors.email && touched.email ? <div style={{ color: 'red' }}>{errors.email}Belum diisi!!</div> : ''} */}
                                        <ErrorMessage name="email" className={styles.er} component="div" />
                                    </label>
                                    <Field type="email" name="email" placeholder={'Email ( Opsional )'} disabled={loading} />
                                </div>

                                <div className={styles.alert}>Kami akan menghubungi anda *</div>
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Loading...' : 'Submit'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
                {/* <Image src={qr} width={150} height={150} alt='qr' ></Image> */}
            </div>
        </>
    )
}

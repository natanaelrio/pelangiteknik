'use client'
import styles from '@/components/Penawaran.module.css'
import { useStore } from "@/zustand/zustand";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import convertToRupiah from '@/utils/ConvertRupiah';
import toast from 'react-hot-toast';
import LogoAtas from './logo/logoAtas';
import TTD from './logo/ttd';
import { GetRandomPenyemangat, PostSuratPenawaran } from '@/controllers/userNew';
import QRCode from 'qrcode';
import { sendGAEventL } from '@/lib/ga';
import { usePathname } from 'next/navigation';
import pdfMake from 'pdfmake/build/pdfmake';
import { sendGTMEventt } from '@/lib/gtm';
import { HandleNotifikasiPerson, HandleNotifikasiWA } from '@/service/handleNotifikasiWA';
import { GetNumberSalesForm } from '@/controllers/userClient';
import Image from 'next/image';

export default function Penawaran({ data }) {
    useLockBodyScroll();

    console.log(data);

    const pathname = usePathname()
    const url = `${process.env.NEXT_PUBLIC_URL}${pathname}`

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
            .required('Nama harus diisi'),
        number: Yup.number()
            .max(9999999999999, 'Nomor maksimal 13 digit')
            .required('Nomor HP/Telp harus diisi'),
    });

    const generateQRCode = async (text) => {
        try {
            return await QRCode.toDataURL(text);
        } catch (err) {
            console.error(err);
            return '';
        }
    };

    const generatePdfDoc = async (values, qrCodeData, NumberSales) => {
        const logoBase64 = LogoAtas()
        const logoTTD = TTD()

        return {
            content: [
                {
                    columns: [
                        { image: qrCodeData, width: 70, style: 'qr' },
                        {
                            stack: [
                                { image: logoBase64, width: 250, alignment: 'right', style: 'gambarlogo' },
                                { text: 'Lindeteves Trade Center Lt. GF2 Blok B7 No. 05', style: 'atasLogo', alignment: 'right' },
                                { text: 'Jl. Hayam Wuruk No.127 - Jakarta Barat', style: 'atasLogo', alignment: 'right' },
                                { text: 'Tel.021-62303512; pelangiteknik@rocketmail.com', style: 'atasLogo', alignment: 'right' },
                                { text: 'www.pelangiteknik.com', style: 'atasLogo', alignment: 'right' },
                            ],
                        },
                    ],
                    columnGap: 10,
                },
                { text: '\n\n\n' },
                { text: `Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, style: 'defaultStyle' },
                { text: '\n' },
                { text: 'Kepada Yth,', style: 'header' },
                { text: `${values.name}`, style: 'header' },
                { text: '\n' },
                { text: 'Perihal       : Surat Penawaran', style: 'header' },
                { text: '\n' },
                { text: 'Dengan hormat, demikian disampaikan informasi dari barang yang saudara butuhkan :', style: 'defaultStyle' },
                { text: '\n' },
                { text: `${data.productName} - ${convertToRupiah(Number(data.productPriceFinal))}`, style: 'productTitle' },
                data.spekNew.map((item) => (
                    { text: `${item.input} : ${item.isi}`, style: 'product' }
                )),
                { text: '\n' },
                { text: `Demikian disampaikan,untuk informasi lebih lanjut hubungi ${NumberSales.name} ( ${NumberSales.numberForm} ) .  Atas perhatiannya kami ucapkan terima kasih.`, style: 'defaultStyle' },
                { text: '\n\n' },
                { text: 'Salam,', style: 'ttd', alignment: 'right' },
                { image: logoTTD, width: 150, alignment: 'right', style: 'gambarlogo' },
                { text: 'Jakarta,', style: 'ttd', alignment: 'right' }
            ],
            styles: {
                atasLogo: { fontSize: 9, marginLeft: 30, marginRight: 30 },
                header: { fontSize: 11, bold: true, marginLeft: 30, marginRight: 30 },
                ttd: { fontSize: 11, bold: true, marginLeft: 70, marginRight: 70 },
                productTitle: { fontSize: 11, marginLeft: 70, marginRight: 30, bold: true },
                product: { fontSize: 11, marginLeft: 70 },
                defaultStyle: { fontSize: 11, marginLeft: 30, marginRight: 30 },
                qr: { fontSize: 11, marginLeft: 30, marginRight: 30, marginTop: 10 },
                gambarlogo: { marginRight: 14 },
                footerText: { fontSize: 10, alignment: 'left', color: 'gray' }
            },
            background: [{
                text: `${process.env.NEXT_PUBLIC_URL}/product/${data.slugProduct}`,
                absolutePosition: { x: 40, y: 800 },
                style: 'footerText',
            }],
        };
    }

    const handleSubmit = async (values) => {
        if (!values.name || !values.number) {
            toast.error('Harap lengkapi semua field yang wajib diisi!');
            return;
        }

        try {
            setLoading(true)
            const NumberSales = await GetNumberSalesForm()
            const qrCodeData = await generateQRCode(`${process.env.NEXT_PUBLIC_URL}/product/${data.slugProduct}`)

            const docDefinition = await generatePdfDoc(values, qrCodeData, NumberSales)
            pdfMake.createPdf(docDefinition).download(`surat_penawaran - ${values.name} - ${data.productName}.pdf`)

            await fetchData(values, NumberSales)
            setIsPenawaran()
        } catch (e) {
            console.error('Gagal mengirim data penawaran:', e)
            toast.error('Terjadi kesalahan saat mengirim data, silakan coba lagi / hubungi sales.')
        } finally {
            setLoading(false)
        }
    }

    const fetchData = async (values, NumberSales) => {
        const randomPenyemangat = await GetRandomPenyemangat()
        const now = new Date()
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
        const tanggal = now.toLocaleDateString('id-ID', options)
        const jam = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
        const tanggalJam = `${tanggal}, jam ${jam}`

        const pesanWA = `==| ${tanggalJam} |==

*Hallo ${NumberSales?.name}, ada yang mengajukan penawaran*

_info_:
- Nama Customer: ${values?.name}
- Nomor Telp: ${values?.number}
- Email: ${values?.email || '-'}
- Product: ${data?.productName}
- Link: ${process.env.NEXT_PUBLIC_URL}/product/${data?.slugProduct}
- PIC Sales: ${NumberSales?.name}

${randomPenyemangat.hashtag}`

        if (process.env.NODE_ENV === 'production') {
            await PostSuratPenawaran({
                nameProduct: data?.productName,
                slugProduct: data?.slugProduct,
                name: values?.name,
                email: values?.email || '-',
                noHP: values?.number,
                note: 'belum ada',
                sales: NumberSales.name,
            })

            try {
                const { trackEvent } = await import('@/utils/facebookPixel')
                sendGTMEventt({ event: 'form_penawaran_googleAds', value: NumberSales?.numberForm || '' })
                trackEvent('Purchase', {
                    content_ids: [data.id],
                    content_type: `${data.user.categoryProductUtama.category} - ${data.user.category}`,
                    value: parseFloat(data.productPriceFinal),
                    currency: 'IDR',
                    num_items: 1,
                })
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
                })
                await HandleNotifikasiWA('120363021369281320@g.us', pesanWA)
                await HandleNotifikasiPerson(`${NumberSales?.numberWA?.replace("+", "")}@c.us`, 'cek grup sales PT, ada penawaran')
            } catch (err) {
                console.warn('Tracking error:', err)
            }
        }

        toast.success('Berhasil mengirim data penawaran ke sales!')
    }

    return (
        <>
            <div className={styles.backdrop} onClick={() => setIsPenawaran()} />
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.imageSection}>
                        <div className={styles.productImage}>
                            <Image
                                src={data?.imageProductUtama?.secure_url}
                                alt={data?.productName}
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <div className={styles.imageContent}>
                            <h2>Butuh Penawaran <span>{data?.productName}</span>?</h2>
                            <p>Isi formulir untuk mendapatkan Surat Penawaran.</p>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.formSectionTitle}>
                            <h3>Formulir Penawaran</h3>
                            <p>Data anda akan dikirim ke sales kami</p>
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values }) => (
                                <Form className={styles.form}>
                                    <div className={styles.field}>
                                        <div className={styles.inputWrapper}>
                                            <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            <Field type="text" name="name" placeholder="Nama Lengkap" disabled={loading} />
                                        </div>
                                        <ErrorMessage name="name" className={styles.error} component="div" />
                                    </div>

                                    <div className={styles.field}>
                                        <div className={styles.inputWrapper}>
                                            <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                            <Field type="number" name="number" placeholder="Nomor HP/Telp" disabled={loading} />
                                        </div>
                                        <ErrorMessage name="number" className={styles.error} component="div" />
                                    </div>

                                    <div className={styles.field}>
                                        <div className={styles.inputWrapper}>
                                            <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                            <Field type="email" name="email" placeholder="Email (Opsional)" disabled={loading} />
                                        </div>
                                        <ErrorMessage name="email" className={styles.error} component="div" />
                                    </div>

                                    <p className={styles.note}>Kami akan menghubungi anda dalam 1x24 jam</p>

                                    <button type="submit" disabled={loading}>
                                        {loading ? (
                                            <span className={styles.loading}>
                                                <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
                                                </svg>
                                                Memproses...
                                            </span>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="22" y1="2" x2="11" y2="13" />
                                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                                </svg>
                                                Kirim Penawaran
                                            </>
                                        )}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}

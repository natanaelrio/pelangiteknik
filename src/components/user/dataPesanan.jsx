'use client'
import styles from '@/components/user/dataPesanan.module.css'
import convertToRupiah from "@/utils/ConvertRupiah";
import { useRouter } from 'nextjs-toploader/app';
import { PiCodesandboxLogoDuotone } from "react-icons/pi";
import { IoChevronBack } from "react-icons/io5";
import CustomLink from "@/utils/CustomLink";
import Image from 'next/image';
import { MdNotes } from "react-icons/md";
import { GetNotaPesanan } from '@/controllers/cart';
import toast from 'react-hot-toast';
import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts'; // Un-comment if needed
import LogoAtas from '../logo/logoAtas';
import React from 'react'
import TTD from '../logo/ttd';
import { FaStickyNote } from "react-icons/fa";
import GetRandomPhoneNumber from '@/utils/getRandomPhoneNumber';

export default function DataPesanan({ data }) {
    const router = useRouter()
    const logoBase64 = LogoAtas()
    const logoTTD = TTD()

    const HandleNota = async (e) => {
        const fetchData = async () => {
            const dataNota = await GetNotaPesanan(e)
            const dataUser = dataNota?.data[0]
            const itemsData = dataUser.dataPesananItems.map((data) => {
                return (
                    [
                        { text: data.productName, style: "colorproduct" },
                        { text: data.quantity, style: "subheader" },
                        { text: convertToRupiah(Number(data.priceOriginal)), style: "subheader" },
                        { text: data.note == 'ongkir' ? '0%' : dataUser?.diskon ? dataUser?.diskon + '%' : '0%', style: "subheader" },
                        { text: convertToRupiah(Number((data.priceOriginal - ((data.priceOriginal * data.quantity) * dataUser?.diskon) / 100) * data.quantity)), style: "subheader" },
                    ]
                )
            })

            const totalPriceOngkir = dataUser.dataPesananItems.filter(item => item?.note == "ongkir").map((data) => {
                return data.priceOriginal * data.quantity
            }).reduce((accumulator, currentValue) => accumulator + currentValue, 0)


            const totalPrice = dataUser.dataPesananItems.filter(item => item?.note !== "ongkir").map((data) => {
                return data.priceOriginal * data.quantity
            }).reduce((accumulator, currentValue) => accumulator + currentValue, 0)

            const totalQuantity = dataUser.dataPesananItems.map((data) => {
                return data.quantity
            }).reduce((accumulator, currentValue) => accumulator + currentValue, 0)


            const docDefinitionv = {
                content: [
                    {
                        columns: [
                            {
                                image: logoBase64,
                                width: 220,
                                alignment: 'left',
                            },
                            {
                                stack: [
                                    { text: "INVOICE", style: "atasLogo", alignment: "right" },
                                    { text: dataUser?.merchantOrderId, style: 'atasLogo', alignment: 'right' },
                                ],
                            }
                        ],
                    },
                    { text: '\n\n' },
                    {
                        columns: [
                            {
                                stack: [
                                    { text: "DITERBITKAN ATAS NAMA", style: "atas" },
                                    { text: "Penjual : PT PELANGI TEKNIK INDONESIA", style: "subheader" },
                                    { text: `Kode    : ${dataUser?.kode ? dataUser?.kode : 'NOVOUCHER'}`, style: "subheader" }
                                ]
                            },
                            {
                                table: {
                                    widths: [80, "auto", "auto"],
                                    body: [
                                        [
                                            { text: "UNTUK", bold: true, style: "textinformasi" },
                                            { text: "", style: "textinformasi" },
                                            { text: "", style: "textinformasi" }
                                        ],
                                        [
                                            { text: "Pembeli", style: "textinformasi" },
                                            { text: ":", style: "textinformasi" },
                                            { text: `${dataUser?.nama_lengkap_user}`, style: "subheaderB" }
                                        ],
                                        [
                                            { text: "Tanggal Pembelian", style: "textinformasi" },
                                            { text: ":", style: "textinformasi" },
                                            { text: `${new Date(dataUser?.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, style: "subheaderB" }
                                        ],
                                        [
                                            { text: "Alamat Pengiriman", style: "textinformasi" },
                                            { text: ":", style: "textinformasi" },
                                            { text: `${dataUser?.alamat_lengkap_user}`, style: "subheaderB" }
                                        ],
                                        [
                                            { text: "Catatan", style: "textinformasi" },
                                            { text: ":", style: "textinformasi" },
                                            { text: `${dataUser?.catatan_pengiriman ? dataUser?.catatan_pengiriman : '-'} `, style: "subheaderB" }
                                        ],
                                    ],
                                },
                                layout: "noBorders",
                                margin: [0, 5, 0, 15],
                            },
                        ],
                    },
                    { text: '\n\n' },
                    {
                        table: {
                            widths: ["*", "auto", "auto", "auto", "auto"],
                            body: [
                                [
                                    { text: "Info Produk", style: "tableHeader" },
                                    { text: "Jumlah", style: "tableHeader" },
                                    { text: "Harga Satuan", style: "tableHeader" },
                                    { text: "Diskon", style: "tableHeader" },
                                    { text: "Total Harga", style: "tableHeader" },
                                ], 
                                ...itemsData,
                                [
                                    { text: 'TOTAL TAGIHAN', style: "tableHeader" },
                                    { text: "", style: "subheader" },
                                    { text: '', style: "subheader" },
                                    { text: '', style: "subheader" },
                                    { text: convertToRupiah(Number(totalPriceOngkir + totalPrice - (totalPrice * (dataUser?.diskon ? dataUser?.diskon : 0)) / 100)), style: "subheader" },
                                ]
                            ],
                        },
                        layout: {
                            hLineWidth: () => 0.5,
                            vLineWidth: () => 0.5,
                            hLineColor: () => 'gray',
                            vLineColor: () => 'gray',
                        },
                    },
                    { text: '\n\n' },
                    { text: 'Salam,', style: 'ttd', alignment: 'right' },
                    {
                        image: logoTTD,
                        width: 150,
                        alignment: 'right',
                    },
                    { text: `Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, style: 'ttd2', alignment: 'right' },
                    { text: '\n\n' },
                    {
                        text: "Invoice ini sah dan diproses oleh komputer.\nSilakan hubungi PelangiTeknik.com Care apabila kamu membutuhkan bantuan.",
                        style: "footer",
                        margin: [0, 50, 0, 0],
                    },
                ],
                styles: {
                    header: { fontSize: 9, bold: true },
                    textinformasi: { marginBottom: -3, fontSize: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
                    subheader: { fontSize: 9 },
                    atas: { marginTop: 10, fontSize: 9, bold: true },
                    subheaderB: { marginBottom: -3, fontSize: 9, bold: true },
                    tableHeader: { bold: true, fontSize: 9, color: "black" },
                    colorproduct: { bold: true, fontSize: 9, color: '#152f66' },
                    footer: { fontSize: 7, color: "gray" },
                    ttd: { fontSize: 9, bold: true, marginLeft: 70, marginRight: 70 },
                    ttd2: { fontSize: 9, bold: true, marginRight: 30 },
                },
            };

            pdfMake.createPdf(docDefinitionv).download(`NOTA - ${dataUser?.merchantOrderId} - ${dataUser?.nama_lengkap_user}.pdf`);
        }

        toast.promise(
            fetchData(),
            {
                loading: 'Tunggu sebentar, sedang membuat Nota...',
                success: <b>Berhasil didownload</b>,
                error: <b>Gagal, silakan coba lagi</b>,
            }
        );
    }

    const HandleHubungiSales = async (e) => {
        const NumberSales = await GetRandomPhoneNumber()
        const encodedMessage = encodeURIComponent(`Halo ${NumberSales?.name}, saya ingin bertanya mengenai pesanan dengan INVOICE ID: ${e}`);
        const randomPhoneNumber = NumberSales.numberWA;
        const waUrl = `https://wa.me/${randomPhoneNumber}?text=${encodedMessage}`;
        window.open(waUrl, "_blank");
    }

    return (
        <div className={styles.container}>
            <div className={styles.dalamcontainer}>
                {data?.dataPesanan?.length ?
                    <>
                        <div className={styles.atassendiri}>
                            <CustomLink back={'back'}>
                                <div className={styles.kiri}>
                                    <IoChevronBack /> <span>Kembali</span>
                                </div>
                            </CustomLink>
                            <div className={styles.text}>Daftar Pesanan</div>
                        </div>
                        <div className={styles.listorder}>
                            {data?.dataPesanan?.map((dataUtama) => {
                                return dataUtama?.dataPesananItems?.filter(item => item?.note !== "ongkir").map((itemData, i) => (
                                    <div key={i} className={styles.kotak}>
                                        <div className={styles.gambarnote}>
                                            <FaStickyNote size={150} />
                                        </div>
                                        <div className={styles.isinya}>
                                            <div className={styles.atas}>
                                                <div className={styles.gambar}>
                                                    <Image
                                                        src={itemData?.image || 'https://www.pelangiteknik.com/notfoundicon.jpg'}
                                                        fill
                                                        style={{ objectFit: 'cover', borderRadius: 'var(--border-radius)' }}
                                                        alt={itemData?.productName} 
                                                    />
                                                </div>
                                                <div className={styles.textDetail}>
                                                    <div className={styles.judul}>{itemData?.productName}</div>
                                                    <div className={styles.idorder}>#{itemData?.merchantOrderId}</div>
                                                    <div className={styles.tanggalOrder}>
                                                        {new Date(itemData?.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                    {itemData?.status === 'Dikirim' && (
                                                        <div className={styles.resiOrder}>Resi: {itemData?.noResi}</div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className={styles.tengah}>
                                                <div className={styles.qty}>
                                                    <PiCodesandboxLogoDuotone size={18} /> Qty: {itemData?.quantity}
                                                </div>
                                                <div className={styles.status} style={itemData?.status !== "Delivered" ? { background: 'rgba(21, 47, 102, 0.1)', color: 'var(--colorthrid)' } : {}}>
                                                    {itemData?.status ? itemData?.status : 'Belum diproses'}
                                                </div>
                                            </div>

                                            <div className={styles.bawah}>
                                                <div className={styles.hargaWrapper}>
                                                    <div className={styles.harga}>
                                                        {convertToRupiah(Number((itemData?.priceOriginal * itemData.quantity) - (((itemData?.priceOriginal * itemData.quantity) * dataUtama?.diskon) / 100)))}
                                                    </div>
                                                    {dataUtama?.diskon > 0 && (
                                                        <div className={styles.hargaori}>
                                                            {convertToRupiah(Number(itemData?.priceOriginal))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.footernota}>
                                                <button className={styles.btnSecondary} onClick={() => HandleHubungiSales(dataUtama?.merchantOrderId)}>
                                                    Hubungi Sales
                                                </button>
                                                <button className={styles.btnPrimary} onClick={() => router.push('https://' + dataUtama?.nota_url)}>
                                                    Download Nota
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            })}
                        </div>
                    </> :
                    <div className={styles.notfound}>
                        <MdNotes size={80} color="var(--colormain)" />
                        <div className={styles.text}>Belum Ada Pesanan</div>
                        <p className={styles.subtext}>Yuk, mulai belanja dan temukan produk terbaik untukmu!</p>
                        <button onClick={() => router.back()}>Mulai Belanja</button>
                    </div>
                }
            </div>
        </div>
    )
}
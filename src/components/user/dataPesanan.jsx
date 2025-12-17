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
import pdfFonts from 'pdfmake/build/vfs_fonts';
import LogoAtas from '../logo/logoAtas';
import React from 'react'
import TTD from '../logo/ttd';
import { FaStickyNote } from "react-icons/fa";
import GetRandomPhoneNumber from '@/utils/getRandomPhoneNumber';

export default function DataPesanan({ data }) {

    const router = useRouter()
    const logoBase64 = LogoAtas()
    const logoTTD = TTD()
    // { text: `Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, style: 'defaultStyle' },

    const HandleNota = async (e) => {
        const fetchData = async () => {
            const dataNota = await GetNotaPesanan(e)
            const dataUser = dataNota?.data[0]
            const wkkwkw = dataUser.dataPesananItems.map((data) => {
                return (
                    [
                        { text: data.productName, style: "colorproduct" },
                        { text: data.quantity, style: "subheader" },
                        { text: convertToRupiah(Number(data.priceOriginal)), style: "subheader" },
                        { text: data.note == 'ongkir' ? 0 + '%' : dataUser?.diskon ? dataUser?.diskon + '%' : 0 + '%', style: "subheader" },
                        { text: convertToRupiah(Number((data.priceOriginal - ((data.priceOriginal * data.quantity) * dataUser?.diskon) / 100) * data.quantity)), style: "subheader" },
                    ]
                )
            })

            const totalPriceOngkir = dataUser.dataPesananItems.filter(item => item?.note == "ongkir").map((data) => {
                return (
                    data.priceOriginal * data.quantity
                )
            }).reduce((accumulator, currentValue) => accumulator + currentValue, 0)


            const totalPrice = dataUser.dataPesananItems.filter(item => item?.note !== "ongkir").map((data) => {
                return (
                    data.priceOriginal * data.quantity
                )
            }).reduce((accumulator, currentValue) => accumulator + currentValue, 0)

            const totalQuantity = dataUser.dataPesananItems.map((data) => {
                return (
                    data.quantity
                )
            }).reduce((accumulator, currentValue) => accumulator + currentValue, 0)


            const docDefinitionv = {
                content: [
                    {
                        columns: [
                            {
                                image: logoBase64, // Menyisipkan gambar logo
                                width: 220, // Ukuran logo
                                alignment: 'left', // Posisi logo
                            },
                            {
                                stack: [
                                    {
                                        text: "INVOICE",
                                        style: "atasLogo",
                                        alignment: "right",
                                    },
                                    { text: dataUser?.merchantOrderId, style: 'atasLogo', alignment: 'right' },
                                ],
                            }
                        ],
                    },
                    { text: '\n' },
                    { text: '\n' },
                    {
                        columns: [
                            {
                                stack: [
                                    { text: "DITERBITKAN ATAS NAMA", style: "atas" },
                                    { text: "Penjual : PT PELANGI TEKNIK INDONESIA", style: "subheader" },
                                    { text: `Kode    :` + ` ${dataUser?.kode ? dataUser?.kode : 'NOVOUCHER'}`, style: "subheader" }
                                ]
                            },
                            {
                                table: {
                                    widths: [80, "auto", "auto"], // Sesuaikan lebar kolom
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
                                            {
                                                text: `${dataUser?.alamat_lengkap_user}`,
                                                style: "subheaderB"
                                            }
                                        ],
                                        [
                                            { text: "Catatan", style: "textinformasi" },
                                            { text: ":", style: "textinformasi" },
                                            {
                                                text: `${dataUser?.catatan_pengiriman ? dataUser?.catatan_pengiriman : '-'} `,
                                                style: "subheaderB"
                                            }
                                        ],
                                    ],
                                },
                                layout: "noBorders",
                                margin: [0, 5, 0, 15],
                            },
                        ],
                    },
                    { text: '\n' },
                    { text: '\n' },
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
                                ], ...wkkwkw,
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
                            hLineWidth: function (i, node) {
                                return 0.5; // Ketebalan garis horizontal
                            },
                            vLineWidth: function (i, node) {
                                return 0.5; // Ketebalan garis vertikal
                            },
                            hLineColor: function (i, node) {
                                return 'gray'; // Warna garis horizontal
                            },
                            vLineColor: function (i, node) {
                                return 'gray'; // Warna garis vertikal
                            },
                        },
                    },
                    { text: '\n' },
                    { text: '\n' },
                    { text: 'Salam,', style: 'ttd', alignment: 'right' },
                    {
                        image: logoTTD, // Menyisipkan gambar logo
                        width: 150, // Ukuran logo
                        alignment: 'right', // Posisi logo
                        // style: 'gambarlogo'
                    },
                    { text: `Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, style: 'defaultStyle', style: 'ttd2', alignment: 'right' },
                    { text: '\n' },
                    { text: '\n' },
                    {
                        text: "Invoice ini sah dan diproses oleh komputer.\nSilakan hubungi PelangiTeknik.com Care apabila kamu membutuhkan bantuan.",
                        style: "footer",
                        margin: [0, 50, 0, 0],
                    },
                ],
                styles: {
                    header: {
                        fontSize: 9,
                        bold: true,
                    },
                    textinformasi: {
                        marginBottom: -3,
                        fontSize: 9,
                        whiteSpace: "nowrap", // Mencegah teks melompat ke baris baru
                        overflow: "hidden", // Mencegah teks meluber
                        textOverflow: "ellipsis", // Tambahkan "..." jika teks terlalu panjang
                    },
                    subheader: {
                        fontSize: 9,
                    },
                    atas: {
                        marginTop: 10,
                        fontSize: 9,
                        bold: true,
                    },
                    subheaderB: {
                        marginBottom: -3,
                        fontSize: 9,
                        bold: true,
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 9,
                        color: "black",
                    },
                    colorproduct: {
                        bold: true,
                        fontSize: 9,
                        color: '#152f66',
                    },
                    footer: {
                        fontSize: 7,
                        color: "gray",
                    }, ttd: {
                        fontSize: 9,
                        bold: true,
                        marginLeft: 70,
                        marginRight: 70,
                    },
                    ttd2: {
                        fontSize: 9,
                        bold: true,
                        marginRight: 30,
                    },
                },
                background: {
                    text: 'LUNAS', // Tulisan watermark
                    color: '#152f66', // Warna teks
                    opacity: 0.1, // Transparansi teks (0.1 untuk sangat transparan)
                    bold: true, // Membuat teks tebal
                    fontSize: 140, // Ukuran teks besar
                    alignment: 'center', // Posisi teks di tengah horizontal
                    margin: [0, 200, 0, 0] // Posisi vertikal watermark
                },
            };

            pdfMake.createPdf(docDefinitionv).download(`NOTA - ${dataUser?.merchantOrderId} - ${dataUser?.nama_lengkap_user}.pdf`);
        }

        toast.promise(
            fetchData(),
            {
                loading: 'Wait! lagi buatin Nota :)',
                success: <b>Berhasil didownload</b>,
                error: <b>Try again</b>,
            }
        );


    }

    const HandleHubungiSales = async (e) => {
        const NumberSales = await GetRandomPhoneNumber()
        console.log(NumberSales);
        const encodedMessage = encodeURIComponent(
            `Halo ${NumberSales?.name}, saya informasi INVOICE ID :${e}`
        );
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
                                    <IoChevronBack />Back
                                </div>
                            </CustomLink>
                            {/* <div className={styles.kanan} onClick={handleSignOut} >Sign Out<PiSignOut /></div> */}
                            <div className={styles.text}>
                                Orderan
                            </div>
                        </div>
                        <div className={styles.listorder}>
                            {data?.dataPesanan?.map((dataUtama) => {
                                return (
                                    dataUtama?.dataPesananItems?.filter(item => item?.note !== "ongkir").map((data, i) => {
                                        return (
                                            <>
                                                <div key={i} className={styles.kotak} >
                                                    <div className={styles.gambarnote}>
                                                        <FaStickyNote size={200} />
                                                    </div>
                                                    <div className={styles.isinya}>
                                                        <div className={styles.atas}>
                                                            <div className={styles.gambar}>
                                                                <Image
                                                                    src={data?.image || 'https://www.pelangiteknik.com/notfoundicon.jpg'}
                                                                    height={100}
                                                                    width={100}
                                                                    alt={data?.productName} />
                                                            </div>
                                                            <div className={styles.text}>
                                                                <div className={styles.judul}>{data?.productName}</div>
                                                                <div className={styles.idorder}>#{data?.merchantOrderId} </div>
                                                                <div className={styles.idorder}>{new Date(data?.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                                                <div className={styles.idorder}>   {data?.status == 'Dikirim' && 'nomerResi: ' + ' ' + data?.noResi} </div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.bawah}>
                                                            <div className={styles.kiri}>
                                                                <PiCodesandboxLogoDuotone /> &nbsp; Qty: {data?.quantity}
                                                            </div>
                                                            <div className={styles.kanan}>
                                                                <div className={styles.status} style={data?.status != "Delivered" ? { background: 'var(  --colorsekunder)', color: 'var(--colorthrid)' } : {}}>
                                                                    {data?.status ? data?.status : 'Belum di proses'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.bawah}>
                                                            <div className={styles.kiri}>
                                                                <div className={styles.harga}>
                                                                    {convertToRupiah(Number((data?.priceOriginal * data.quantity) - (((data?.priceOriginal * data.quantity) * dataUtama?.diskon) / 100)))}
                                                                </div>
                                                            </div>
                                                            <div className={styles.kanan}>
                                                                <div className={styles.hargaori}>
                                                                    {convertToRupiah(Number((data?.priceOriginal) - (((data?.priceOriginal) * dataUtama?.diskon) / 100)))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={styles.footernota}>
                                                        <div className={styles.lacakResi} onClick={() => HandleHubungiSales(dataUtama?.merchantOrderId)}>Hubungi Sales</div>
                                                        <div className={styles.downloadNota} onClick={() => router.push('https://' + dataUtama?.nota_url)}>Download Nota</div>
                                                        {/* <div className={styles.downloadNota} onClick={() => HandleNota(data?.merchantOrderId)}>Download Nota</div> */}
                                                    </div>

                                                </div>
                                            </>
                                        )
                                    }))
                            })}
                        </div>
                    </> :
                    <div className={styles.notfound}>
                        <MdNotes size={70} />
                        <div className={styles.text}>Belum Melakukan Pembelian</div>
                        <button onClick={() => router.back()}>Kembali</button>
                    </div>
                }
            </div>
        </div>
    )
}

import { prisma } from "@/lib/prisma"
import CryptoJS from 'crypto-js';

export async function AmbilDataUsers(nota_user) {
    //UPDATE KONDISI PEMBYARAN
    const updateData = await prisma.dataPesanan.update({
        where: {
            merchantOrderId: nota_user,
        },
        data: {
            payment: true
        }
    })

    // //AMBIL ID USER
    // const data = await prisma.dataPesanan.findUnique({
    //     where: {
    //         merchantOrderId: nota_user, // Mengambil keranjang milik user tertentu
    //     }
    // });

    // //AMBIL BARANG YG SUDAH TERBAYAR
    // const IDCart = await prisma.cart.findMany({
    //     where: {
    //         IDCart: data?.cartID, // Mengambil keranjang milik user tertentu
    //     }, include: {
    //         cartItem: true
    //     }
    // });

    // // // AMBIL ID ITEM KARANJANG
    // const idItems = IDCart[0].cartItem.map((data) => data.id)

    // // HAPUS KERANJANG
    // const dataKu = await prisma.cartItem.deleteMany({
    //     where: {
    //         checkList: true,
    //         id: {
    //             in: idItems, // Hapus item yang ID-nya ada di dalam array ini
    //         },
    //         cartId: data?.cartID, // Pastikan item tersebut milik keranjang tertentu
    //     },
    // });
    // return { ...updateData, ...dataKu }

    return updateData
}


export async function POST(req, res) {
    const data = await req.formData()
    const merchantCode = data.get('merchantCode')
    const merchantOrderId = data.get('merchantOrderId')
    const amount = data.get('amount')
    const signature = data.get('signature')
    // const signature = '0b469027ddb93d03589693029089a13a'

    const params = merchantCode + Number(amount) + merchantOrderId + process.env.SERVER_KEYDUITKU;
    const calcSignature = CryptoJS.MD5(params).toString();
    // 0b469027ddb93d03589693029089a13a
    // console.log(calcSignature);

    if (signature == calcSignature) {
        const data = await AmbilDataUsers(merchantOrderId)
        return Response.json({ data })
    } else {
        return Response.json({ error: 'Bad Signature' });
    }

}
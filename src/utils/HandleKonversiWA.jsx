import { sendGAEventL } from '@/lib/ga';
import { sendGTMEventt } from '@/lib/gtm';
import { HandleNotifikasiPerson, HandleNotifikasiWA } from '@/service/handleNotifikasiWA';
import { GetNumberSalesWA } from '@/controllers/userClient';
import TanggalGA from '@/utils/TanggalGA';
import { Unslugify } from './unSlugify';

export default async function HandleKonversiWA({ productDetail, fromDataVoucher, Header }) {
    const NumberSales = await GetNumberSalesWA();
    const now = new Date();

    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const tanggal = now.toLocaleDateString('id-ID', options);
    const jam = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0');

    const tanggalJam = `${tanggal}, jam ${jam}`;
    const Tanggal = TanggalGA();
    const url = `${process.env.NEXT_PUBLIC_URL}/product/${productDetail?.slugProduct}`;

    const pesanWA = `==| ${tanggalJam} |==

*Hallo ${NumberSales?.name}*
_info_: 
${productDetail && `- ada custumer butuh bantuan lebih lanjut mengenai product: **${productDetail.productName}**` || fromDataVoucher && `- ada yang butuh bantuan mengenai *voucher/diskon* dari website pelangiteknik.com` || Header && `- ada custumer butuh bantuan lebih lanjut mengenai produk *${Header.q ? Unslugify(Header.q) : 'Pelangi Teknik'}*`}
${productDetail && `- Link: ${url}` || Header && `- Link: ${process.env.NEXT_PUBLIC_URL}${Header?.pathName}${Header.q ? `?q=${Header.q}` : ''}` || ''}
`;

    const { trackEvent } = await import('@/utils/facebookPixel');
    if (true) {

        trackEvent("Contact", {
            method: "WhatsApp",
            currency: "IDR",
            value: 0,
            content_name: `WA ${NumberSales?.name} - ${NumberSales?.numberForm}`
        });

        sendGTMEventt({
            event: 'whatsapp_click_googleAds',
            value: NumberSales?.numberForm || ''
        });

        sendGAEventL("whatsapp_click",
            productDetail && {
                whatsapp_chat: `${Tanggal},${NumberSales?.name},${productDetail?.productName},${url}`,
                sales_name: NumberSales?.name,
                sales_number: NumberSales?.numberForm,
                product_name: productDetail?.productName,
                product_category: `${productDetail?.user?.categoryProductUtama?.category} - ${productDetail?.user?.category}`,
                product_value: Number(productDetail?.productPriceFinal),
                product_link: url,
            } || fromDataVoucher && {
                whatsapp_chat: `${Tanggal},${NumberSales?.name},Voucher/Diskon,Pelangiteknik.com`,
                sales_name: NumberSales?.name,
                sales_number: NumberSales?.numberForm,
                product_name: 'Voucher/Diskon',
                product_category: 'Voucher/Diskon',
                product_value: Number(0),
                product_link: url,
            } || Header && {
                whatsapp_chat: Tanggal + ',' + NumberSales?.name + ',' + document.title + ',' + `${process.env.NEXT_PUBLIC_URL}${Header?.pathName}`,
                sales_name: NumberSales?.name,
                sales_number: NumberSales?.numberForm,
                product_name: document.title,
                product_category: document.title,
                product_value: Number(0),
                product_link: `${process.env.NEXT_PUBLIC_URL}${Header?.pathName}`,
            });

        //DETAIL PRODUCT
        // !Header && await HandleNotifikasiWA('120363413748951043@g.us', pesanWA);
        // !Header && await HandleNotifikasiPerson(`${NumberSales?.numberWA?.replace("+", "")}@c.us`,
        //     '🚀 GRUP REPORT'
        // );

        //BAGIAN HEADER
        // Header && Header?.pathName !== '/' && await HandleNotifikasiWA('120363413748951043@g.us', pesanWA)
        // Header && Header?.pathName !== '/' && await HandleNotifikasiPerson(`${NumberSales?.numberWA?.replace("+", "")}@c.us`, "🚀 GRUP REPORT")

        //BAGIAN HEADER && VOUCHER
        // fromDataVoucher && await HandleNotifikasiWA('120363413748951043@g.us', pesanWA)
        // fromDataVoucher && await HandleNotifikasiPerson(`${NumberSales?.numberWA?.replace("+", "")}@c.us`, "🚀 GRUP REPORT MINTA VOUCHER")
    }


    const encodedMessage = productDetail && encodeURIComponent(
        `Halo ${NumberSales?.name}, saya butuh bantuan lebih lanjut mengenai product dan diskon 3%nya: ${productDetail.productName}

        Link: ${url}`
    ) || fromDataVoucher && encodeURIComponent(
        `Halo ${NumberSales?.name}, saya butuh bantuan mengenai voucher/diskon dari website pelangiteknik.com`
    ) || Header && encodeURIComponent(
        `Halo ${NumberSales?.name}, saya butuh bantuan lebih lanjut mengenai produk dan diskon 3%nya: ${Header.q ? Unslugify(Header.q) : 'Pelangi Teknik'}

        Link: ${process.env.NEXT_PUBLIC_URL}${Header?.pathName}${Header.q ? `?q=${Header.q}` : ''}`
    );

    const randomPhoneNumber = NumberSales.numberWA;
    const waUrl = `https://wa.me/${randomPhoneNumber}?text=${encodedMessage}`;

    return waUrl;
}

'use server'
export default async function HandleInvoicePaperID(e) {

    // Buat tanggal hari ini
    const today = new Date();
    // Buat due date (1 hari setelah invoice date)
    const due = new Date(today);
    due.setDate(today.getDate() + 7);

    // Format DD-MM-YYYY untuk invoice_date dan due_date
    const formatDate = (date) =>
        date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');

    const invoiceDate = formatDate(today);
    const dueDate = formatDate(due);

    // Format "Mei 28, 2025" untuk signature_text_header
    const signatureHeader = today.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
    });
    // const resPartner = await fetch(`${process.env.SERVER_URLPAPERIDPARTNERID}`, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'client_id': `${process.env.SERVER_CLIENTID_PAPERID_DEMO}`,
    //         'client_secret': `${process.env.SERVER_SECRETID_PAPERID_DEMO}`
    //     },
    //     body: JSON.stringify({
    //         type: 'both',
    //         number: e.order_id,
    //         phone: e.phone,
    //         name: e.first_name,
    //         id: e.email
    //     })
    // });


    const resInvoice = await fetch(`${process.env.SERVER_URLPAPERID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'client_id': `${process.env.SERVER_CLIENTID_PAPERID}`,
            'client_secret': `${process.env.SERVER_SECRETID_PAPERID}`
        },
        body: JSON.stringify({
            invoice_date: invoiceDate,
            due_date: dueDate,
            number: e?.order_id,
            customer: {
                id: e?.order_id,
                name: e?.first_name,
                email: e?.email,
                phone: e?.phone
            },
            items: e?.item_details,
            additional_fee: {
                delivery_fee: e.delivery_fee
            },
            signature_text_header: signatureHeader,
            signature_text_footer: "PT Pelangi Teknik Indonesia",
            terms_condition: "Garansi servis 1 tahun. Garansi sparepart 1 tahun diberikan untuk mesin selama 12 bulan atau 2000 jam operasi genset yang mana terlebih dahulu tercapai ( yang disebabkan factory fault / kesalahan pabrik). Untuk electrical part tidak ada garansi seperti AVR, Module AMF dan COS Motorised.",
            notes: e?.catatan,
            send: {
                email: true,
                whatsapp: true,
                sms: true
            },
            additional_info: {},
            additional_discount: e?.additional_discount,
        })
    });

    // const dataPartner = await resPartner.json();
    const dataInvoice = await resInvoice.json();
    // console.log({ dataPartner, dataInvoice });
    return dataInvoice
}
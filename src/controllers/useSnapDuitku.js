'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'nextjs-toploader/app';

const useSnapDuitku = () => {
    const router = useRouter()
    const [snap, setSnap] = useState(null)

    useEffect(() => {
        // Buat elemen script
        const script = document.createElement('script');
        script.src = process.env.NEXT_PUBLIC_LINKSCRIPTDUITKU
        script.async = true;

        // Tambahkan script ke dalam body
        document.body.appendChild(script);

        // Bersihkan script ketika komponen dibongkar
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const snapEmbedDuitku = (snap_token, kondisi) => {

        if (kondisi) {
            checkout.process(snap_token?.reference, {
                defaultLanguage: "id", //opsional pengaturan bahasa
                successEvent: function (result) {
                    // tambahkan fungsi sesuai kebutuhan anda
                    console.log('success');
                    console.log(result);
                    alert('Payment Success');
                },
                pendingEvent: function (result) {
                    // tambahkan fungsi sesuai kebutuhan anda
                    console.log('pending');
                    console.log(result);
                    alert('Payment Pending');
                },
                errorEvent: function (result) {
                    // tambahkan fungsi sesuai kebutuhan anda
                    console.log('error');
                    console.log(result);
                    alert('Payment Error');
                },
                closeEvent: function (result) {
                    // tambahkan fungsi sesuai kebutuhan anda
                    console.log('customer closed the popup without finishing the payment');
                    console.log(result);
                    alert('customer closed the popup without finishing the payment');
                }
            });
        } else {
            router.push(snap_token.paymentUrl);
        }
    }

    return { snapEmbedDuitku }
}

export default useSnapDuitku;
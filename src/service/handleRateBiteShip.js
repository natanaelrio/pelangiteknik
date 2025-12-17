'use server'

export default async function HandleRateBitship(e, items) {
    try {
        const resRateBitship = await fetch(`${process.env.SERVER_BITESHIP_COURIERRATE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.SERVER_BITESHIP}`,
            },
            body: JSON.stringify({
                origin_postal_code: 15148,
                destination_postal_code: e.kodePosUser,
                couriers: 'jne',
                items: items,
            }),
            cache: 'no-store',
        });

        // Jika response gagal
        if (!resRateBitship.ok) {
            const errText = await resRateBitship.text();
            throw new Error(`Gagal ambil data rate Biteship: ${resRateBitship.status} - ${errText}`);
        }

        const dataRate = await resRateBitship.json();

        // Pastikan struktur data sesuai ekspektasi
        if (!dataRate || typeof dataRate !== 'object') {
            throw new Error('Data rate Biteship tidak valid atau kosong');
        }

        return dataRate;
    } catch (error) {
        console.error('❌ Error HandleRateBitship:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat mengambil data ongkir dari Biteship.',
            error: error.message,
        };
    }
}

'use server'

export async function HandleNotifikasiWA(groupId, message) {
    try {
        const payload = {
            groupId,
            message
        };

        const resRateBitship = await fetch(`https://wa.pelangiteknik.com/send-group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`,
            },
            body: JSON.stringify(payload),
            cache: 'no-store',
        });

        // Parse responsenya (kalau server balikin JSON)
        const result = await resRateBitship.json();
        return result;
    } catch (error) {
        console.error('❌ Error HandleRateBitship:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat mengirim pesan ke grup WhatsApp.',
            error: error.message,
        };
    }
}


export async function HandleNotifikasiPerson(contactId, message) {
    try {
        const payload = {
            contactId,
            message
        };

        const resRateBitship = await fetch(`https://wa.pelangiteknik.com/send-person`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`,
            },
            body: JSON.stringify(payload),
            cache: 'no-store',
        });

        // Parse responsenya (kalau server balikin JSON)
        const result = await resRateBitship.json();
        return result;
    } catch (error) {
        console.error('❌ Error HandleRateBitship:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat mengirim pesan ke grup WhatsApp.',
            error: error.message,
        };
    }
}

export default function TanggalGA() {
    const date = new Date();

    const tanggal = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const waktu = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // supaya format 24 jam
    });

    const hasil = `${tanggal}, ${waktu.replace('.', ':')}`;
    return hasil
}

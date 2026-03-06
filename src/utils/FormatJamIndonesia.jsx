export function FormatJamIndonesia(date) {
    const hari = [
        "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
    ];

    const bulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const d = new Date(date);

    const namaHari = hari[d.getDay()];
    const tanggal = String(d.getDate()).padStart(2, "0");
    const namaBulan = bulan[d.getMonth()];
    const tahun = d.getFullYear();
    const jam = String(d.getHours()).padStart(2, "0");
    const menit = String(d.getMinutes()).padStart(2, "0");

    return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}, ${jam}:${menit}`;
}
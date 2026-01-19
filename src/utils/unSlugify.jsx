export function Unslugify(input) {
    if (!input && input !== 0) return '';

    return String(input)
        // Hilangkan karakter aneh selain huruf, angka, dan tanda hubung
        .replace(/[^a-z0-9-]/gi, ' ')
        // Ganti tanda hubung atau underscore jadi spasi
        .replace(/[-_]+/g, ' ')
        // Hilangkan spasi berlebih
        .trim()
        // Kapital di setiap kata
        .replace(/\b\w/g, (char) => char.toUpperCase())
        // Ubah semua variasi 'kva' (huruf besar/kecil campur) menjadi 'KVA'
        .replace(/\bkva\b/gi, 'KVA');
}

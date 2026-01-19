export function Unslugify(input) {
    if (!input && input !== 0) return '';

    return String(input)
        // Izinkan huruf, angka, spasi, dan tanda hubung
        .replace(/[^a-z0-9-\s]/gi, ' ')
        // Rapikan spasi berlebih (tanpa menghilangkan "-")
        .replace(/\s+/g, ' ')
        .trim()
        // Kapital di setiap kata (tetap aman untuk kata ber-strip)
        .replace(/\b\w/g, (char) => char.toUpperCase())
        // Standarkan KVA
        .replace(/\bKva\b|\bkva\b|\bKvA\b|\bKV A\b/gi, 'KVA');
}

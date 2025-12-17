const convertToRupiah = (number) => {
    return number?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }).replace(',00', '');;
}

export default convertToRupiah;
'use client'

import styles from '@/components/user/cart.module.css'
import { FiTrash2 } from "react-icons/fi";
import { useStore } from "@/zustand/zustand";
import convertToRupiah from "@/utils/ConvertRupiah";
import Image from 'next/image';
import { DeleteCart, GetVoucher, UpdateCount, UpdateVoucher } from '@/controllers/cart';
import { BeatLoader } from 'react-spinners'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'nextjs-toploader/app';
import Link from 'next/link';
import { RiShoppingCartLine } from "react-icons/ri";
import { useSession, signOut } from 'next-auth/react';
import { GetNumberSalesWA } from '@/controllers/userClient';
import { FaCartPlus } from "react-icons/fa6";

export default function Carts({ data }) {
  const router = useRouter()
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signOut({ callbackUrl: '/' }); // Mengarahkan pengguna ke halaman utama setelah logout
    }
  }, [status]);

  const setOpenFormData = useStore((state) => state.setOpenFormData)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const isLoading = useStore((state) => state.isLoading)
  const prices = data?.items.map(item => parseInt(item.product.productPriceFinal * item.quantity, 10));
  const totalPrice = prices?.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const [idLoading, setIdLoading] = useState(null)

  const HandleKurang = async (id) => {
    if (data.items.filter((item) => item.id == id)[0].quantity == 1) {
      return toast('Stock Minimal', {
        icon: '👏',
      });
    }
    try {
      const fetchData = async () => await UpdateCount({
        "cartItemId": id,
        "QUANTITY": data.items.filter((item) => item.id == id)[0].quantity - 1
      })
      toast.promise(
        fetchData(),
        {
          loading: 'Wait!',
          success: <b>Berhasil diupdate!</b>,
          error: <b>Try again</b>,
        }
      );
    } catch (e) {
      console.log(e)
      toast.error('This is an error!');
      setIsLoading()
    }

  }
  const HandleTambah = async (id, stock) => {

    if (data.items.filter((item) => item.id == id)[0].quantity == stock) {
      return toast('Stock maximal!', {
        icon: '👏',
      });
    }

    try {
      const fetchData = async () => await UpdateCount({
        "cartItemId": id,
        "QUANTITY": data.items.filter((item) => item.id == id)[0].quantity + 1
      })
      toast.promise(
        fetchData(),
        {
          loading: 'Wait!',
          success: <b>Berhasil diupdate!</b>,
          error: <b>Try again</b>,
        }
      );
    } catch (e) {
      console.log(e)
      toast.error('This is an error!');
      setIsLoading()
    }
  }
  const HandleHapus = async (id) => {
    if (confirm('Apakah ingin hapus produk dari keranjang ?')) {
      try {
        const fetchData = async () => await DeleteCart({
          "cartItemId": id
        })
        toast.promise(
          fetchData(),
          {
            loading: 'Wait!',
            success: <b>Berhasil dihapus!</b>,
            error: <b>Try again</b>,
          }
        );
      } catch (e) {
        console.log(e)
        toast.error('This is an error!');
      }

    } else {
      console.log('Produk tidak dihapus');
    }
  }


  const handleWhatsapp = async () => {
    const phoneNumbers = await GetNumberSalesWA()
    const encodedMessage = encodeURIComponent(`Halo, saya ingin VOUCHER GRATIS pelangiteknik`);
    const randomPhoneNumber = phoneNumbers.numberWA;
    const waUrl = `https://wa.me/${randomPhoneNumber}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
    // router.push(`https://wa.me/${randomPhoneNumber}?text=${encodedMessage}`);
  };


  return (
    <div className={styles.container}>
      <div className={styles.dalamcontainer}>
        {data?.items.length ?
          <>
            <div className={styles.judul}>
              Daftar Keranjang
            </div>
            <div className={styles.content}>
              <div className={styles.kiri}>
                {data?.items.map((data, i) => {
                  return (
                    <div key={i} className={styles.product}>
                      <div className={styles.kiriproduct}>
                        <div className={styles.gambar}>
                          <Image src={data?.product?.imageProductUtama?.secure_url} width={100} height={100} alt={data?.product?.imageProductUtama?.secure_url} />
                        </div>
                      </div>
                      <div className={styles.kananproduct}>
                        <div className={styles.text} onClick={() => router.push(`${process.env.NEXT_PUBLIC_URL}/product/${data.product.slugProduct}`)}>
                          <div className={styles.judulproduct}>{data?.product.productName}</div>
                          <div className={styles.harga}>{convertToRupiah(Number(data?.product.productPriceFinal))} {Boolean(data?.product?.productDiscount) && <span style={{ textDecoration: 'line-through', color: 'grey' }}> {convertToRupiah(Number(data?.product.productPrice))}</span>}</div>
                        </div>
                        <div className={styles.text2}>
                          {idLoading == data?.id && isLoading ? <BeatLoader /> :
                            <>
                              <div className={styles.count}>
                                <button onClick={() => HandleKurang(data?.id)}>-</button>
                                <div className={styles.angka}>{data?.quantity}</div>
                                <button onClick={() => HandleTambah(data?.id, data?.product?.stockProduct)}>+</button>
                              </div>
                              <div className={styles.sampah} onClick={() => HandleHapus(data?.id)}>
                                <FiTrash2 />
                              </div>
                            </>
                          }
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className={styles.tambahproduct} onClick={() => router.push('/product')}>
                  <FaCartPlus size={30} />  Tambahkan Product
                </div>


              </div>
              <div className={styles.kanan}>

                {/* <div className={styles.dalamkanan} style={{ cursor: 'pointer' }} onClick={setOpenFormData}>
              <div className={styles.judulringkasan}>Pesanan di kirim</div>
              <div className={styles.namapengiriman}>
                di kirim ke Natanael Rio Wijaya
              </div>
              <div className={styles.alamatpengiriman}>Jalan Raya No. 45, Kelurahan Cibubur, Kecamatan Ciracas, Jakarta Timur, 13720, Indonesia</div>
              <div className={styles.edit}>edit</div>
            </div> */}



                <div className={styles.dalamkanan}>
                  <div className={styles.judulringkasan}>Ringkasan Pesanan</div>
                  <div className={styles.subjudul}>
                    <div className={styles.textkiri}>Subtotal</div>
                    <div className={styles.textkanan}>{convertToRupiah(totalPrice)}</div>
                  </div>
                  {/* <div className={styles.subjudul}>
                    <div className={styles.textkiri}>Diskon</div>
                  </div> */}

                  {/* <div className={styles.subjudul}>
                <div className={styles.textkiri}>Pengiriman</div>
                <div className={styles.textkanan} style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={setOpenFormData}>cek disini</div>
              </div> */}

                  <div className={styles.total}>
                    <div className={styles.texttotal}>Total</div>
                    {convertToRupiah(totalPrice)}
                  </div>

                  <Link href={`/cart/${data.IDCart}`}>
                    <button>
                      Proses untuk checkout
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          </>
          :
          <div className={styles.notfound}>
            <RiShoppingCartLine size={70} />
            <div className={styles.text}>Tidak ada Keranjang</div>
            <button onClick={() => router.back()}>Kembali</button>
          </div>
        }
      </div>
    </div>
  )
}

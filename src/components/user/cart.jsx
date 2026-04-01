'use client'

import styles from '@/components/user/cart.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'
import { FaCartPlus } from 'react-icons/fa6'

import { useStore } from '@/zustand/zustand'
import convertToRupiah from '@/utils/ConvertRupiah'
import { DeleteCart, UpdateCount } from '@/controllers/cart'

export default function Carts({ data }) {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      signOut({ callbackUrl: '/' })
    }
  }, [status])

  const setIsLoading = useStore((state) => state.setIsLoading)
  const isLoading = useStore((state) => state.isLoading)

  const prices = data?.items?.map(item => parseInt(item.product.productPriceFinal * item.quantity, 10)) || []
  const totalPrice = prices?.reduce((acc, val) => acc + val, 0) || 0
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
    if (!confirm('Apakah ingin hapus produk dari keranjang?')) return
    try {
      const fetchData = async () => await DeleteCart({ cartItemId: id })
      toast.promise(fetchData(), {
        loading: 'Wait!',
        success: <b>Berhasil dihapus!</b>,
        error: <b>Try again</b>,
      })
    } catch (e) {
      toast.error('This is an error!')
    }
  }

  if (!data?.items?.length) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FaCartPlus size={64} />
          </div>
          <h2 className={styles.emptyTitle}>Keranjang Kosong</h2>
          <p className={styles.emptyText}>Belum ada produk di keranjang belanja kamu</p>
          <button className={styles.emptyBtn} onClick={() => router.push('/product')}>
            Mulai Belanja
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Keranjang Belanja</h1>
        <span className={styles.itemCount}>{data.items.length} produk</span>
      </div>

      <div className={styles.content}>
        <div className={styles.productList}>
          {data.items.map((item, i) => (
            <div key={i} className={styles.productCard}>
              <div className={styles.productImage}>
                <Image
                  src={item.product.imageProductUtama?.secure_url || '/notfound.jpg'}
                  width={120}
                  height={120}
                  alt={item.product.productName}
                />
              </div>

              <div className={styles.productInfo}>
                <h3
                  className={styles.productName}
                  onClick={() => router.push('/product/' + item.product.slugProduct)}
                >
                  {item.product.productName}
                </h3>

                <div className={styles.productPrice}>
                  <span className={styles.currentPrice}>
                    {convertToRupiah(Number(item.product.productPriceFinal))}
                  </span>
                  {Boolean(item.product.productDiscount) && (
                    <span className={styles.originalPrice}>
                      {convertToRupiah(Number(item.product.productPrice))}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.productActions}>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => HandleKurang(item.id)}
                    disabled={item.quantity <= 1 || idLoading === item.id}
                  >

                    <FiMinus size={16} />
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => HandleTambah(item.id, item.product.stockProduct)}
                    disabled={item.quantity >= item.product.stockProduct || idLoading === item.id}
                  >
                    <FiPlus size={16} />
                  </button>
                </div>

                <button
                  className={styles.deleteBtn}
                  onClick={() => HandleHapus(item.id)}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              <div className={styles.subtotal}>
                <span className={styles.subtotalLabel}>Subtotal</span>
                <span className={styles.subtotalValue}>
                  {convertToRupiah(Number(item.product.productPriceFinal * item.quantity))}
                </span>
              </div>
            </div>
          ))}

          <button className={styles.addProductBtn} onClick={() => router.push('/product')}>
            <FaCartPlus size={20} />
            Tambahkan Produk Lain
          </button>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Ringkasan Pesanan</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({data.items.length} produk)</span>
                <span>{convertToRupiah(totalPrice)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Diskon</span>
                <span className={styles.discount}>- Rp 0</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Voucher</span>
                <span className={styles.shipping}>Dihitung saat checkout</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Pengiriman</span>
                <span className={styles.shipping}>Dihitung saat checkout</span>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span className={styles.totalValue}>{convertToRupiah(totalPrice)}</span>
            </div>

            <Link href={'/cart/' + data.IDCart} className={styles.checkoutBtn}>
              Proses Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

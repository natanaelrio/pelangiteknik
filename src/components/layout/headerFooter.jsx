'use client'

import Footer from "@/components/footer";
import Header from "@/components/header";
import styles from "@/components/layout/headerFooter.module.css"
import FormData from "@/components/formData";
import { useStore } from "@/zustand/zustand";
import LoginGoogle from "@/components/loginGoogle";
import Penawaran from "@/components/Penawaran";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function HeaderFooter({ children, data, ListSearch }) {
  const openFormData = useStore((state) => state.openFormData)
  const isLogin = useStore((state) => state.isLogin)
  const isPenawaran = useStore((state) => state.isPenawaran)
  const DataPenawaran = useStore((state) => state.DataPenawaran)
  const pathname = usePathname()
  const whatsapp =
    // (pathname !== "/product" && pathname.startsWith("/product/")) ||
    pathname.startsWith("/cart/") ||  pathname.startsWith("/cart")
  return (
    <>
      <main className={styles.container} >
        <Suspense fallback={<div>Loading header...</div>}>
          <Header
            data={data}
            tombolwa={!whatsapp}
            ListSearch={ListSearch}
          />
        </Suspense>
        <div className={styles.main}>
          {children}
        </div>
        <Footer data={data} />
        {isLogin && <LoginGoogle />}
        {isPenawaran && <Penawaran data={DataPenawaran} />}
      </main>
      {openFormData && <FormData />}
    </>
  )
}

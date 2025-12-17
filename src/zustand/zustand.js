import { create } from 'zustand'

export const useStore = create((set) => ({
    searchTerm: '',
    setSearchTerm: (e) => set(() => ({ searchTerm: e })),

    searchTermClose: false,
    setSearchTermClose: () => set((state) => ({ searchTermClose: !state.searchTermClose })),

    productMelayangHeader: false,
    setProductMelayangHeader: (e) => set((state) => ({ productMelayangHeader: e })),

    isIntersecting: false,
    setIsIntersecting: (e) => set(() => ({ isIntersecting: e })),

    openFormData: false,
    setOpenFormData: () => set((state) => ({ openFormData: !state.openFormData })),

    isLoading: false,
    setIsLoading: (e) => set((state) => ({ isLoading: e ? e : !state.isLoading })),

    isShare: false,
    setIsShare: (e) => set((state) => ({ isShare: e ? e : !state.isShare })),

    isLogin: false,
    setIsLogin: (e) => set((state) => ({ isLogin: e ? e : !state.isLogin })),

    isPenawaran: false,
    setIsPenawaran: (e) => set((state) => ({ isPenawaran: e ? e : !state.isPenawaran })),

    DataPenawaran: {},
    setDataPenawaran: (e) => set((state) => ({ DataPenawaran: e })),

    isLoadingWA: false,
    setIsLoadingWA: (e) => set((state) => ({ isLoadingWA: e })),

    isMobileMenuOpenPencarian: false,
    setIsMobileMenuOpenPencarian: (e) => set((state) => ({ isMobileMenuOpenPencarian: e })),
}))


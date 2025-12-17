export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-N8N4T4Z8";

// Fungsi kirim event manual ke dataLayer
export const sendGTMEventt = (eventData) => {
    if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(eventData);
    }
};
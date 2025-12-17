'use client'
export const initFacebookPixel = async (pixelId) => {
    if (typeof window !== 'undefined') {
        const ReactPixel = (await import('react-facebook-pixel')).default;
        ReactPixel.init(Number(process.env.NEXT_PUBLIC_PIXELFB));
        // ReactPixel.pageView();
    }
};

export const trackEvent = async (event, data) => {
    if (typeof window !== 'undefined') {
        const ReactPixel = (await import('react-facebook-pixel')).default;
        ReactPixel.init(Number(process.env.NEXT_PUBLIC_PIXELFB));
        ReactPixel.trackCustom(event, data);
    }
};

export const trackPageView = async () => {
    if (typeof window !== 'undefined') {
        const ReactPixel = (await import('react-facebook-pixel')).default;
        ReactPixel.init(Number(process.env.NEXT_PUBLIC_PIXELFB));
        ReactPixel.pageView();
    }
};
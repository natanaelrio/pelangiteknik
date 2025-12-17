import { useState, useEffect } from 'react';

export default function Limited() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // tiap 10 detik, toggle show
        const interval = setInterval(() => {
            setShow((prev) => !prev);
        }, 30000); // 30 detik

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`limitedOverlay ${show ? 'fadeIn' : 'fadeOut'}`}>
            <span className="limitedText">
                <div>
                    Access
                </div>
                <div>
                    Limited
                </div>
            </span>
        </div>
    )
}


"use client";
import { CldImage } from 'next-cloudinary';

export const ContentWithWatermark = () => {
    return (
        <div style={{ background: 'red', width: 'fit-content', display: 'flex', justifyContent: 'center' }}>
            <CldImage
                // src="zwclji2vhwmmmgdmgan7" // Use this sample image or upload your own via the Media Explorer
                src="obgnjd1mewzmiwnw6ron" // Use this sample image or upload your own via the Media Explorer
                alt="Description of my image"
                width="1080" // Transform the image: auto-crop to square aspect_ratio
                height="1080"
                overlays={[{
                    publicId: "watermark/watermark_pelangiteknik",
                    position: {
                        x: 0,
                        y: 0,
                        // gravity: 'center',
                    },
                    effects: [
                        {
                            crop: 'fill',
                            gravity: 'auto',
                            width: 1080,
                            height: 1080
                        }
                    ]
                }]}
                crop={'auto'}
            // crop={{
            //     type: 'auto',
            //     source: true
            // }}
            />
        </div>
    );
}
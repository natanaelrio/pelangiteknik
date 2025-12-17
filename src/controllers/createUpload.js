'use server'
import { v2 as cloudinary } from 'cloudinary';

export async function CreateUpload(file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            tags: ['nextjs-server-actions-upload-sneakers'],
            upload_preset: 'nknvbv7x'
        }, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            console.log(result);

            resolve(result);
        })
            .end(buffer);
    });

}
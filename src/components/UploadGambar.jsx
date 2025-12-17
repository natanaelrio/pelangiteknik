'use client'
import { revalidatePath } from 'next/cache';
import { CreateUpload } from '@/controllers/createUpload';
import { useState } from 'react';

export default function UploadGambar() {

    async function create(formData) {
        const file = formData.get('image');
        await CreateUpload(file)
    }

    const [files, setFiles] = useState([])
    const UploadGambar = async (event) => {
        event.preventDefault()
        const file = event.target.files[0];
        setFiles(file)

        // revalidatePath('/')
    }

    const handleSumbit = async (e) => {
        e.preventDefault()
        await CreateUpload(files)
    }


    return (
        <>
            <form onSubmit={handleSumbit} >
                <h2 >Add a New Image</h2>
                <p >
                    <label htmlFor="image" >
                        Select an Image to Upload
                    </label>
                    <input
                        onChange={UploadGambar}
                        id="image"
                        type="file"
                        name="image"
                        required
                        multiple
                    />
                </p>
                <button
                    onClick={handleSumbit}
                    type="submit"
                    style={{
                        padding: '0 18px',
                        height: '40px',
                        background: 'var(--colormain)',
                        width: 'fitContent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: ' var(--colorsekunder)',
                        cursor: "pointer",
                    }}
                >CEKKKKKKKKKKKK</button>
            </form>
        </>
    )
}

import { useState, useEffect } from "react";


export default function useImgUrl(thumbnail) {
    const [imgUrl, setImgUrl] = useState(null)
    useEffect(() => {
        const convertArrayBufferToBase64 = (buffer) => {
            const uint8Array = new Uint8Array(buffer);
            let binary = '';
            uint8Array.forEach(byte => {
                binary += String.fromCharCode(byte);
            });
            const base64String = btoa(binary);
            return `data:image/png;base64,${base64String}`;
        }

        const img = convertArrayBufferToBase64(thumbnail.data)
        setImgUrl(img)
    }, [thumbnail])

    return imgUrl
}
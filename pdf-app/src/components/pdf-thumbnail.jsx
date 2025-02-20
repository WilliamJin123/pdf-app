import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfThumbnail({ book }) {
    const [loadThumbnail, setLoadThumbnail] = useState(false)
    const [error, setError] = useState(null)
    const { file, id, title } = book
    const [thumbnail, setThumbnail] = useState(localStorage.getItem(`thumbnail/${id}`) || null)
    for(const key in file){
        console.log(key)
    }
    useEffect(() => {
        if (!file) { return }
        const generateThumbnail = async () => {
            try {
                console.log(file)
                const pdf = await pdfjsLib.getDocument({ data: file }).promise
                const page = await pdf.getPage(1)

                const viewport = page.viewport({ scale: 1 })
                const canvas = document.createElement("canvas")
                const context = canvas.getContext("2d");
                canvas.width = viewport.width
                canvas.height = viewport.height
                const renderContext = { canvasContext: context, viewport };
                await page.render(renderContext).promise
                const thumbnail = canvas.toDataURL("image/png");
                setThumbnail(thumbnail);
                localStorage.setItem(`thumbnail/${id}`)
            } catch (err) {
                // console.log('error generating thumbnail', err)
                setError(true)
            }
        }

        generateThumbnail()
    }, [file])

    return (
        thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-contain" />
        ) : (
            error ? (
                <div>Retry?</div>

            ) : (
                <div>Loading ...</div>
            )
        )
    )
}
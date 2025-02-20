import PdfThumbnail from "./pdf-thumbnail"


export default function BookItem({book}) {
    
    const width = 3
    const ratio = 1.414
    const height  = width * ratio

    const {title, author} = book
    return(
        <div className="bg-red-500 w-full rounded-xl h-[20vw] flex flex-col justify-center items-center text-[0.95vw]">
            <div className=" h-[75%] w-full bg-white flex justify-center items-center">
                <PdfThumbnail book={book} />
            </div>
            <div className="w-full h-[25%] text-black text-center ">
                <div className="poppins-semibold mt-[0.5vw]">{title}</div>
                <div className="mt-[0.5vw] poppins-regular">{author}</div>
            </div>
        </div>
    )
}
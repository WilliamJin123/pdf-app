import { useState, useEffect } from "react"
import useImgUrl from "./custom-hooks/useImgUrl"



export default function BookItem({ book, setSelected, selected, index }) {
    
    const width = 3
    const ratio = 1.414
    const height = width * ratio

    const { title, author, thumbnail, fileId } = book
    
    const imgUrl = useImgUrl(thumbnail)

    return (
        <>
            <div className="bg-[var(--cream)] w-full rounded-lg border border-1 border-gray-400  h-[20vw] flex flex-col justify-center items-center text-[0.95vw]"
                onClick={() => setSelected(index)}>
                <div className=" h-[75%] w-full  flex justify-center items-center">
                    <img src={imgUrl} className="object-contain w-[75%] rounded" />
                </div>
                <div className="w-full h-[25%] text-black text-center ">
                    <div className="poppins-semibold mt-[0.5vw]">{title}</div>
                    <div className="mt-[0.5vw] poppins-regular">{author}</div>
                </div>
            </div>
        </>

    )
}
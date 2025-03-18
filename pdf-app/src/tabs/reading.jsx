import { useState, useEffect, useRef } from "react"
import Back from "../components/backButton"
import PdfViewer from "../components/pdfViewer"
import { useParams } from "react-router"

export default function Reading() {
    const { bookId } = useParams()
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(false)
    const [pdf, setPdf] = useState()
    const [page, setPage] = useState(1) 
    const abortControllerRef = useRef()
    const handleRead = async () => {
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()
        setFetching(true)

        try {
            const res = await fetch(`http://localhost:5000/read/${bookId}`, {
                method: 'GET',
                signal: abortControllerRef.current?.signal
            })
            const pdf = await res.json()
            console.log('pdf', pdf)
            setPdf(pdf)

        } catch (err) {
            if (err.name === "AbortError") {
                console.log('Search aborted')
                return
            }
            console.log('Error fetching book', err);

        }
        setFetching(false)
    }

    useEffect(() => {
        
        handleRead()
        return () => {
            setFetching(true)
        }
    }, [])

    useEffect(() => {
        console.log(pdf)
    },[pdf])

    useEffect(() => {
        console.log(fetching)
    },[fetching])


    return (
        <>
            {pdf !== null? <PdfViewer file={pdf}/> : (fetching? (<div>Loading pdf</div>) : (<div>Not fetching</div>))}
        </>

    )
}
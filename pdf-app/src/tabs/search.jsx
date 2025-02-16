import BookItem from "../components/bookItem"
import SearchBar from "../components/searchBar"
import { useState, useRef } from "react"


export default function Search() {
    
    const [query, setQuery] = useState(JSON.parse(localStorage.getItem("searchQuery")) || {
        title: "",
        author: ""
    })
    const [loading, setLoading] = useState(false)
    const [books, setBooks] = useState(localStorage.getItem("books") || [])
    const [error, setError] = useState()
    const abortControllerRef = useRef()

    const fetchBooks = async (offset = 0, limit = 10) => {
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()
        setLoading(true)
        const searchParams = new URLSearchParams()
        if (query.title) searchParams.append("title", query.title);
        if (query.author) searchParams.append("author", query.author);
        searchParams.append("offset", offset);
        searchParams.append("limit", limit);

        try {
            const res = await fetch(`http://localhost:5000/search?${searchParams.toString()}`, {
                method: 'GET',
                signal: abortControllerRef.current?.signal
            })
            setBooks(await res.json())

        } catch (err) {
            if (err.name === "AbortError") {
                console.log('Search aborted')
                return
            }
            console.log('Error searching', err);
            setError(err)
        } finally {
            setLoading(false)
        }
    }



    const submitSearch = async (e,) => {
        fetchBooks()
        
    }



    const changeQuery = (value, name) => {
        
        setQuery(prev => {
            localStorage.setItem("searchQuery", JSON.stringify({
                ...query,
                [name]: value
            }))
            return {
                ...prev,
                [name]: value
            }

        })

    }

    return (
        <div className="w-full flex flex-col justify-center pt-10 ">
            <SearchBar styles=" w-[50%] mx-[25%] text-xl" submitSearch={submitSearch} query={query} setQuery={setQuery} placeholder={'Search for Docs...'} name={'title'} changeQuery={changeQuery} />
            <SearchBar styles=" w-[50%] mx-[25%] text-xl" submitSearch={submitSearch} query={query} setQuery={setQuery} placeholder={'Search for Authors...'} name={'author'} changeQuery={changeQuery} />
            {books.forEach(book => (
                <BookItem key={book.id} book={book} />
            ))}
        </div>
    )
}
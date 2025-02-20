import BookItem from "../components/bookItem"
import SearchBar from "../components/searchBar"
import { useState, useRef, useEffect, useLayoutEffect } from "react"


export default function Search() {

    const [query, setQuery] = useState(JSON.parse(localStorage.getItem("searchQuery")) || {
        title: "",
        author: ""
    })
    const [searching, setSearching] = useState(false)
    const [books, setBooks] = useState(JSON.parse(localStorage.getItem("books")) || [])
    const [error, setError] = useState()
    const abortControllerRef = useRef()

    const fetchBooks = async (offset = 0, limit = 10) => {
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()
        setSearching(true)
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
            const newBooks = await res.json()
            setBooks(newBooks)
            localStorage.setItem("books", JSON.stringify(newBooks))
        } catch (err) {
            if (err.name === "AbortError") {
                console.log('Search aborted')
                return
            }
            console.log('Error searching', err);
            setError(err)
        } finally {
            setSearching(false)
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("books")) {
            console.log(localStorage.getItem("books"), "fetching books")
            fetchBooks()
        }
    }, [])
    useEffect(() => {
        console.log(books)
    }, [books])

    const submitSearch = async (e) => {
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
        <div className="w-full flex flex-col justify-start pt-5 ">
            <SearchBar styles=" w-[50%] mx-[10%] text-xl" submitSearch={submitSearch} query={query} setQuery={setQuery} placeholder={'Search for Docs...'} name={'title'} changeQuery={changeQuery} />
            <SearchBar styles=" w-[50%] mx-[10%] text-xl" submitSearch={submitSearch} query={query} setQuery={setQuery} placeholder={'Search for Authors...'} name={'author'} changeQuery={changeQuery} />

            <div className="grid grid-cols-5 gap-[5%] w-[80%] mx-[10%] mt-[3%] ">
                {books.map((book) => (
                    <BookItem key={book.id} book={book} />
                ))}
            </div>

        </div>
    )
}
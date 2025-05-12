import BookItem from "../components/bookItem"
import SearchBar from "../components/searchBar"
import { useState, useRef, useEffect, } from "react"
import SelectedItem from "../components/selectedItem"
import { AnimatePresence } from 'motion/react'
import { useDarkContextWrapper } from "../components/context/backgroundDarkenContext"
import { useLocation, useSearchParams } from "react-router"


export default function Search() {
    const { darkened, setDarkened } = useDarkContextWrapper()
    const [URLsearchParams, setURLsearchParams] = useSearchParams()
    const [query, setQuery] = useState({
        title: URLsearchParams.get("title") || "",
        author: URLsearchParams.get("author") || ""
    })
    const [searching, setSearching] = useState(true)
    const [books, setBooks] = useState(JSON.parse(localStorage.getItem("books")) || [])
    const [error, setError] = useState()
    const [selected, makeSelected] = useState(localStorage.getItem("selected") || -1)
    function setSelected(value) {
        makeSelected(value)
        localStorage.setItem("selected", value)
    }
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

        } catch (err) {
            if (err.name === "AbortError") {
                console.log('Search aborted')
                return
            }
            console.log('Error searching', err);
            setError(err)
        }
        setSearching(false)

    }

    useEffect(() => {
        if (!localStorage.getItem("books")) {
            console.log(localStorage.getItem("books"), "fetching books")
            fetchBooks()
        }

        return () => {
            setSearching(true)
        }
    }, [])


    useEffect(() => {
        console.log(books)
        console.log('selected', selected)
        console.log(darkened)

    }, [books, selected])
    useEffect(() => {console.log('query', query)}, [query])

    const submitSearch = async (e) => {
        setURLsearchParams(query)
        fetchBooks()
    }
    const changeQuery = (value, name) => {

        setQuery(prev => {

            return {
                ...prev,
                [name]: value
            }

        })

    }

    const handleSelected = (value) => {
        setSelected(value)
        if (value !== -1) {
            setDarkened(true)
        } else {
            setDarkened(false)
        }
    }


    return (
        <div className="w-full flex flex-col justify-start pt-5 relative">
            <SearchBar styles=" w-[50%] mx-[10%] text-xl" submitSearch={submitSearch} query={query} setQuery={setQuery} placeholder={'Search for Docs...'} name={'title'} changeQuery={changeQuery} />
            <SearchBar styles=" w-[50%] mx-[10%] text-xl" submitSearch={submitSearch} query={query} setQuery={setQuery} placeholder={'Search for Authors...'} name={'author'} changeQuery={changeQuery} />

            <div className="grid grid-cols-5 gap-[5%] w-[80%] mx-[10%] mt-[3%] ">
                {searching ? (<div>Searching</div>) : (
                    !books.length ? (<div>No Matches</div>) :
                        books.map((book, index) => (
                            <BookItem key={book.fileId} index={index} book={book} setSelected={handleSelected} selected={selected} />
                        )))}

            </div>
            <AnimatePresence>
                {selected !== -1 && books[selected] && (<SelectedItem book={books[selected]} setSelected={handleSelected} />)}
            </AnimatePresence>

        </div>
    )
}
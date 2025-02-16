import icons from "../assets/icons/icons"
import { useState } from "react"

export default function SearchBar({styles, submitSearch, query, changeQuery, placeholder, name}) {
    
    
    return (
        <form className={`flex relative justify-center items-center poppins-light  h-15  cursor-pointer ${styles} `}>
            <input type="text" placeholder={placeholder} className="w-full h-full bg-white  border border-black placeholder-gray-600 pl-7 text-2xl" 
            onChange={e => {changeQuery(e.target.value, name)
            }}
            value={query[name]}/>
            <img onClick={submitSearch} src={icons.search} className="absolute right-5 w-10 h-10 object-contain" />
        </form>
    )
}
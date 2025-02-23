import { createContext, useContext, useState } from "react";


const darkenContext = createContext()

export const BgDarkenContextWrapper = ({children}) => {
    const [darkened, setDarkened] = useState(false)

    

    return (
        <darkenContext.Provider value={{darkened, setDarkened}}>
            {children}
        </darkenContext.Provider>
    )
}

export const useDarkContextWrapper = () => {
    return useContext(darkenContext);
  };
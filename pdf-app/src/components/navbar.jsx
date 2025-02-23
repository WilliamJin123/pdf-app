import { AnimatePresence, motion } from 'motion/react'
import { Link, useLocation } from 'react-router'
import { Suspense, useState, useRef, useEffect } from 'react'
import Loading from './loading'



const expandSvg = () => (<svg className="fill-white w-[calc(20%+0.5vw)] h-[calc(20%+0.5vw)] " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" /></svg>)


const enterVariants = {
    hidden: { y: -60, opacity: 1 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.2 } },
    exit: { y: -60, transition: { duration: 0.2 } },
}

export default function Navbar() {

    const [expanded, setExpanded] = useState(true)

    const location = useLocation()

    const isActive = (path) => location.pathname === path;
    const firstRender = useRef(true)

    useEffect(() => {
        firstRender.current = false;
    }, []);

    return (
        <Suspense fallback={<Loading />}>
            <div className='flex-col h-15 relative w-[45%] float-right z-10'>
                <AnimatePresence>
                    {expanded && (
                        <motion.div className="mr-5 float-right w-full relative text-[calc(1vw+1.5px)] bg-black h-15 flex items-center justify-evenly text-white poppins-regular gap-[3%] rounded-b-3xl px-[2vw]"
                            initial={firstRender.current ? false : 'hidden'}
                            animate='visible'
                            exit='exit'
                            variants={enterVariants}
                        >
                            <div className= "hover:bg-[var(--dark-gray)] rounded-lg p-[1%]">
                                <Link to="/" className={isActive("/") ? "text-yellow-500" : "text-white"}>Home </Link>
                            </div>
                            <div className="hover:bg-[var(--dark-gray)] rounded-lg p-[1%]"><Link to="/sign-in" className={`${isActive("/sign-in") ? "text-yellow-500" : "text-white"}`}>Sign In</Link></div>
                            <div className="hover:bg-[var(--dark-gray)] rounded-lg p-[1%]"><Link to="/register" className={isActive("/register") ? "text-yellow-500" : "text-white"}>Register </Link></div>
                            <div className="hover:bg-[var(--dark-gray)] rounded-lg p-[1%]"><Link to="/profile" className={isActive("/profile") ? "text-yellow-500" : "text-white"}>Profile</Link></div>
                            <div className="hover:bg-[var(--dark-gray)] rounded-lg p-[1%]"><Link to="/upload" className={isActive("/upload") ? "text-yellow-500" : "text-white"}>Upload</Link></div>

                            <div className="hover:bg-[var(--dark-gray)] rounded-lg p-[1%]"><Link to="/library" className={isActive("/library") ? "text-yellow-500" : "text-white"}>Library</Link></div>
                            <div className="hover:bg-[var(--dark-gray)] rounded-lg p-[1%]"><Link to="/search" className={isActive("/search") ? "text-yellow-500" : "text-white"}>Search</Link></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div className=' cursor-pointer right-[5vw] h-8 absolute bg-black w-15 top-15 rounded-b-2xl flex justify-center items-center outline-none shadow-none ' onClick={() => setExpanded(!expanded)}
                    animate={{ y: expanded ? 0 : -60 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.span className='flex justify-center items-center transform origin-center w-full h-auto py-0'
                        initial={{ rotate: '-90deg' }} animate={{ rotate: expanded ? '-90deg' : '90deg' }} transition={{ duration: 0.2 }}>{expandSvg()}</motion.span>
                </motion.div>
            </div>

        </Suspense>


    )
}
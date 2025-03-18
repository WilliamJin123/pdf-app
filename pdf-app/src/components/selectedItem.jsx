import { motion, } from 'motion/react'
import useImgUrl from './custom-hooks/useImgUrl'
import icons from '../assets/icons/icons'
import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { useDarkContextWrapper } from './context/backgroundDarkenContext'
const variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -75, opacity: 0, transition: { y: { duration: 0.5 }, opacity: { duration: 0.3 } } },
    transition: { duration: 0.5, ease: [.16, .97, .51, 1.08] }
}

export default function SelectedItem({ book, setSelected }) {

    const { setDarkened } = useDarkContextWrapper()
    const { fileId, author, title, description, thumbnail, dateAdded, pages } = book
    const imgUrl = useImgUrl(thumbnail)




    return (

        <motion.div className="bg-[var(--cream)] w-[70%] h-[85vh] absolute left-[15%] top-[2.5%] rounded-2xl flex px-[2.5%]"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onAnimationStart={(def) => {
                if (def === 'visible') {
                    setDarkened(true)
                }
            }}
            transition={variants.transition}
        >
            <motion.img src={icons.x}
                whileHover={{ scale: 1.025, transition: { duration: 0.2 } }}
                className='absolute  z-10 closeImg  w-[2.5vw] right-[0.3vw] top-[0.3vw] rounded-lg hover:bg-[var(--gray-cream)]'
                onClick={() => setSelected(-1)} />
            <div className='grid grid-cols-[minmax(300px,35%)_auto] grid-rows-[minmax(450px,33vw)_auto] gap-x-5 w-full pt-[3%]'>
                <div className='flex w-full h-full items-start'>
                    <img src={imgUrl} className='object-contain rounded-md' />
                </div>


                <div className='text-black text-start poppins-regular'>{description}</div>
                <div className='flex flex-col text-lg gap-2'>
                    <div className='text-black text-center poppins-semibold'>{title}</div>
                    <div className='text-black text-center poppins-regular'>{author}</div>
                    <div className='text-black text-center text-sm poppins-regular'>Pages: {pages}</div>
                    <div className='text-black text-center text-sm poppins-regular'>Date Added: {dateAdded.substring(0, 10)}</div>

                </div>
                <div className='w-full flex justify-center items-start'>
                    <Link className="w-full flex items-center justify-center " to={`/read/${fileId}`}>
                        <motion.button whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.99, transition: { duration: 0.2 } }}
                            className="bg-black w-[40%] rounded-xl text-white poppins-semibold"
                            style={{ height: 'calc(15px + 3vw)', fontSize: 'calc(10px + 1vw)' }}>
                            Read
                        </motion.button>
                    </Link>
                </div>

            </div>

        </motion.div>

    )
}
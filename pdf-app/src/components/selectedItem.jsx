import { motion, } from 'motion/react'
import useImgUrl from './custom-hooks/useImgUrl'


const variants = {
    hidden: { y: -200, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -150, opacity: 0 },
    transition: { duration: 0.5, ease: "easeInOut" }
}

export default function SelectedItem({ book, setSelected }) {

    const { fileId, author, title, description, thumbnail, dateAdded, pages} = book

    const imgUrl = useImgUrl(thumbnail)
    return (

        <motion.div className="bg-red-100 w-[70%] h-[85vh] absolute left-[15%] top-[2.5%] rounded-2xl flex px-[2.5%]"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={variants.transition}
            onClick={() => setSelected("")}
        >
            <div className='flex flex-col justify-start w-[45%] min-w-[250px] max-w-[450px] px-[2.5%] pt-[4%]'>
                <img src={imgUrl} className='w-full object-contain' />
                <div className='h-[30%] py-[0.5vw] flex flex-col text-lg gap-2'>
                    <div className='text-black text-center poppins-semibold'>{title}</div>
                    <div className='text-black text-center poppins-regular'>{author}</div>
                    <div className='text-black text-center text-sm poppins-regular'>Pages: {pages}</div>
                    <div className='text-black text-center text-sm poppins-regular'>Date Added: {dateAdded.substring(0, 10)}</div>
                    
                </div>
            </div>

        </motion.div>

    )
}
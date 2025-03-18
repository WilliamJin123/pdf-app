import { useNavigate, useParams } from "react-router";
import icons from "../assets/icons/icons";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { enterVariants } from "./navbar";
export default function Back() {
    const navigate = useNavigate()
    const firstRender = useRef(true)

    useEffect(() => {
        firstRender.current = false;
    }, []);

    return (
        
            <motion.div className="bg-black rounded-br-3xl w-[6%] hover:bg-[var(--dark-gray)] h-15 flex justify-center items-center poppins-regular text-[calc(1vw+1.5px)] text-white cursor-pointer"
                onClick={() => navigate(-1)}
                variants={enterVariants}
                initial={!firstRender.current? 'hidden' : false}
                animate='visible'
                exit='exit'
            >
                <div className="w-full flex justify-start items-center gap-1  rounded-lg rounded-br-3xl p-[1%]">
                    <img src={icons.arrow} className="object-contain w-[40%]" />
                    <div className="text-white ">Back</div>

                </div>
            </motion.div>
        

    )
}
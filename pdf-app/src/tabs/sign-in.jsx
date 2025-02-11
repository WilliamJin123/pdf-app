import { Link } from "react-router"
import { useState } from "react"


export default function SignIn() {

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('submit')
    }
    return (
        <div className="w-full flex justify-center pt-[8%]">
            <div className="w-[50vw] h-[50vh] bg-white shadow-2xl rounded-2xl flex-col items-center poppins-regular">
                <form className="w-full h-full pt-10" onSubmit={handleSubmit}>
                    <div className="mb-10 w-[90%] mx-[5%]">
                        <label htmlFor="email" className="text-sm">Your Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            className="w-full p-2 mt-4 border rounded-md"
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="mb-1 w-[90%] mx-[5%]">
                        <label htmlFor="password" className="text-sm">Your Password:</label>
                        <input
                            type={showPassword? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            
                            value={form.password}
                            className="w-full p-2 mt-4 border rounded-md"
                            onChange={p => setForm({ ...form, password: p.target.value })}
                        />
                        
                        
                    </div>
                    <div className="w-[90%] mx-[5%] mb-9">
                    <label htmlFor="showPassword" className="text-sm text-gray-500">Show Password</label>
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="ml-1 align-middle"
                        />
                    </div>


                    <button
                        type="submit"
                        className="w-[50%] mx-[25%] py-2 bg-blue-600 text-white rounded-md "
                    >  Sign In
                    </button>

                    <div className="flex w-full mt-10">
                        <Link to="/register" className="w-full text-center text-blue-600 underline"><a>Don't have an account?</a></Link>
                    </div>
                </form>

            </div>
        </div>

    )
}
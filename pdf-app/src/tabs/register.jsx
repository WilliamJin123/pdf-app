import { Link } from "react-router-dom"

import { useState } from "react"


export default function Register() {


    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const handleSubmit = (e) => { e.preventDefault() }
    return (
        <div className="w-full flex justify-center pt-[5%]">
            <div className="w-[50vw] h-[75vh] bg-white shadow-2xl rounded-2xl flex-col items-center poppins-regular">
                <form className="w-full h-full pt-10" onSubmit={handleSubmit}>
                    <div className="mb-7 w-[90%] mx-[5%]">
                        <label htmlFor="username" className="text-sm">Your Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={form.email}
                            className="w-full p-2 mt-4 border rounded-md"
                            onChange={u => setForm({ ...form, username: u.target.value })}
                        />
                    </div>
                    <div className="mb-7 w-[90%] mx-[5%]">
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

                    <div className="mb-7 w-[90%] mx-[5%]">
                        <label htmlFor="password" className="text-sm">Your Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Enter your password"

                            value={form.password}
                            className="w-full p-2 mt-4 border rounded-md"
                            onChange={p => setForm({ ...form, password: p.target.value })}
                        />


                    </div>
                    <div className="mb-1 w-[90%] mx-[5%]">
                        <label htmlFor="confirmPassword" className="text-sm">Confirm Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"

                            value={form.confirmPassword}
                            className="w-full p-2 mt-4 border rounded-md"
                            onChange={p => setForm({ ...form, confirmPassword: p.target.value })}
                        />
                    </div>
                    <div className="w-[90%] mx-[5%] mb-6">
                        <label htmlFor="showPassword" className="text-sm">Show Password</label>
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
                    >  Register
                    </button>

                    <div className="flex w-full mt-10">
                        <Link to="/sign-in" className="w-full text-center text-blue-600 underline"><a>Already have an account?</a></Link>
                    </div>
                </form>

            </div>
        </div>


    )
}
import { Route, Routes, useLocation } from "react-router-dom"

import Navbar from "./components/navbar"
import Home from "./tabs/home"
import SignIn from "./tabs/sign-in"
import Register from "./tabs/register"
import Upload from "./tabs/upload"
import Library from "./tabs/library"
import Search from "./tabs/search"
import Profile from "./tabs/profile"


export default function App() {

  return (
    <div className="w-full relative flex-col h-full ">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/library" element={<Library />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  )
}


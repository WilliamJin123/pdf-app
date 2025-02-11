import { useState, useEffect } from "react"
import icons from '../assets/icons/icons'
import FileIcon from "../components/filetypeIcon";
import { PDFDocument } from 'pdf-lib';

export default function Upload() {
    const savedTitle = localStorage.getItem("title");
    const savedDescription = localStorage.getItem("description");
    const savedAuthor = localStorage.getItem("author");
    const savedPages = localStorage.getItem("pages")
    const [uploading, setUploading] = useState(false)

    const [form, setForm] = useState({
        title: savedTitle || "",
        author: savedAuthor || "",
        description: savedDescription || "",
        pages: savedPages || 0,
        file: null
    })

    const clearForm = () => {
        localStorage.removeItem("title")
        localStorage.removeItem("description")
        localStorage.removeItem("author")
        localStorage.removeItem("pages")
        console.log('cleared form')
        setForm({
            title: "",
            author: "",
            description: "",
            pages: 0,
            file: null
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)
        let valid = true;
        if (!form.file) {
            console.log('need file')
            valid = false;
        }
        if (!form.title) {
            console.log('need title')
            valid = false;
        }
        if (!form.author) {
            console.log('need author')
            valid = false;
        }
        if (!valid) {
            setUploading(false);
            return
        }
        try {
            const formData = new FormData()
            formData.append('title', form.title)
            formData.append('author', form.author)
            formData.append('description', form.description)
            formData.append('pages', form.pages)
            const res = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await res.json();
            if (res.ok) {
                console.log(result.message);
            } else {
                console.log(result.message, result.error);
            }

        } catch (error) {
            console.log('Error uploading file:', error);
        } finally {

            setUploading(false);

        }
    }

    const handleFileChange = async (e) => {

        const getPageCount = async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            return pdfDoc.getPages().length
        }
        if (e.target.files && e.target.files[0]) {
            if (e.target.files[0].type.includes('pdf')) {

                try {
                    const pageCount = await getPageCount(e.target.files[0])
                    localStorage.setItem("pages", pageCount)
                    setForm(prevForm => ({
                        ...prevForm,
                        file: e.target.files[0],
                        pages: pageCount
                    }));
                } catch (err) {
                    console.log(err)
                }

            } else {
                console.log('not a pdf, try again')
            }
        } else {
            setForm(prevForm => ({ ...prevForm, pages: 0, file: null }))

        }
    }

    useEffect(() => {
        console.log(form)
        if (form.type) console.log('filetype', form.file.type)
    }, [form])

    return (
        <div className="w-full flex justify-center">
            <div className="w-[50vw]  bg-white shadow-2xl rounded-2xl flex-col items-center py-7 mt-9">
                <form onSubmit={handleSubmit}>
                    <div className="poppins-medium text-xl mb-7 ml-[2%]">Upload Video</div>

                    <div className="w-[94%] mx-[3%] poppins-regular mb-5">
                        <label htmlFor="title" className="text-sm">Book Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="What is the title of the book?"
                            value={form.title}
                            className="w-full p-2 mt-2 border rounded-md"
                            onChange={u => {
                                setForm({ ...form, title: u.target.value })
                                localStorage.setItem("title", u.target.value)
                            }}
                        />
                    </div>
                    <div className="w-[94%] mx-[3%] poppins-regular mb-7">
                        <label htmlFor="title" className="text-sm">Author:</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            placeholder="Who wrote this book?"
                            value={form.author}
                            className="w-full p-2 mt-2 border rounded-md"
                            onChange={u => {
                                setForm({ ...form, author: u.target.value })
                                localStorage.setItem("author", u.target.value)
                            }}
                        />
                    </div>
                    <div className="w-[94%] mx-[3%] poppins-regular mb-7">
                        <label htmlFor="title" className="text-sm">Book Description:</label>
                        <textarea
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Give a brief description of the book"
                            value={form.description}
                            className="w-full p-2 mt-3 border rounded-md max-h-[300px]"
                            onChange={u => {
                                setForm({ ...form, description: u.target.value })
                                localStorage.setItem("description", u.target.value)
                            }}
                        />

                    </div>
                    <div className="text-sm w-[94%] ml-[3%] poppins-regular mb-3">Upload File:</div>
                    <div className="flex w-[94%] mx-[3%] h-[25vh] justify-evenly items-center">

                        <div className="w-[60%] h-[100%] flex items-center justify-center rounded-xl border border-black ">
                            <label htmlFor="file" className="cursor-pointer h-full w-full flex items-center justify-center">
                                {!form.file ?
                                    (<img src={icons.uploadpng} className="h-[10rem] w-[10rem] object-cover" />) :

                                    (<div className="flex flex-col items-center">
                                        <FileIcon fileType={form.file.type} imageStyles="h-[7rem] w-[7rem] object-contain" />
                                        <div className="w-[90%] mx-[5%] text-center ">{form.file.name}</div>

                                    </div>)}
                            </label>
                            <input id="file" name="file" type="file" accept="file" className="hidden" onChange={handleFileChange} />
                        </div>
                        <div className="w-[40%] h-[100%] flex flex-col justify-evenly items-center">
                            <button type="submit" disabled={uploading} className={`poppins-medium text-white ${uploading ? 'bg-gray-500' : 'bg-black '} rounded-xl w-[60%] h-12`}>Upload</button>
                            <button type="button" onClick={clearForm} className={`poppins-medium text-white bg-black rounded-xl w-[60%] h-12`}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
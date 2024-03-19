import './App.css'
import { Outlet, Link, Navigate,useNavigate } from "react-router-dom";
import Contexte from "./Contexte";
import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:3000/api';


function App() {
  const redirect = useNavigate();

  const logout = () => {
    // Clear the authentication token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Set the expiration date to a past date
    setLoguejat(null)
    window.location.href = "/login"; // Redirect to the login page
  };


  const [loguejat, setLoguejat] =useState(null)

  useEffect(() => {
    // si tenim una cookie, intentem validar-la!
    if(document.cookie.includes('token')){
      fetch(API_URL+'/refresh', {credentials: "include"})
      .then(e => e.json())
      .then(data => {
        if (data.error){
          // api rebutja la cookie local, l'esborrem per mitjà de la funció logout()
          logout();
        } else {
          // api accepta la cookie, simulem login desant les dades rebudes a "loguejat"
          setLoguejat(data)
        }
      })
    }  
  }, [])


  const dades = {loguejat, setLoguejat, logout, API_URL}

  return (
    <Contexte.Provider value={dades}>
      <div className="w-full flex justify-between p-8 bg-neutral-100 bg-opacity-70 border-b-2  shadow-xl shadow-black border-amber-400">
        <div className='flex flex-row items-center justify-center gap-2 flex-wrap '>
          <img src="/img/carpincho_outline.png" alt="" className='w-16 h-16'/>
          <h1 className='font-rock  text-3xl font-semibold '>GyraBara</h1>
        </div>
        <div className='flex flex-row gap-4 flex-wrap w-100'>
          {/*<Link className="border-2 border-amber-400 rounded-md px-4 py-2 shadow-md shadow-neutral-800 bg-emerald-400 text-white hover:bg-emerald-600" to="/projects" >Inici</Link>*/}  
          {loguejat && <Link className="flex items-center justify-center text-center p-2  rounded-md shadow-md shadow-neutral-800 bg-emerald-400 text-white  hover:bg-emerald-600" to="/projects">Projectes</Link>}
          {!loguejat && <Link className="flex items-center justify-center text-center p-2  rounded-md shadow-md shadow-neutral-800 bg-emerald-400 text-white  hover:bg-emerald-600 w-100" to="/login" >Login</Link>}
          {loguejat && <button className=" text-center p-2  rounded-md shadow-md shadow-neutral-800 bg-emerald-400 text-white  hover:bg-emerald-600" onClick={logout}>Logout {loguejat.name}</button>}

        </div>
      </div>
      <div className="bg-[url('/img/triangles.svg')] min-h-screen p-8 grid grid-cols-7">
          <Outlet  />
      </div>
    </Contexte.Provider>

  )
}

export default App

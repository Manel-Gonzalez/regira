import './App.css'
import { Outlet, Link } from "react-router-dom";
import Contexte from "./Contexte";
import { useEffect, useState } from 'react'
const API_URL = 'http://localhost:3000/api';


function App() {
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
      <div className="flex justify-between mb-10">
    <Link className="border px-4 py-2 bg-blue-700 text-white" to="/projects" >Inici</Link>
          {loguejat && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/projects">Projectes</Link>}
          {!loguejat && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/login" >Login</Link>}
          {loguejat && <button className="border px-4 py-2 bg-blue-700 text-white" onClick={logout}>Logout {loguejat.name}</button>}
      </div>
      <div className=" p-10">
          <Outlet />
        </div>
    </Contexte.Provider>

  )
}

export default App


import { useState, useContext } from "react";

import { useNavigate } from 'react-router-dom';
import Contexte from "./Contexte";


const API_URL = 'http://localhost:3000/api';


export default () => {
    const {logout} = useContext(Contexte)

    const [name, setName] = useState('');
    const [desc, setDescription] = useState('');
    const [active, setActive] = useState(0);
    const redirect = useNavigate();


    const nouProjecte = (e) => {

        e.preventDefault();

        //console.log("loguejant..", email, password)

        const credencials = {
            name,
            desc,
            active
        }

        const opcions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(credencials)
        }

        fetch(API_URL+'/projects', opcions)
        .then(resp => resp.json())
        .then(data => {
            //console.log("resp", data);
            if (!data.error){
                console.log(data);
                redirect('/projects')
            }
            
        })
        .catch(err => console.log(err))

    }


    return (
        <div className="w-full max-w-xs m-auto">
            <form onSubmit={nouProjecte} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="text-center">Nou Projecte</h1>
            <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nom del Projecte
                    </label>
                    <input
                        onInput={(e) => setName(e.target.value)}
                        value={name}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Project Name" />
            </div>
            <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
                        Descripcio
                    </label>
                    <input
                        onInput={(e) => setDescription(e.target.value)}
                        value={desc}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="desc" type="text" placeholder="Description" />
            </div>
            <div>
                <label htmlFor="active">
                    Actiu
                </label>
                <input onInput={(e)=> setActive(1)} type="checkbox" name="active" id="active" value={active} />
            </div>

            <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Crear
                    </button>
            </div>
            </form>
        </div>

/* 
        <div className="w-full max-w-xs m-auto">
            <form onSubmit={logueja} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-center">Login</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        onInput={(e) => setEmail(e.target.value)}
                        value={email}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Username" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        onInput={(e) => setPassword(e.target.value)}
                        value={password} className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                </div>
                <div className="text-center flex flex-row gap-4 justify-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Entrar
                    </button>
                   
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={()=>redirect('/register')}>
                        Registrar
                    </button>
                </div>

            </form>
        
        </div> */

    )
}
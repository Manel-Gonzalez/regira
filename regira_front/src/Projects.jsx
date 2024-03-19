
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Contexte from "./Contexte";


const API_URL = 'http://localhost:3000/api';



export default () => {

    const [projectes, setProjectes] = useState([])
    const [error, setError] = useState('')
    const redirect = useNavigate();
    const {logout} = useContext(Contexte)


    useEffect(() => {

        const opcions = {
            credentials: 'include',
        }

        fetch(API_URL + '/projects', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setError(error)
                } else {
                    setProjectes(data);
                }
            })

    }, [])


    if (error) {
        return <h1 className='text-red-500'>{error}</h1>
    }

    return (
    <div className='col-start-2 col-end-7 bg-gray-100/50  bg-opacity-60 p-4 border-2 border-neutral-600 rounded text-center my-6'>
        <h1 className='text-2xl bold'>Llista de projectes</h1>
        <button className=" rounded-md px-4 py-2 my-8 shadow-md shadow-neutral-800 bg-emerald-400 text-white hover:bg-emerald-600" onClick={()=>redirect('/project/new')}>Crear Projecte</button>

        <br />
        <br />
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table
                            className="min-w-full text-left text-sm font-light text-surface ">
                            <thead
                                className="border-b border-neutral-200 font-medium ">
                                <tr>
                                    <th scope="col" className="px-6 py-4">#</th>
                                    <th scope="col" className="px-6 py-4">Nom</th>
                                    <th scope="col" className="px-6 py-4">Descripcio</th>
                                    <th scope="col" className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>

                                {projectes?.map(projecte =>
                                (<tr key={projecte.id} className="border-b border-neutral-200 ">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{projecte.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{projecte.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{projecte.desc}</td>
                                    <td className="whitespace-nowrap px-6 py-4"><button className="border p-2 bg-yellow-300" onClick={()=>redirect("/kanban/"+projecte.id)} >Kanban</button></td>
                                </tr>)
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    </div>
    )



}
import {useState, useContext, useEffect} from "react";




const Priority = ({value}) => <h2>Priority: {value}</h2> 
const Type = ({value}) => <h2>Type: {value}</h2> 
const Desc = ({value}) =>  (value === null ? <p>Sin descripcion</p> : <p>Descripcion: {value}</p>);
/* 
(!{value} ? <p>Sin descripcion</p> : <p>Descripcion: {value}</p>) 
*/


const getColorByType  = ({issue_type}) => {
    
    if (issue_type==='bugs'){
        return 'shadow-md shadow-red-400 border-red-400';
    } else if (issue_type==='general'){
        return 'shadow-md shadow-green-400 border-green-400';
    } else { // task
        return 'shadow-md shadow-blue-400 border-blue-400'
    }
}

export default ({data, reference, isDragging, remove,setModal}) =>  {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(!open);
    };
  

    return (
        <>

        <div >


            <div ref = {reference}  className={"flex flex-col gap-2 border-2 m-3 rounded-md bg-white hover:scale-110 hover:transform hover:transition hover:duration-300  "+getColorByType(data)}>
                <div className="grid grid-cols-4 border-b-2 p-2 justify-between  bg-white">

                    <h1 className="text-lg col-span-3 font-semibold">{data.title}</h1>
                    <div className="bg-slate-500 w-fit flex flex-row gap-4">

                        <button onClick={handleOpen} className="p-4">:</button>
                        {open ? (
                            <ul className="">
                            <li className="hover:bg-slate-100">
                                <button onClick={()=> setModal(data.id)}>+ Info</button>
                            </li>
                            <li className="hover:bg-slate-100">
                                <button>Modificar</button>
                            </li>
                            <li className="hover:bg-slate-100">
                                <button onClick={()=>remove(data)}>Borrar</button>
                            </li>
                            </ul>
                        ) : null}
                    </div>
                </div>
                <Type value={data.issue_type} />
                <Priority value={data.priority} />
                <Desc value={data.desc}></Desc>
             
            </div>

        </div>
  

        </>
    )
}
/*
                 <div className="grid grid-cols-5 border-b-2 p-2 justify-between  bg-white">

*/
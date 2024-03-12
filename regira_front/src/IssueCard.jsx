const State = ({value}) => <h2>{value}</h2> 
const Priority = ({value}) => <h2>{value}</h2> 
const Type = ({value}) => <h2>{value}</h2> 

const getColorByType  = ({type}) => {
    
    if (type==='bug'){
        return 'bg-red-400';
    } else if (type==='feature'){
        return 'bg-green-400';
    } else { // task
        return 'bg-blue-400'
    }
}


export default ({data, reference, isDragging, remove}) =>  {

    return (
        <>
            <div ref = {reference}  className={"border p-2 m-3 "+getColorByType(data)}>
                <h1>{data.title} {data.id}</h1>
                <Type value={data.type} />
                <Priority value={data.priority} />
                <State value={data.state} />
                <button className="border p-2 bg-red-600 text-white" onClick={()=>remove(data)}>Elimina</button>
            </div>
        </>
    )
}
import {useState, useContext, useEffect} from "react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useParams, useNavigate} from "react-router-dom";
import IssueCard from "./IssueCard";
import Modal from "./Components/Modal/Modal.jsx"

import Contexte from "./Contexte";

const ItemType = "ISSUE_ITEM";



const CAIXES = [
  {state: "backlog", titol: "Pendent"},
  {state: "ready", titol: "Per iniciar"},
  {state: "in_progress", titol: "En curs"},
  {state: "review", titol: "Revisió"},
  {state: "testing", titol: "Testejant"},
  {state: "done", titol: "Fet"},
];

/* const [isModalShowed,setModalShowed] = useState(false)

const coso = () => {
  setModalShowed(!isModalShowed)
  console.log('from card click',isModalShowed);
} */

const Item = ({eliminaItem, data,setModal}) => {
  const [{isDragging}, drag_ref] = useDrag({
    type: ItemType,
    item: {type: ItemType, id: data.id},
  });

  return (
    <IssueCard
      reference={drag_ref}
      isDragging={isDragging}
      data={data}
      remove={eliminaItem}
      setModal={setModal}
    />
  );
};


const Box = ({children, caixa, mouItem}) => {
  const [{isOver}, drop_ref] = useDrop({
    accept: ItemType,
    drop: (item) => {
      // Moure l'item d'un lloc a l'altre
      mouItem(item, caixa.state);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  return (
    <div
      ref={drop_ref}
      dir=""
      className={`border rounded-md border-amber-400 p-8 min-h-[400px] shadow-inner shadow-slate-400  ${isOver ? "bg-blue-200 bg-opacity-70" : ""}`}
    >

      <h2 className="text-xl text-center mb-4">{caixa.titol}</h2>
      {children}
    </div>
  );
};
export default () => {
  const [projecte, setProjecte] = useState(null);
  const [error, setError] = useState("");
  const redirect = useNavigate();
  const [actualitza, setActualitza] = useState(0);
  const [modal,setModal]=useState(false)
  const[projecteModal,setProjecteModal]=useState(null)


  let {id} = useParams();

  const {logout, API_URL} = useContext(Contexte);

  // funció que "Mou" un element d'una caixa a l'altra
  const mouItem = (item, state) => {
    const opcions = {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({state}),
    };
    fetch(API_URL + "/issues/" + item.id, opcions)
      .then((r) => r.json())
      .then((data) => {
        if (data.error == "Unauthorized") logout();
        else setActualitza(actualitza + 1);
      })
      .catch((err) => console.log(err));
  };

  const eliminaItem = (item) => {
    const opcions = {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(API_URL + "/issues/" + item.id, opcions)
      .then((r) => r.json())
      .then((data) => {
        if (data.error == "Unauthorized") logout();
        else setActualitza(actualitza + 1);
      })
      .catch((err) => console.log(err));
  };

  useEffect(()=> {
    if(modal > 0){
      setProjecteModal(projecte?.find((p)=> (p.id == modal))) 

    }
  },[modal])

  useEffect(() => {
    const opcions = {
      credentials: "include",
    };

    fetch(API_URL + "/projects/" + `${id}` + "/issues", opcions)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error == "Unauthorized") logout();

        if (data.error) {
          setError(error);
        } else {
          setProjecte(data);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });
  }, [actualitza]);
  console.log('1',projecte)

  if (error) {
    return <h1 className="text-red-500">{error}</h1>;
  }

  if (!projecte) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="col-start-1 col-end-8 shadow-lg shadow-neutral-800 bg-white bg-opacity-90 p-8 pb-12 border-2 border-neutral-600 rounded-md text-center m-10 gap-2">
      
      <h1 className="text-2xl bold">Llista de Tasques</h1>
      <button
        className="rounded-md px-4 py-2 my-8 shadow-md shadow-neutral-800 bg-emerald-400 text-white hover:bg-emerald-600"
        onClick={() => redirect("/issue/new/" + `${id}`)}
      >
        Nova Tasca
      </button>
      <Modal projecteModal={projecteModal} setModal={setModal} modal={modal} />

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-3 border border-amber-400 rounded-lg shadow-md shadow-slate-300">
          {CAIXES.map((caixa) => (
            <Box key={caixa.state} caixa={caixa} mouItem={mouItem}>
              {projecte?.filter((e) => e.state == caixa.state)
                .map((e) => (
                  
                  <Item key={e.id} eliminaItem={eliminaItem} data={e} setModal={setModal}/>
                ))}
            </Box>
          ))}
        </div>
      </DndProvider>
    </div>
  );
};

/* 

        <div className="grid grid-cols-6">

            {issues?.map(issue =>
                (
                    <div className="flex flex-col bg-slate-100 border rounded-md gap-2 my-2">
                        <h1>{issue.title}</h1>
                        <p>{issue.priority}</p>
                        <p>{issue.state}</p>
                        <p>{issue.desc}</p>
                        
                    </div>
                )
                )}


        </div>

*/

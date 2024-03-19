import {useState, useContext, useEffect} from "react";

import {useNavigate, useParams} from "react-router-dom";
import Contexte from "./Contexte";

const API_URL = "http://localhost:3000/api";

export default () => {
  const {logout} = useContext(Contexte);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [issue_type, setIssueType] = useState("bugs");
  const [priority, setPriority] = useState("Medium");
  const [state, setState] = useState("ready");
  const redirect = useNavigate();
  const {projectId} = useParams();
  const {loguejat} = useContext(Contexte);

  const nouIssue = (e) => {
    e.preventDefault();

    //console.log("loguejant..", email, password)

    const credencials = {
      title,
      desc,
      issue_type,
      priority,
      state,
      projectId,
    };

    const opcions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credencials),
    };

    fetch(API_URL + "/issues", opcions)
      .then((resp) => resp.json())
      .then((data) => {
        //console.log("resp", data);
        if (!data.error) {
          redirect("/kanban/" + `${projectId}`);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="col-start-2 col-end-7 flex flex-col  bg-white rounded px-8 pt-6 pb-8 mb-4 border-2 border-neutral-400 shadow-md shadow-neutral-500 bg-opacity-80">
      <form onSubmit={nouIssue} className="">
        <div className="grid grid-cols-4 mb-8">
          <h1 className="text-center col-span-2 mb-3 text-xl font-bold">
            Nova Tasca
          </h1>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Titol
          </label>
          <input
            onInput={(e) => setTitle(e.target.value)}
            value={title}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Titol de la tasca"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="desc"
          >
            Descripció
          </label>
          <textarea
            onInput={(e) => setDesc(e.target.value)}
            value={desc}
            className=" box-border h-32 shadow appearance-none border rounded w-full py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="desc"
            type="text"
            placeholder="Descripció...."
          />
        </div>

        <div className="flex flex-row  w-fit gap-2">
          <div className="mb-4">
            <label htmlFor="issue_type">Tipo de Tarea</label>

            <select
              name="issue_type"
              id="issue_type"
              value={issue_type}
              className="border rounded mx-4 p-2"
              onInput={(e) => setIssueType(e.target.value)}
            >
              <option value="story">Story</option>
              <option value="bugs">Bugs</option>
              <option value="general">General</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="priority">Prioridad</label>

            <select
              name="priority"
              id="priority"
              value={priority}
              className="border rounded mx-4 p-2"
              onInput={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="state">Estado</label>

            <select
              name="state"
              id="state"
              value={state}
              className="border rounded mx-4 p-2"
              onInput={(e) => setState(e.target.value)}
            >
              <option value="backlog">Backlog</option>
              <option value="ready">Ready</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="testing">Testing</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <button
            className="text-md w-fit col-span-1 font-bold border-2 border-slate-500 shadow shadow-slate-500 rounded-md p-2 hover:bg-slate-200"
            onClick={() => redirect(-1)}
          >
            Atras
          </button>

          <button
            className="text-center p-2  rounded-md shadow-md shadow-neutral-800 bg-emerald-400 text-white  hover:bg-emerald-600"
            type="submit"
          >
            Crear
          </button>
        </div>
      </form>
    </div>

    /* 
        <div className="w-full max-w-xs m-auto">
            <form onSubmit={nouIssue} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
  );
};

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Contexte from "./Contexte";

const API_URL = "http://localhost:3000/api";

export default () => {
  const { setLoguejat } = useContext(Contexte);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const redirect = useNavigate();

  const registra = (e) => {
    e.preventDefault();

    //console.log("loguejant..", email, password)

    const credencials = {
      name,
      email,
      password,
    };

    const opcions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credencials),
    };

    fetch(API_URL + "/register", opcions)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("resp", data);
            if (!data.error){
                redirect('/login')
            }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="col-start-2 col-end-7 max-w-xs m-auto shadow-lg shadow-neutral-800  rounded-md border-2 border-amber-400">
      <form
        onSubmit={registra}
        className="bg-white shadow-md rounded p-8"
      >
        <div className="flex flex-row justify-between">
        <button className="text-md font-bold border-2 border-slate-500 shadow shadow-slate-500" onClick={()=> redirect(-1)}>BACK</button>
        <h1 className="text-center text-2xl font-rock font-bold">Register</h1>
        </div>
        <div className="mb-4">
          <label
            className=" text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            onInput={(e) => setEmail(e.target.value)}
            value={email}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="Email"
          />
        </div>
        <div>
          <label className=" text-gray-700 text-sm font-bold mb-2"
 htmlFor="name">Name</label>
          <input
            onInput={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            placeholder="Name"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            onInput={(e) => setPassword(e.target.value)}
            value={password}
            className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>

        <div className="text-center flex flex-row gap-4 justify-center">
          <button
            className="shadow-md shadow-neutral-800 bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Enviar
          </button>
          <button className="shadow-md shadow-neutral-800 bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={()=>redirect('/login')}>
            Iniciar Sesion
          </button>
        </div>
      </form>
    </div>
  );
};

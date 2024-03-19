import React, { useState } from "react";


export default function Modal({projecteModal,setModal,modal}){
    

    const closeModal = () => {
        setModal(false)
        console.log('caca',modal);
    }

    return(
        <>
        {modal ? (
        <div className="w-100 h-100 top-0 left-0 right-0 bottom-0 relative">
        <div className="w-100 h-100 top-0 left-0 right-0 bottom-0 fixed bg-neutral-500 bg-opacity-80 z-1000">
            
              <div className="absolute top-1/3 right-1/2 translate-x-1/2 translate-b-1/2 bg-white p-8 ">
                <h2>{projecteModal?.title}</h2>
                <p>
                    {projecteModal?.desc}
                </p>
                <button className=""
                onClick={closeModal}>
                    Close
                </button>
              </div>
        </div>
    </div>
        ):null}



        </>
    )
}
import React from 'react'

export default function Animation({ Type, update }) {
    return (
        <div className='square formHeading'>
            <span className={`${Type == "Problem" ? 'bg-[#f07e6e]' : Type == "Student" ? 'bg-[#84cdfa]' : Type == "SDE Sheet" ? 'bg-sky-500' : 'bg-[#5ad1cd]'}`}></span>
            <span className={`${Type == "Problem" ? 'bg-[#f07e6e]' : Type == "Student" ? 'bg-[#84cdfa]' : Type == "SDE Sheet" ? 'bg-sky-500' : 'bg-[#5ad1cd]'}`}></span>
            <span className={`${Type == "Problem" ? 'bg-[#f07e6e]' : Type == "Student" ? 'bg-[#84cdfa]' : Type == "SDE Sheet" ? 'bg-sky-500' : 'bg-[#5ad1cd]'}`}></span>
            <h3 className='text-3xl font-bold text-slate-800 content'>{Type}</h3>
            {Type == "Problem" ? <p className='text-base content'>{(update) ? "Add" : "Update"} problem</p> :
                <p className='text-base content'>{`${Type == "SDE Sheet" ? "Add" : "Update"}`} {Type}</p>}
        </div>
    )
}

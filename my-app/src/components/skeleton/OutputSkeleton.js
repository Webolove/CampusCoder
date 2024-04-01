import React from 'react'

export default function OutputSkeleton({ height, width }) {
    return (
        <div className='space-y-2.5 animate-pulse'>
            <div className="flex flex-col space-y-4 place-items-start justify-between w-full">
                <div className='flex space-x-2'>
                    <div className={`h-6 w-14 rounded-xl bg-slate-600`}></div>
                    <div className={`h-6 w-14 rounded-xl bg-slate-600`}></div>                   
                    <div className={`h-6 w-14 rounded-xl bg-slate-600`}></div>                   
                </div>
                <div className={`h-6 w-[250px] rounded-xl bg-slate-600`}></div>
            </div>
        </div>
    )
}

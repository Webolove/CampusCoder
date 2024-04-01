import React from 'react'

export default function QuestionSkeleton({ theme }) {
    return (
        <>
            <div className='flex flex-col w-full animate-pulse'>
                <div className='h-[40px] bg-transparent'></div>
            </div >
            <div className='flex flex-col w-full animate-pulse'>
                <div className={`h-[40px] ${theme == "dark" ? "bg-gray-600" : "bg-[#f5f5fa]"}`}></div>
            </div >
        </>
    )
}

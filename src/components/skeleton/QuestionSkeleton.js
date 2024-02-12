import React from 'react'

export default function QuestionSkeleton() {
    return (
        <>
            <div className='flex flex-col w-full animate-pulse'>
                <div className='h-[40px] bg-white'></div>
            </div >
            <div className='flex flex-col w-full animate-pulse'>
                <div className='h-[40px] bg-[#f5f5fa]'></div>
            </div >
        </>
    )
}

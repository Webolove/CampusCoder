import React from 'react'
import { LuTags } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { AiFillDislike, AiFillLike, AiOutlineLoading3Quarters } from 'react-icons/ai';
import DescSkeleton from '@/components/skeleton/DescSkeleton';


export default function Description({ loading, ProblemMetaData, ProblemData, viewTopic, setViewTopic, liked, disliked, updating, solved, handleDislike, handleLike }) {

    const difficultyColor = ProblemMetaData.difficulty == "easy" ? 'text-green-500' : ProblemMetaData.difficulty == "medium" ? "text-yellow-400" : "text-red-500";

    return (
        <>
            {
                loading ? <div className='h-full py-2 px-4 space-y-2 w-full'>
                    <DescSkeleton />
                </div> :
                    (<div className='overflow-scroll h-full flex flex-col place-items-start justify-start py-2 px-4 space-y-2 pb-14'>
                        <div className='flex w-full place-items-center justify-between'>
                            <h1 className='text-2xl font-semibold'>
                                {ProblemMetaData.title}
                            </h1>
                            {solved && <div className='text-green-500 flex space-x-2 place-items-center'>
                                <span><FiCheckCircle fontSize={"18"} width="18" /></span>
                                <span className='text-sm'>Solved</span></div>}
                        </div>

                        <div className='flex place-items-start text-sm space-x-2 text-stone-300 mt-2'>
                            <div className={`bg-slate-600 p-0.5 px-2 rounded-xl first-letter:uppercase ${difficultyColor}`}>{ProblemMetaData.difficulty}</div>
                            <div className='bg-slate-600 p-0.5 px-2 rounded-xl space-x-0.5 flex place-items-center cursor-pointer hover:bg-slate-700 transition-all' onClick={() => { setViewTopic(!viewTopic) }}>
                                <LuTags />
                                <span>Topic</span></div>
                            <div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6' onClick={handleLike}>
                                {updating ? <AiOutlineLoading3Quarters className='animate-spin' /> : liked ? <AiFillLike className='text-blue-500' /> : <AiFillLike />}

                                <span className='text-xs'>{ProblemData.likes}</span>
                            </div>
                            <div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6' onClick={handleDislike}>
                                {updating ? <AiOutlineLoading3Quarters className='animate-spin' /> : disliked ? <AiFillDislike className='text-blue-500' /> : <AiFillDislike />}
                                <span className='text-xs'>{ProblemData.dislikes}</span>
                            </div>
                        </div>

                        <div className={`flex flex-wrap gap-2 place-items-center text-sm text-stone-300  transition-all ${viewTopic ? "scale-1 h-fit" : "scale-0 h-0"}`}>
                            {
                                ProblemMetaData.topics.split(',').map((topic, idx) => (
                                    <div className="bg-slate-600 p-0.5 px-3 rounded-xl first-letter:uppercase" key={idx}>{topic}</div>
                                ))
                            }
                        </div>

                        <div className='pt-2 text-stone-100'>
                            <div dangerouslySetInnerHTML={{ __html: ProblemData.desc }}></div>
                        </div>

                        <div className='flex flex-col space-y-2'>
                            {
                                Object.values(ProblemData.Examples).map((example, index) => (

                                    <div className='flex flex-col space-y-1' key={index}>
                                        <h4 ><strong>Example {index + 1} :</strong></h4>

                                        <div className='bg-zinc-700 p-2 px-4 rounded-xl space-y-2 text-sm'>
                                            <p><strong>Input: </strong>{example.input}</p>
                                            <p><strong>Output: </strong>{example.output}</p>
                                            {
                                                example.explanation != "" &&
                                                <p><strong>Explanation: </strong><span dangerouslySetInnerHTML={{ __html: example.explanation }}></span></p>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div className='pt-6'>
                            <h4 className='text-bold text-lg'><strong>Constraints :</strong></h4>
                            <ul className='space-y-1 list-disc px-4 text-base'>
                                {
                                    ProblemData.constraint.split(',').map((constraint, index) => (
                                        <li key={index}>{constraint}</li>
                                    ))
                                }
                            </ul>
                        </div>

                    </div>)
            }
        </>
    )
}

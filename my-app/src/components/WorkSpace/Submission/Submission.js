import QuestionSkeleton from '@/components/skeleton/QuestionSkeleton';
import { firestore } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { LuRefreshCcw } from "react-icons/lu";

export default function Submission({ problemType, subLoading, setSubLoading, mySub, setMysub, enrollment }) {
    const handleRefresh = async () => {
        setSubLoading(true);
        const solRef = doc(firestore, enrollment, problemType);
        const solSnap = await getDoc(solRef);

        if (solSnap.exists()) {
            const sortByTime = (a, b) => {
                const timeA = new Date(a.time.seconds * 1000 + a.time.nanoseconds / 1e6);
                const timeB = new Date(b.time.seconds * 1000 + b.time.nanoseconds / 1e6);

                return timeB - timeA;
            };

            let arr = solSnap.data().Submission.sort(sortByTime);
            setMysub(arr);
        }
        setSubLoading(false);
    }

    useEffect(() => {
        handleRefresh();
    }, [])

    return (
        <div className='overflow-scroll h-full flex flex-col place-items-start justify-start p-4 space-y-2 pb-14 w-full'>
            <div className='flex space-x-2 place-items-center justify-end w-full'>
                <div className='flex space-x-2 place-items-center justify-end w-fit cursor-pointer' onClick={() => { handleRefresh() }}>
                    <span className={`${subLoading && 'animate-spin'}`}><LuRefreshCcw fontSize={19} /></span>
                    <span className='text-semibold text-sm'>Refresh</span>
                </div>
            </div>
            {!subLoading && mySub.length > 0 && <table className='text-sm text-left text-stone-300 dark:text-stone-400 w-full'>
                <thead className='text-s uppercase text-stone-300 border-b'>
                    <tr>
                        <th scope='col' className='pl-1 pr-2 py-3 w-0 font-medium'>
                            Status
                        </th>
                        <th scope='col' className='px-2 py-3 w-0 font-medium'>
                            Lang
                        </th>
                        <th scope='col' className='px-2 py-3 w-0 font-medium'>
                            Code
                        </th>
                        <th scope='col' className='px-4 py-3 w-0 font-medium'>
                            Time (IST)
                        </th>
                    </tr>
                </thead>


                <tbody className='text-white'>
                    {
                        mySub.map((sub, index) => {
                            const milliseconds = sub.time.seconds * 1000 + sub.time.nanoseconds / 1e6;
                            const dateObj = new Date(milliseconds);
                            const dateAndTime = dateObj.toLocaleString();
                            return (
                                <tr className={`${index % 2 == 1 ? 'bg-gray-600' : ''} text-sm`} key={index}>
                                    <th className={`pl-1 pr-2 py-2 font-medium whitespace-nowrap ${sub.Status == "Accepted" ? "text-green-500" : "text-red-500"} `}>
                                        {sub.Status}
                                    </th>
                                    <td className='px-2 py-2'>
                                        {sub.lang}
                                    </td>
                                    <td className={`px-2 py-2 first-letter:uppercase font-medium`}>
                                        <span className='text-blue-300 cursor-pointer'>View</span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        {dateAndTime}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>}
            {!subLoading && mySub.length == 0 && <div className='w-full flex place-items-center justify-center'><span><sup>*</sup>No submission found</span></div>}
            {subLoading && (
                <div className='row-span-3 w-full'>
                    {Array.from({ length: 4 }, (_, index) => (
                        <QuestionSkeleton key={index} theme={"dark"} />
                    ))}
                </div>
            )}
        </div>
    )
}

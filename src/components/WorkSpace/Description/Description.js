import React, { useEffect, useState } from 'react'
import { LuTags } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiFillDislike, AiFillLike, AiOutlineLoading3Quarters } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { auth, firestore } from '@/firebase/firebase';
import { doc, getDoc, runTransaction } from 'firebase/firestore';


export default function Description({ loading, ProblemMetaData, ProblemData, setProblemData }) {
    const [viewTopic, setViewTopic] = useState(false);
    const { liked, disliked, setData } = useGetUserInfoOnProblem(ProblemData.Id);
    const [user] = useAuthState(auth);
    const [updating, setUpdating] = useState(false);
    const [solved, setSolved] = useState(false);

    function useGetUserInfoOnProblem(ProblemId) {
        const [data, setData] = useState({ liked: false, disliked: false });
        const [user] = useAuthState(auth);
        useEffect(() => {
            const getUserData = async () => {
                const userRef = doc(firestore, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const { likedProblems, dislikedProblems, solvedProblems } = userData;
                    setData({
                        liked: likedProblems.includes(ProblemId),
                        disliked: dislikedProblems.includes(ProblemId),
                    })
                    if(solvedProblems.includes(ProblemId))
                        setSolved(true);
                }
            }

            if (user) getUserData();
            return () => setData({ liked: false, disliked: false});
        }, [ProblemId, user])

        return { ...data, setData };
    }

    const handleLike = async () => {
        if (!user) {
            toast.error("Oops it seems you are not logged in !!")
            return;
        }

        if (updating)
            return;

        setUpdating(true);
        try {
            await runTransaction(firestore, async (transaction) => {
                const userRef = doc(firestore, 'users', user.uid);
                const problemRef = doc(firestore, 'Problem', ProblemData.Id);

                const userSnap = await transaction.get(userRef);
                const problemSnap = await transaction.get(problemRef);

                if (userSnap.exists() && problemSnap.exists()) {
                    if (liked) {
                        transaction.update(userRef, {
                            likedProblems: userSnap.data().likedProblems.filter((id) => { id != ProblemData.Id })
                        })

                        transaction.update(problemRef, {
                            likes: problemSnap.data().likes - 1
                        })

                        setProblemData(prev => ({ ...prev, likes: prev.likes - 1 }))
                        setData(prev => ({ ...prev, liked: false }))
                    } else if (disliked) {
                        transaction.update(userRef, {
                            likedProblems: [...userSnap.data().likedProblems, ProblemData.Id],
                            dislikedProblems: userSnap.data().dislikedProblems.filter((id) => { id != ProblemData.Id })
                        })

                        transaction.update(problemRef, {
                            likes: problemSnap.data().likes + 1,
                            dislikes: problemSnap.data().dislikes - 1
                        })

                        setProblemData(prev => ({ ...prev, likes: prev.likes + 1, dislikes: prev.dislikes - 1 }));
                        setData(prev => ({ liked: true, disliked: false }))
                    } else {
                        transaction.update(userRef, {
                            likedProblems: [...userSnap.data().likedProblems, ProblemData.Id]
                        })
                        transaction.update(problemRef, {
                            likes: problemSnap.data().likes + 1
                        })

                        setProblemData(prev => ({ ...prev, likes: prev.likes + 1 }))
                        setData(prev => ({ ...prev, liked: true }))
                    }
                }
            })
        } catch (e) {
            toast.error("Network Error.");
        }
        setUpdating(false);
    }

    const handleDislike = async () => {
        if (!user) {
            toast.error("Oops it seems you are not logged in !!")
            return;
        }

        if (updating)
            return;

        setUpdating(true);
        try {
            await runTransaction(firestore, async (transaction) => {
                const userRef = doc(firestore, 'users', user.uid);
                const problemRef = doc(firestore, 'Problem', ProblemData.Id);

                const userSnap = await transaction.get(userRef);
                const problemSnap = await transaction.get(problemRef);

                if (userSnap.exists() && problemSnap.exists()) {
                    if (disliked) {
                        transaction.update(userRef, {
                            dislikedProblems: userSnap.data().dislikedProblems.filter((id) => { id != ProblemData.Id })
                        })

                        transaction.update(problemRef, {
                            dislikes: problemSnap.data().dislikes - 1
                        })

                        setProblemData(prev => ({ ...prev, dislikes: prev.dislikes - 1 }))
                        setData(prev => ({ ...prev, disliked: false }))
                    } else if (liked) {
                        transaction.update(userRef, {
                            dislikedProblems: [...userSnap.data().dislikedProblems, ProblemData.Id],
                            likedProblems: userSnap.data().likedProblems.filter((id) => { id != ProblemData.Id })
                        })

                        transaction.update(problemRef, {
                            dislikes: problemSnap.data().dislikes + 1,
                            likes: problemSnap.data().likes - 1
                        })

                        setProblemData(prev => ({ ...prev, likes: prev.likes - 1, dislikes: prev.dislikes + 1 }));
                        setData(prev => ({ liked: false, disliked: true }))
                    } else {
                        transaction.update(userRef, {
                            dislikedProblems: [...userSnap.data().dislikedProblems, ProblemData.Id]
                        })
                        transaction.update(problemRef, {
                            dislikes: problemSnap.data().dislikes + 1
                        })

                        setProblemData(prev => ({ ...prev, dislikes: prev.dislikes + 1 }))
                        setData(prev => ({ ...prev, disliked: true }))
                    }
                }
            })
        } catch (e) {
            toast.error("Network issue.");
        }
        setUpdating(false);
    }


    const difficultyColor = ProblemMetaData.difficulty == "easy" ? 'text-green-500' : ProblemMetaData.difficulty == "medium" ? "text-yellow-400" : "text-red-500";

    return (
        <>
            {
                loading ? <div className='h-full flex flex-col place-items-start justify-start py-2 px-4 space-y-2 '>Loading</div> :
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
                                    <div className="bg-slate-600 p-0.5 px-3 rounded-xl first-letter:uppercase">{topic}</div>
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

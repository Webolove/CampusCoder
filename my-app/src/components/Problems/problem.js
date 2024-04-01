import { auth, firestore } from '@/firebase/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineCircle } from "react-icons/md";
import { AiFillYoutube } from "react-icons/ai";
import Link from 'next/link';
import QuestionSkeleton from '@/components/skeleton/QuestionSkeleton';
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import SDECarousel from './SDECarousel';
import { IoFilter } from "react-icons/io5";

export default function problem() {
    const [userSolvedProblem, setUserSolvedProblem] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user] = useAuthState(auth);
    const [problem, setProblem] = useState([]);
    const [visibleProblem, setVisibleProblem] = useState([]);
    const [selectedSlide, setSelectedSlide] = useState(0);
    const flickityRef = useRef(null);
    const [SDEQuestions, setSDEquestions] = useState([]);
    const [userType, setUserType] = useState("");

    const handleSlideChange = (index) => {
        setSelectedSlide(index)
    }

    useEffect(() => {
        if (selectedSlide == 0)
            setVisibleProblem(problem);
        else {
            let arr = [];
            problem.forEach((question) => {
                if (SDEQuestions[selectedSlide - 1].problems.includes(question.Id))
                    arr.push(question);
            })
            console.log(arr)
            setVisibleProblem(arr);
        }
    }, [selectedSlide])

    useEffect(() => {
        async function getProblmes() {
            setLoading(true);
            const problemRef = collection(firestore, "AllProblems");
            const problemSnap = await getDocs(problemRef);

            const uniqueProblems = new Set();

            problemSnap.forEach((doc) => {
                uniqueProblems.add(doc.data());
            });

            const problemsArray = [...uniqueProblems];

            problemsArray.sort((a, b) => {
                const OrderA = a.Order;
                const OrderB = b.Order;
                if (OrderA < OrderB) return -1;
                if (OrderA > OrderB) return 1;
                return 0;
            });

            setProblem(problemsArray);
            setVisibleProblem(problemsArray)
            setLoading(false);

            // Get SDE sheets

            const SDERef = collection(firestore, "SDE");
            const SDESnap = await getDocs(SDERef);

            const uniqueSDE = new Set();
            SDESnap.forEach((doc) => {
                uniqueSDE.add(doc.data());
            })

            const questions = [...uniqueSDE];
            setSDEquestions(questions);
        }
        getProblmes();

    }, []);

    useEffect(() => {
        async function getUserSolved() {
            if (user) {
                const userRef = doc(firestore, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    if(userData.userType == "Mentee")
                        setUserSolvedProblem([...userData.solvedProblems]);
                    setUserType(userData.userType);
                }
            }
        }
        getUserSolved();
    }, [user])


    return (
        <section className='h-fit w-full max-w-[1300px] mx-auto'>
            {userType == "Mentee" ? <div className='overflow-x-auto relative grid grid-rows-4 grid-flow-col gap-4 px-6 pb-10'>
                {/* Grid 1 */}
                <div className=' row-span-1 col-span-3 w-full py-4 w-full'>
                    <h2 className='text-3xl text-slate-700 font-bold mb-4'>Select Sheet</h2>
                    {SDEQuestions.length > 0 ?
                        (<div className='rounded-lg flex place-items-center justify-between px-2'>
                            <div onClick={() => { flickityRef.current.previous(); }} className='cursor-pointer'>
                                <CiCircleChevLeft fontSize={42} />
                            </div>
                            <SDECarousel flickityRef={flickityRef} onSlideChange={handleSlideChange}>
                                <div className='min-w-[300px] h-full bg-sky-100 rounded-2xl flex place-items-center justify-center p-6'>
                                    <h2 className='text-2xl text-slate-700 font-bold'>All Problems</h2>
                                </div>
                                {
                                    SDEQuestions.map((Sheet, idx) => {
                                        return (
                                            <div className='min-w-[300px] h-full bg-sky-100 rounded-2xl flex place-items-center justify-center p-6' key={idx}>
                                                <h2 className='text-2xl text-slate-700 font-bold'>{Sheet.title}</h2>
                                            </div>
                                        )
                                    })
                                }
                            </SDECarousel>
                            <div onClick={() => { flickityRef.current.next(); }} className='cursor-pointer'>
                                <CiCircleChevRight fontSize={42} />
                            </div>
                        </div>) : (<div className='h-[185px] flex place-items-center justify-center'>
                            <div class="custom-loader"></div>
                        </div>)
                    }
                </div>

                {/* Grid 2 */}
                <div className='row-span-3 col-span-3 min-h-[700px]'>
                    <div className='py-6 flex w-full'>
                        <h2 className='text-2xl text-slate-700 font-bold'>{selectedSlide == 0 ? "All Problems" :
                            <> {SDEQuestions[selectedSlide - 1].title}</>}</h2>
                    </div>
                    <table className='text-sm text-left text-gray-500 dark:text-gray-400 w-full'>
                        <thead className='text-s uppercase text-slate-700 border-b'>
                            <tr>
                                <th scope='col' className='px-1 py-3 w-0 font-medium'>
                                    Status
                                </th>
                                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                    Title
                                </th>
                                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                    Difficulty
                                </th>
                                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                    Solution
                                </th>
                            </tr>
                        </thead>


                        {!loading && <tbody className='text-white Ubuntu'>
                            {
                                visibleProblem.map((question, index) => {
                                    const difficultyColor = question.difficulty == "easy" ? 'text-green-500' : question.difficulty == "medium" ? "text-yellow-400" : "text-red-500";
                                    const videoLink = "";

                                    return (
                                        <tr className={`${index % 2 == 1 ? 'bg-gray-100' : ''}`} key={question.Id}>
                                            <th className='px-2 py-4 font-medium whitespace-nowrap text-green-500'>
                                                {user && (userSolvedProblem.includes(question.Id)) ? <FiCheckCircle fontSize={"21"} width="21" /> : <MdOutlineCircle fontSize={"21"} width="21" />}
                                            </th>
                                            <td className='px-6 py-4'>
                                                <Link href={`/problems/${question.Id}`} className='hover:text-blue-600 cursor-pointer text-black font-medium'>
                                                    {question.title}
                                                </Link>
                                            </td>
                                            <td className={`px-6 py-4 ${difficultyColor} first-letter:uppercase font-medium`}>
                                                {question.difficulty}
                                            </td>
                                            <td className='px-6 py-4'>
                                                {
                                                    videoLink == "" ? (<p className='text-gray-400'>Coming Soon</p>) : (<><AiFillYoutube fontSize={"25"} width="25" className='hover:text-red-600 transition ease-in cursor-pointer' /></>)
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>}
                    </table>
                    {loading && (
                        <div className='row-span-3'>
                            {Array.from({ length: 7 }, (_, index) => (
                                <QuestionSkeleton key={index} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Grid 3 */}
                <div className='row-span-4 max-h-[800px] min-h-screen p-2'>
                    <div className='w-full h-full rounded-xl bg-white shadow hover:shadow-xl transition-all p-6 flex flex-col'>
                        <div className='flex place-items-center justify-between'>
                            <h4 className='font-bold text-[#718355] text-2xl'>Apply Filters</h4>
                            <IoFilter fontSize={25} />
                        </div>
                        <div className='w-full h-0 border border-2 border-[#718355] mt-2 mb-2'></div>
                        <div className='flex justify-end w-full'>
                            <div className='border border-2 border-rose-500 bg-white font-semibold cursor-pointer py-2 px-4 rounded-2xl'>
                                Clear
                            </div>
                        </div>

                        <div className='flex flex-col place-items-start justify-center mt-4'>
                            <div>
                                <h5 className='text-xl font-bold mb-2'>Difficulty</h5>
                                <div className='space-y-1'>
                                    <div className='flex space-x-2 text-lg place-items-center'>
                                        <input type="checkbox" name='Easy' id='Easy' value='Easy' className='cursor-pointer w-[20px] h-[20px] rounded ' />
                                        <label htmlFor="Easy" className='cursor-pointer'>Easy</label>
                                    </div>
                                    <div className='flex space-x-2 text-lg place-items-center'>
                                        <input type="checkbox" name='Medium' id='Medium' value='Medium' className='cursor-pointer w-[20px] h-[20px] rounded ' />
                                        <label htmlFor="Medium" className='cursor-pointer'>Medium</label>
                                    </div>
                                    <div className='flex space-x-2 text-lg place-items-center'>
                                        <input type="checkbox" name='Hard' id='Hard' value='Hard' className='cursor-pointer w-[20px] h-[20px] rounded ' />
                                        <label htmlFor="Hard" className='cursor-pointer'>Hard</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> :
                <div>Go BAck</div>}
        </section>
    )
}

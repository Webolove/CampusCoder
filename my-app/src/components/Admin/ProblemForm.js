import { auth, firestore } from '@/firebase/firebase';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { GoPlus } from "react-icons/go";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEraser } from "react-icons/ci";
import Animation from './Animation';

export default function ProblemForm() {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(true);
    const [totalProblem, setTotalProblem] = useState(0);

    const [countExamples, setCountExamples] = useState([1]);
    const [formData, setFormData] = useState({
        title: '', desc: '', topics: '', difficulty: '', constraints: '', testCaseInput: '', testCaseOutput: '', examples: ''
    })

    const [exampleData, setExampleData] = useState({
        input1: '', input2: '', input3: '', output1: '', output2: '', output3: '', explanation1: '', explanation2: '', explanation3: ''
    });


    const handleInputChange = (name, event) => {
        setExampleData(prevState => ({
            ...prevState,
            [name]: event.target.value
        }));
    };

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    function handleErase() {
        setFormData({
            title: '', desc: '', topics: '', difficulty: '', constraints: '', testCaseInput: '', testCaseOutput: '', examples: ''
        })
        setExampleData({
            input1: '', input2: '', input3: '', output1: '', output2: '', output3: '', explanation1: '', explanation2: '', explanation3: ''
        })
    }

    function handleDelete(index) {
        const newArr = [...countExamples];
        newArr.splice(index, 1);
        setCountExamples(newArr);

        const newExampleData = { ...exampleData };

        // Remove data related to the deleted example
        const exampleKeys = ['input', 'output', 'explanation'];
        exampleKeys.forEach((key) => {
            for (let i = index + 1; i <= countExamples.length; i++) {
                const currentKey = `${key}${i}`;
                const nextKey = `${key}${i + 1}`;
                newExampleData[currentKey] = newExampleData[nextKey];
            }
            newExampleData[`${key}${countExamples.length}`] = ''
        });

        setFormData(prevFormData => {
            const updatedExamples = { ...prevFormData.examples };
            const exampleKey = `example${index + 1}`;
            delete updatedExamples[exampleKey];

            return {
                ...prevFormData,
                examples: updatedExamples
            };
        });

        setExampleData(newExampleData);
    }

    useEffect(() => {
        for (let i = 1; i <= countExamples.length; ++i) {
            const input = `input${i}`;
            const output = `output${i}`;
            const explanation = `explanation${i}`;
            if (exampleData[input] && exampleData[output]) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    examples: {
                        ...prevFormData.examples,
                        [`example${i}`]: {
                            input: exampleData[input],
                            output: exampleData[output],
                            explanation: exampleData[explanation]
                        }
                    }
                }));
            }
        }

    }, [exampleData, countExamples])

    useEffect(() => {
        async function getTotalProblems() {
            if (user) {
                const userRef = doc(firestore, "Admin", "ProblemCount");
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setTotalProblem(userSnap.data().Total);
                }
            }
        }
        getTotalProblems();
    }, [user])


    function AcceptableData() {
        if (!formData.title || !formData.desc || !formData.topics || !formData.difficulty || !formData.constraints || !formData.testCaseInput || !formData.testCaseOutput) {
            toast.error("Please fill all fields..");
            return false;
        }


        if (formData.examples == '' || Object.keys(formData.examples).length === 0) {
            toast.error("Kindly set one example.");
            return false;
        }

        let inputs = formData.testCaseInput.split(',').length - 1;
        let outputs = formData.testCaseOutput.split(',').length - 1;
        if (inputs != outputs) {
            toast.error("Please fill equal Test case Inputs and Outputs.");
            return false;
        }

        return true;
    }

    async function submitHandler(event) {
        event.preventDefault();
        setLoading(true);
        if (!AcceptableData()) {
            return;
        }

        try {
            const id = formData.title.toLowerCase().replace(/\s+/g, '-');
            const AllProblemsData = {
                Id: id,
                title: `${totalProblem + 1}. ${formData.title}`,
                topics: `${formData.topics.split(',').map(str => str.trim())}`,
                difficulty: formData.difficulty,
                Order: totalProblem
            }
            const ProblemData = {
                Id: id,
                desc: formData.desc,
                constraint: `${formData.constraints.split("$$").map(str => str.trim())}`,
                likes: 0,
                dislikes: 0,
                Examples: formData.examples,
                TestCase: formData.testCaseInput.split(',').map(str => str.trim()),
                ExpectedOutput: formData.testCaseOutput.split(',').map(str => str.trim())
            }

            const AllProblemRef = doc(firestore, "AllProblems", id);
            const ProblemRef = doc(firestore, "Problem", id);

            const batch = writeBatch(firestore);

            batch.set(AllProblemRef, AllProblemsData);

            batch.set(ProblemRef, ProblemData);

            const ProblemCountRef = doc(firestore, "Admin", "ProblemCount");

            if (update) {
                batch.set(ProblemCountRef, { "Total": totalProblem + 1 })
                setTotalProblem(totalProblem + 1)
            }

            await batch.commit()

        } catch (error) {
            toast.error(error)
        }

        setLoading(false);
        toast.success("Submitted successfully");
    }

    return (
        <div className='flex flex-col'>
            <div className='mb-4 absolute left-[-130px] top-[30px]'>
                <Animation Type={"Problem"} update={update}/>
            </div>

            <div className='flex w-full justify-between'>
                <div className='flex w-[140px] justify-between px-2 py-2 bg-[#f5f5fa] rounded-lg'>
                    <div className={`${update ? 'bg-[#fff] giveShadow' : 'cursor-pointer'} transition-all duration-300 ease-in rounded-md py-1 px-2`} onClick={() => { setUpdate(!update) }}>Add</div>
                    <div className={`${!update ? 'bg-[#fff] giveShadow' : 'cursor-pointer'} transition-all duration-300 ease-in rounded-md py-1 px-2`} onClick={() => { setUpdate(!update) }}>Update</div>
                </div>
                <button className='bg-[#fff] giveShadow w-[130px] py-1 rounded flex place-items-center justify-center cursor-pointer' onClick={handleErase}>Clear <span className='text-xl ml-2'><CiEraser /></span></button>
            </div>

            <form onSubmit={submitHandler} className='py-4'>
                <div className="flex place-items-center justify-between">
                    <label htmlFor='title' className='text-slate-600 mb-1 cursor-pointer'><strong>Title :</strong></label>
                    <input
                        type='text'
                        placeholder='e.g. Maximum Score of a Good Subarray'
                        name='title'
                        id='title'
                        value={formData.title}
                        onChange={changeHandler}
                        className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-11/12'
                    />
                </div>
                <div className='flex justify-between place-items-center mt-4'>
                    <div className="flex place-items-center justify-between w-1/2">
                        <label htmlFor='topics' className='text-slate-600 mb-1 cursor-pointer'><strong>Topics :</strong></label>
                        <input
                            type='topics'
                            placeholder='e.g. Array, Two pointers, Monotonic stack'
                            name='topics'
                            id='topics'
                            value={formData.topics}
                            onChange={changeHandler}
                            className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-9/12'
                        />
                    </div>
                    <div className="flex place-items-center justify-between w-2/5">
                        <label htmlFor='easy' className="text-slate-600 mb-1 cursor-pointer"><strong>Difficulty :</strong></label>
                        <div className="flex place-items-center justify-between">
                            <input
                                type="radio"
                                id="easy"
                                name="difficulty"
                                value="easy"
                                checked={formData.difficulty === 'easy'}
                                onChange={changeHandler}
                                className="mr-1"
                            />
                            <label htmlFor="easy" className="mr-3">Easy</label>

                            <input
                                type="radio"
                                id="medium"
                                name="difficulty"
                                value="medium"
                                checked={formData.difficulty === 'medium'}
                                onChange={changeHandler}
                                className="mr-1"
                            />
                            <label htmlFor="medium" className="mr-3">Medium</label>

                            <input
                                type="radio"
                                id="hard"
                                name="difficulty"
                                value="hard"
                                checked={formData.difficulty === 'hard'}
                                onChange={changeHandler}
                                className="mr-1"
                            />
                            <label htmlFor="hard">Hard</label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-4">
                    <label htmlFor='desc' className='text-slate-600 mb-1 cursor-pointer'><strong>Description :</strong></label>
                    <textarea
                        type='text'
                        placeholder='e.g. You are given an array of integers <bold>nums (0-indexed)</bold> and an integer <bold>k</bold>.
                    <br/>
                    The score of a subarray (i, j) is defined as min(nums[i], nums[i+1], ..., nums[j]) * (j - i + 1). A good subarray is a subarray where i <= k <= j.
                    <br/>
                    Return the maximum possible <i>score</i> of a good subarray.'
                        name='desc'
                        id='desc'
                        value={formData.desc}
                        onChange={changeHandler}
                        className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-full resize-none'
                        rows={5}
                    ></textarea>
                </div>
                <div className="flex place-items-center justify-between mt-4">
                    <label htmlFor='constraints' className='text-slate-600 mb-1 cursor-pointer'><strong>Constraints :</strong></label>
                    <input
                        type='text'
                        placeholder='e.g. 1 <= nums.length <= 105  $$
                        1 <= nums[i] <= 2 * 104  $$
                        0 <= k < nums.length'
                        name='constraints'
                        id='constraints'
                        value={formData.constraints}
                        onChange={changeHandler}
                        className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-10/12'
                    />
                </div>
                <label htmlFor='constraints' className='text-xs cursor-pointer'><span className='text-red-800 text-base font-bold'>* </span>Constraints need to be "$$" separated.</label>

                <div className='flex flex-wrap place-items-center justify-between'>
                    {countExamples.map((example, idx) => {
                        return (<div className='flex flex-col flex-1 mt-4'>
                            <span className='text-slate-600'><b>Example {idx + 1} :</b></span>
                            <div className='w-[350px] h-fit p-4 bg-[#f5f5fa] rounded-lg mt-2 mr-2 flex flex-col'>
                                <div className='flex justify-end'>
                                    <div className={`flex place-items-center justify-center bg-white p-2 rounded ${countExamples.length == 1 ? "hidden" : "visible"}`} onClick={() => {
                                        handleDelete(idx)
                                    }}>
                                        <RiDeleteBin5Line />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex place-items-center justify-between mt-2">
                                        <label htmlFor={`input${idx + 1}`} className='mb-1 cursor-pointer'><strong>Input :</strong></label>
                                        <input
                                            type='text'
                                            placeholder='e.g. nums = [1,4,3,7,4,5], k = 3'
                                            name={`input${idx + 1}`}
                                            id={`input${idx + 1}`}
                                            value={exampleData[`input${idx + 1}`]}
                                            onChange={(event) => handleInputChange(`input${idx + 1}`, event)}
                                            className='bg-[#fff] rounded p-2 focus:outline-none w-8/12'
                                        />
                                    </div>
                                    <div className="flex place-items-center justify-between mt-2">
                                        <label htmlFor={`output${idx + 1}`} className='mb-1 cursor-pointer'><strong>Output :</strong></label>
                                        <input
                                            type='text'
                                            placeholder='e.g. 15'
                                            name={`output${idx + 1}`}
                                            id={`output${idx + 1}`}
                                            value={exampleData[`output${idx + 1}`]}
                                            onChange={(event) => handleInputChange(`output${idx + 1}`, event)}
                                            className='bg-[#fff] rounded p-2 focus:outline-none w-8/12'
                                        />
                                    </div>
                                    <div className="flex place-items-center justify-between mt-2">
                                        <label htmlFor={`explanation${idx + 1}`} className='mb-1 cursor-pointer'><strong>Explanation :</strong></label>
                                        <input
                                            type='text'
                                            placeholder='e.g. The optimal subarray is (1, 5) with a score of min(4,3,7,4,5) * (5-1+1) = 3 * 5 = 15. '
                                            name={`explanation${idx + 1}`}
                                            id={`explanation${idx + 1}`}
                                            value={exampleData[`explanation${idx + 1}`]}
                                            onChange={(event) => handleInputChange(`explanation${idx + 1}`, event)}
                                            className='bg-[#fff] rounded p-2 focus:outline-none w-8/12'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>)
                    })}
                    <div className={`flex flex-col justify-center place-items-center flex-1 h-[200px] ${countExamples.length >= 3 ? "hidden" : "visible"}`}>
                        <div className={`w-[100px] h-[100px] bg-[#f5f5fa] text-6xl text-[#d9d9f9] font-bold rounded-full flex justify-center place-items-center cursor-pointer mb-2`} onClick={() => { setCountExamples([...countExamples, countExamples.length + 1]) }}>
                            <GoPlus />
                        </div>
                        <span className='text-[#d9c9f9]'>Add more Example..</span>
                    </div>
                </div>

                <div className="flex place-items-center justify-between mt-4">
                    <label htmlFor='testCaseInput' className='text-slate-600 mb-1 cursor-pointer'><strong>Test Cases :</strong></label>
                    <input
                        type='text'
                        placeholder='e.g. 1 4 3 7 4 5 3, 5 5 4 5 4 1 1 1 0'
                        name='testCaseInput'
                        id='testCaseInput'
                        value={formData.testCaseInput}
                        onChange={changeHandler}
                        className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-10/12'
                    />
                </div>
                <label htmlFor='testCaseInput' className='text-xs cursor-pointer'><span className='text-red-800 text-base font-bold'>* </span>Test cases need to be "," separated.</label>

                <div className="flex place-items-center justify-between mt-4">
                    <label htmlFor='testCaseOutput' className='text-slate-600 mb-1 cursor-pointer'><strong>Expected outputs :</strong></label>
                    <input
                        type='text'
                        placeholder='e.g. 15, 20'
                        name='testCaseOutput'
                        id='testCaseOutput'
                        value={formData.testCaseOutput}
                        onChange={changeHandler}
                        className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-9/12'
                    />
                </div>
                <label htmlFor='testCaseOutput' className='text-xs cursor-pointer'><span className='text-red-800 text-base font-bold'>* </span>Expected outputs need to be "," separated.</label>
                <button className='mt-2 bg-blue-500 w-[130px] text-center text-white py-2 rounded cursor-pointer absolute top-4 right-6'>{loading ? <>Submiting..</> : <>Submit</>}</button>
            </form>
        </div>
    )
}
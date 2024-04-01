import React, { useState } from 'react'
import Animation from './Animation'
import toast from 'react-hot-toast';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';

export default function SDEForm({ formType }) {
    const [FormData, setFormData] = useState({
        problems: '', name: ''
    })
    const [loading, setLoading] = useState(false);

    const changeHandler = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...FormData,
            [name]: value
        })
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (!FormData.name || !FormData.problems) {
            toast.error("Kindly fill all fields.");
            return;
        }

        try {
            setLoading(true);
            let SDEProblems = FormData.problems.split(',').map(str => str.trim());
            SDEProblems = SDEProblems.map(function (problem) {
                return problem.toLowerCase().replace(/ /g, "-");
            });

            const problemRef = doc(firestore, "SDE", FormData.name);
            await setDoc(problemRef, { problems: SDEProblems, title: FormData.name });

            setLoading(false);
            toast.success("Sheet Added to list.");
            setFormData({
                problems: '', name: ''
            })
        } catch (error) {
            toast.error("OOPS!! An error occured.")
            console.log(error)
        }
    }
    return (
        <div className='flex flex-col'>
            <div className='mb-4 absolute left-[-130px] top-[30px]'>
                <Animation Type={"SDE Sheet"} update={false} />
            </div>

            <form onSubmit={submitHandler} className='py-4'>

                <div className="flex justify-between place-items-center mt-4">
                    <label htmlFor='name' className='text-slate-600 mb-1 cursor-pointer'><strong>Sheet Name :</strong></label>
                    <input
                        type='text'
                        placeholder="e.g. Striver SDE Sheet"
                        name='name'
                        id='name'
                        value={FormData.name}
                        onChange={changeHandler}
                        className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-10/12'
                    />
                </div>

                <div className="flex flex-col justify-between mt-4">
                    <label htmlFor='problems' className='text-slate-600 mb-1 cursor-pointer'><strong>Problems :</strong></label>
                    <textarea
                        type='text'
                        placeholder="e.g. Two Sum, Jump Game, ..."
                        name='problems'
                        id='problems'
                        value={FormData.problems}
                        onChange={changeHandler}
                        className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-full resize-none'
                        rows={5}
                    ></textarea>
                </div>
                <label htmlFor='problems' className='text-xs cursor-pointer'><span className='text-red-800 text-base font-bold'>* </span>Problems need to be "," separated.</label>

                <button className='mt-2 bg-blue-500 w-[130px] text-center text-white py-2 rounded cursor-pointer absolute top-4 right-6'>{loading ? <>Submiting..</> : <>Submit</>}</button>
            </form>
        </div>
    )
}

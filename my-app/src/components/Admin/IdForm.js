import React, { useState } from 'react'
import Animation from './Animation';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import toast from 'react-hot-toast';

export default function EnrollmentForm({ formType }) {
    const [loading, setLoading] = useState(false);
    const [identity, setIdentity] = useState("");

    async function submitHandler(event) {
        event.preventDefault();
        
        if(identity == ""){
            toast.error("Kindly fill atleast one ID.");
            return;
        }

        setLoading(true);
        let userIds = identity.split(',').map(String);
        userIds = userIds.map(str => str.replace(/\s/g, ''));
        const userType = formType == "Student" ? "Student" : "Teacher";

        const AdminRef = doc(firestore, "Admin", userType);
        await updateDoc(AdminRef, {
            IdNum : arrayUnion(...userIds)
        })
        setLoading(false);
        setIdentity([])
        toast.success(`${formType} Id updated successfully.`)
    }

    return (
        <div className='flex flex-col'>
            <div className='mb-4 absolute left-[-130px] top-[30px]'>
                <Animation Type={formType} update={false} />
            </div>

            <form onSubmit={submitHandler} className='py-4'>
                <div className="flex justify-between mt-4">
                    <label htmlFor='identity' className='text-slate-600 mb-1 cursor-pointer'><strong>{formType == "Student" ? "Enrollment No." : "Mentor Id"} :</strong></label>
                    <textarea
                        type='text'
                        placeholder="e.g. 12021002020017, 120210020018 .."
                        name='identity'
                        id='identity'
                        value={identity}
                        onChange={(event)=>{setIdentity(event.target.value)}}
                        className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-full resize-none'
                        rows={5}
                    ></textarea>
                </div>
                <label htmlFor='identity' className='text-xs cursor-pointer'><span className='text-red-800 text-base font-bold'>* </span>Identities need to be "," separated.</label>

                <button className='mt-2 bg-blue-500 w-[130px] text-center text-white py-2 rounded cursor-pointer absolute top-4 right-6'>{loading ? <>Submiting..</> : <>Submit</>}</button>
            </form>
        </div>
    )
}

import { auth } from '@/firebase/firebase'
import React from 'react'
import { useSignOut } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast';
import { FiLogOut } from 'react-icons/fi'

export default function LogOut() {
    const [signOut] = useSignOut(auth);
    return (
        <button className='bg-zinc-700 py-1.5 px-3 cursor-pointer rounded text-white font-bold' onClick={async () => {
            const success = await signOut();
            if (success) {
                toast.success("Logged Out")
            }
        }}>
            <FiLogOut />
        </button>
    )
}
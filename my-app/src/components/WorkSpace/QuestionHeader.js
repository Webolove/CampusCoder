"use client"
import { auth } from '@/firebase/firebase'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import LogOut from '../LogOut';
import Button from '../Auth/Button';
import { IoListSharp } from "react-icons/io5";
import Link from 'next/link';

export default function QuestionHeader() {
    const [user] = useAuthState(auth);

    return (
        <div className='w-full h-[60px] bg-[#072e33] flex place-items-center justify-between p-4 max-w-[1300px] m-auto'>
            <Link href="/problems">
                <div className='text-white tracking-wider flex justify-between gap-2 w-fit h-fit cursor-pointer place-items-center hover:bg-zinc-700 px-2 py-1 rounded-xl transition-all duration-500'> <div><IoListSharp fontSize={18} /></div> <span>All Problems</span></div>
            </Link>

            <h2 className='text-xl text-white font-extrabold'>CampusCoder</h2>

            {!user ?
                (<div className='flex place-items-center justify-between text-white w-fit space-x-4'>
                    <Button Type={"Log in"} />
                    <Button Type={"Register"} />
                </div>) :
                (<LogOut />)}

        </div>
    )
}

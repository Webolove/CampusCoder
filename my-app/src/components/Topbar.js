"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Button from './Auth/Button'
import { auth, firestore } from '@/firebase/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Logout from './LogOut'
import { doc, getDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'

export default function Topbar({ isAdmin }) {
    const [user] = useAuthState(auth);
    const [userType, setUserType] = useState("");
    useEffect(() => {
        async function getUserType() {
            if (user) {
                const userRef = doc(firestore, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setUserType(userData.userType);
                }
            }
        }
        getUserType();
    }, [user]);

    const pathName = usePathname();
    return (
        <div className='w-full h-[60px] bg-[#072e33] flex place-items-center justify-between p-4 max-w-[1300px] m-auto'>
            <div className='flex place-items-center justify-between text-white w-2/4 max-w-[500px]'>
                <h3 className='text-lg mr-2 font-bold tracking-wide'>
                    <Link href='/' className='h-[22px] flex-1 font-semibold text-white'>
                        CampusCoder
                    </Link>
                </h3>
                {!isAdmin && <div className='flex place-items-center justify-between'>
                    {userType == "Mentee" ? (<>
                        <p className='text-base w-[100px]'>
                            <Link href='/problems' className={`${pathName == '/problems' ? 'active' : ''} Underline h-[22px] flex-1 text-white font-["Montserrat"] font-thin hover:font-light transition-all duration-100`}>
                                Problems
                            </Link>
                        </p>
                        <p className='text-base w-[120px]'>
                            <Link href='/playground' className={`${pathName == '/playground' ? 'active' : ''} Underline h-[22px] flex-1 text-white font-["Montserrat"] font-thin hover:font-light transition-all duration-100`}>
                                Playground
                            </Link>
                        </p></>) : userType == "Mentor" ? (<p className='text-base w-[80px]'>
                            <Link href='/Mentee' className={`${pathName == '/Mentee' ? 'active' : ''} Underline h-[22px] flex-1 text-white font-["Montserrat"] font-thin hover:font-light transition-all duration-100`}>
                                Mentee
                            </Link>
                        </p>) : <></>}
                    <p className='text-base w-[100px]'>
                        <Link href='/discuss' className={`${pathName == '/discuss' ? 'active' : ''} Underline h-[22px] flex-1 text-white font-["Montserrat"] font-thin hover:font-light transition-all duration-100`}>
                            Discuss
                        </Link>
                    </p>
                </div>}
            </div>
            {!user ?
                (<div className='flex place-items-center justify-between text-white w-fit space-x-4'>
                    <Button Type={"Log in"} />
                    <Button Type={"Register"} />
                </div>) :
                (<Logout />)}
        </div>
    )
}

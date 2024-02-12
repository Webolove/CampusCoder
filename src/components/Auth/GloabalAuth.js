"use client"
import { authModelState } from '@/atoms/authModelAtom'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import Login from './Login';
import SignUp from './SignUp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import Forget from './Forget';

export default function GloabalAuth() {
    const authModel = useRecoilValue(authModelState);
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (user) router.push('/');
        if (!loading && !user) setPageLoading(false);
        if (error) toast.error(error.message);
    }, [user, router, loading, error])

    return (
        <>
            {!pageLoading &&
                <section className='flex bg-[#f0f0f5]'>
                    <div className='relative w-2/3 h-screen overflow-hidden'>
                        <div className='absolute top-[-10px] left-[-133px] bg-[#006494] w-full h-full rotate-6 scale-125'></div>
                        <div className='absolute top-0 flex w-full h-full flex-col justify-center px-5'>
                            <div className="shadows">
                                <span>C</span>
                                <span>a</span>
                                <span>m</span>
                                <span>p</span>
                                <span>u</span>
                                <span>s</span>
                                <span>C</span>
                                <span>o</span>
                                <span>d</span>
                                <span>e</span>
                                <span>r</span>
                                <span>.</span>
                            </div>
                            <p className='text-white text-2xl'>Learn. Discuss. &#60;/&#62;Code. </p>
                        </div>
                    </div>
                    <div className='w-2/4 h-screen flex place-items-center px-4'>
                        <div className='w-[450px] font-["ubuntu"]'>
                            {authModel.type == "login" ? <Login /> : authModel.type == "signUp" ? <SignUp /> : <Forget />}
                        </div>
                    </div>
                </section>}
        </>
    )
}

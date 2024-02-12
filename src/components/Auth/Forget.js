"use client"
import { authModelState } from '@/atoms/authModelAtom';
import { auth } from '@/firebase/firebase';
import React, { useEffect, useState } from 'react'
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';

export default function Forget() {
    const [email, setEmail] = useState('');
    const setRecoilState = useSetRecoilState(authModelState);

    function authHandler(authType) {
        setRecoilState((prev) => ({ ...prev, type: authType }));
    }

    const [sentPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

    async function sumbitHandler(event) {
        event.preventDefault();
        const success = await sentPasswordResetEmail(email);
        if (success)
            toast.success("Mail sent.");
    }

    useEffect(() => {
        if (error)
            toast.error(error.message.split("/")[1])
    }, [error])

    return (
        <div className="flex flex-col">
            <div className='mb-4'>
                <h1 className='text-3xl font-bold'>Forgot your Password ?</h1>
                <p className='text-sm w-4/5 mt-1'> Don't worry.. Enter your email address below, and we&apos;ll send you an email allowing you to reset it.</p>
            </div>
            <form className='my-2 rounded-lg p-4 bg-[#fff] w-4/5' onSubmit={sumbitHandler}>
                <div className="flex flex-col">
                    <label htmlFor='email' className='mb-1'>Email address :</label>
                    <input
                        type='email'
                        placeholder='Email'
                        name='email'
                        id='email'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        required
                        className='bg-[#f5f5fa] rounded p-2 focus:outline-none  w-full'
                    />
                </div>

                <button className='mt-2 bg-blue-500 w-full text-center text-white py-2 rounded cursor-pointer'>
                    {!sending ? <>Reset password</> : <>Sending mail..</>}
                </button>
            </form>
            <p className='text-base'>Don't have an account? <span className='text-blue-500 cursor-pointer' onClick={() => authHandler('signUp')}>Register Here.</span></p>
        </div>
    )
}

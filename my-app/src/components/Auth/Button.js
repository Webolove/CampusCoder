import { authModelState } from '@/atoms/authModelAtom'
import Link from 'next/link'
import React from 'react'
import { useSetRecoilState } from 'recoil'

export default function Button({ Type }) {
    const setRecoilState = useSetRecoilState(authModelState);
    function authHandler(authType) {
        setRecoilState((prev) => ({ ...prev, type: authType }));
    }
    return (
        <Link href="/auth" className=''>
            <button className='px-2.5 py-1 rounded-md bg-gradient-to-r from-[#6da5c0] to-[#294d61] tracking-wide font-light' onClick={() => authHandler(`${Type == "Register" ? "signUp" : "login"}`)}>
                {Type}
            </button>
        </Link>
    )
}

"use client"
import { authModelState } from '@/atoms/authModelAtom';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { FiEyeOff, FiEye } from 'react-icons/fi';
import { useSetRecoilState } from 'recoil';

export default function Login() {
  const [show, setShow] = useState(false);
  const setRecoilState = useSetRecoilState(authModelState);
  function authHandler(authType) {
    setRecoilState((prev) => ({ ...prev, type: authType }));
  }

  const [formData, setFormData] = useState({
    email: '', password: ''
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  async function sumbitHandler(event) {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      toast("Please fill all field", {
        icon: "🙄"
      })
      return;
    }

    try {
      const newUser = await signInWithEmailAndPassword(formData.email, formData.password);
      if (!newUser)
        return;
      else {
        router.push("/");
        toast.success("Welcome Back", { position: "bottom" });
      }
    } catch (error) {
      toast.error("Looks like an error occured.",
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
    }
  }

  useEffect(() => {
    if (error) toast.error(error.message.split("/")[1].replace(").", "."));
  }, [error])

  return (
    <div className="flex flex-col">
      <div className='mb-4'>
        <h1 className='text-3xl font-bold'>Sign In</h1>
        <p className='text-base'>Log into your account</p>
      </div>
      <form className='my-2 rounded-lg p-4 bg-[#fff] w-4/5' onSubmit={sumbitHandler}>
        <div className="flex flex-col">
          <label htmlFor='email' className='mb-1'>Email address :</label>
          <input
            type='email'
            placeholder='Email'
            name='email'
            id='email'
            value={formData.email}
            onChange={changeHandler}
            className='bg-[#f5f5fa] rounded p-2 focus:outline-none  w-full'
          />
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor='password' className='mb-1'>Password :</label>
          <div className='relative'>
            <input
              type={show ? "text" : "password"}
              placeholder='password'
              name='password'
              id='password'
              value={formData.password}
              onChange={changeHandler}
              className='bg-[#f5f5fa] rounded p-2 focus:outline-none w-full'
            />
            <p className='absolute top-0 right-0 translate-x-[-50%] translate-y-2/4 cursor-pointer'>
              {
                show ? (<FiEye onClick={() => setShow(!show)} />) : (<FiEyeOff onClick={() => setShow(!show)} />)
              }
            </p>
          </div>
        </div>
        <p className='text-blue-500 text-sm mt-1 cursor-pointer' onClick={() => authHandler('forget')}>
          Forgot Password ?
        </p>

        <button className='mt-2 bg-blue-500 w-full text-center text-white py-2 rounded cursor-pointer'>
          {loading ? <>Logging in..</> : <>Log in</>}
        </button>
      </form>
      <p className='text-base'>Don't have an account? <span className='text-blue-500 cursor-pointer' onClick={() => authHandler('signUp')}>Register Here.</span></p>
    </div>

  )
}

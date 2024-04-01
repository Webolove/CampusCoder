import { authModelState } from '@/atoms/authModelAtom';
import React, { useEffect, useState } from 'react'
import { FiEyeOff, FiEye } from 'react-icons/fi';
import { useSetRecoilState } from 'recoil';
import { auth, firestore } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';

export default function SignUp() {
  const [show, setShow] = useState(false);
  const [student, setStudent] = useState(true);
  const [userIdRecords, setUserIdRecords] = useState([]);

  const setRecoilState = useSetRecoilState(authModelState)
  const authHandler = (authType) => {
    setRecoilState((prev) => ({ ...prev, type: authType }))
  }

  const [formData, setFormData] = useState({
    email: '', name: '', IdNo: '', password: ''
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    async function getAcceptableUserId() {

      const userRef = doc(firestore, "Admin", `${student ? 'Student' : 'Teacher'}`);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserIdRecords(userData.IdNum);
      }
    }
    getAcceptableUserId();

  }, [student]);

  const router = useRouter();
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

  async function sumbitHandler(event) {
    event.preventDefault();

    if (!formData.email || !formData.name || !formData.IdNo || !formData.password) {
      toast("Please fill all fields", {
        icon: "🙄"
      })
      return;
    }

    if (formData.password.length < 6) {
      toast('Password too small.',
        {
          icon: '🗝️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      return;
    }

    if (!userIdRecords.includes(formData.IdNo.replace(/\s/g, ""))) {
      toast.error(`Oops, it seems ${student ? "Enrollment " : "Mentor "}id is not found.`);
      return;
    }


    try {
      const newUser = await createUserWithEmailAndPassword(formData.email, formData.password);
      let newuserData;

      if (!newUser)
        return;

      else if (student) {
        newuserData = {
          u_id: newUser.user.uid,
          email: newUser.user.email,
          displayName: formData.name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          likedProblems: [],
          dislikedProblems: [],
          starredProblems: [],
          solvedProblems: [],
          enrollment: formData.IdNo,
          score: 0,
          mentor: "",
          groupName: "",
          userType: 'Mentee'
        };

        const AllstudentRef = doc(firestore, "users", newUser.user.uid);
        const studentRef = doc(firestore, formData.IdNo, "others");

        const batch = writeBatch(firestore);
        batch.set(AllstudentRef, newuserData);
        batch.set(studentRef, {
          userId: newUser.user.uid,
          mentor: "",
          groupName: ""
        })
        await batch.commit();
      }
      else if (!student) {
        newuserData = {
          u_id: newUser.user.uid,
          email: newUser.user.email,
          displayName: formData.name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          mentee: {},
          problemsOfTheDay: {},
          userType: 'Mentor'
        };
        await setDoc(doc(firestore, "users", newUser.user.uid), newuserData);
      }

      let updatedRecords = [];
      if (userIdRecords)
        updatedRecords = userIdRecords.filter(id => id != formData.IdNo);
      await setDoc(doc(firestore, "Admin", `${student ? 'Student' : 'Teacher'}`), {
        IdNum: updatedRecords
      });

      router.push('/')
      toast.success("Account Created");

    }
    catch (error) {
      toast.error("Looks like an error occured.");
    }

  }

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error])


  return (
    <div className="flex flex-col">
      <div className='mb-2'>
        <h1 className='text-3xl font-bold'>Register</h1>
        <p className='text-base'>Create your account</p>
      </div>
      <div className='flex w-[160px] justify-between px-2 py-2 bg-[#e5e1e1] rounded-lg'>
        <div className={`${student ? 'bg-blue-500 text-white' : 'cursor-pointer'} rounded-md py-1 px-2`} onClick={() => { setStudent(!student) }}>Student</div>
        <div className={`${!student ? 'bg-blue-500 text-white' : 'cursor-pointer'} rounded-md py-1 px-2`} onClick={() => { setStudent(!student) }}>Teacher</div>
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
            className='bg-[#f5f5fa] rounded p-2 focus:outline-none  w-full mb-1'
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor='name' className='mb-1'>Your Name :</label>
          <input
            type='name'
            placeholder='Name'
            name='name'
            id='name'
            value={formData.name}
            onChange={changeHandler}
            className='bg-[#f5f5fa] rounded p-2 focus:outline-none  w-full mb-1'
          />
        </div>
        {student ? (<div className="flex flex-col">
          <label htmlFor='IdNo' className='mb-1'>Enrollment No. :</label>
          <input
            type='IdNo'
            placeholder='e.g 12021002020017'
            name='IdNo'
            id='IdNo'
            value={formData.IdNo}
            onChange={changeHandler}
            className='bg-[#f5f5fa] rounded p-2 focus:outline-none  w-full mb-1'
          />
        </div>) : (<div className="flex flex-col">
          <label htmlFor='IdNo' className='mb-1'>Mentor Id. :</label>
          <input
            type='IdNo'
            placeholder='e.g 12021002020017'
            name='IdNo'
            id='IdNo'
            value={formData.IdNo}
            onChange={changeHandler}
            className='bg-[#f5f5fa] rounded p-2 focus:outline-none  w-full mb-1'
          />
        </div>)}
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

        <button className='mt-3 bg-blue-500 w-full text-center text-white py-2 rounded cursor-pointer'>
          {loading ? <>Creating Account..</> : <>Create Account</>}
        </button>
      </form>
      <p className='text-base'>Already have an account? <span className='text-blue-500 cursor-pointer' onClick={() => authHandler('login')}>Sign in.</span></p>
    </div>

  )
}
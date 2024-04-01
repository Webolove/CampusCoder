"use client"
import QuestionHeader from '@/components/WorkSpace/QuestionHeader'
import WorkSpace from '@/components/WorkSpace/WorkSpace'
import { auth, firestore } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';

export default function page({ params }) {
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
  return (
    <>
    {userType == "Mentee" ? <section className='bg-slate-700 h-screen' >
      <QuestionHeader />
      <WorkSpace problemType={params.pid} />
    </section> : <div>Go Back</div>}
    </>
  )
}

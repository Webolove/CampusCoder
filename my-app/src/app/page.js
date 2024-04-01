"use client"
import Topbar from '@/components/Topbar'
import { auth, firestore } from '@/firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {

    const getUserData = async () => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.userType != "Admin")
            setIsAdmin(false);

          else
            router.push("/admin");
        }
      }
    }

    getUserData();

  }, [user])

  return (
    <section>
      <Topbar isAdmin={isAdmin} />
      <div>Some info</div>
    </section>
  )
}

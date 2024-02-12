"use client"
import Admin from '@/components/Admin/Admin';
import Topbar from '@/components/Topbar';
import { auth, firestore } from '@/firebase/firebase'
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function page() {
    const [user] = useAuthState(auth);
    const [pageLoading, setPageLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {

        async function getUserType() {
            if (user) {
                const userRef = doc(firestore, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    if (userData.userType == "Admin")
                        setPageLoading(false);
                    else {
                        router.push("/");
                        return;
                    }
                }
            }
        }
        getUserType();
    }, [user]);


    return (
        <div>
            <Topbar isAdmin={true} />
            {!pageLoading && <Admin />}
        </div>
    )
}

import React, { useState } from 'react'
import { auth, firestore } from '@/firebase/firebase';
import { Timestamp, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function SubmitBtn({ formType, setSelectedTab, userCode, setOutput, setCodeError, AllTestCase, AllExpectedOP, enrollment, problemType, setExecuting, setSolved }) {
    const [user] = useAuthState(auth);

    const handleSubmit = async () => {
        setExecuting(true);

        let size = AllTestCase.length;

        let flag = "ACC";
        for (let i = 0; i < size; ++i) {
            if (flag == "NOTACC")
                break;

            let testCase = AllTestCase[i];
            try {
                await fetch('http://localhost:8000/compile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: userCode, language: formType, input: testCase }),
                }).then(response => {
                    if (!response.ok) {
                        setCodeError(true);
                    } else
                        setCodeError(false);
                    return response.json();
                }).then(async (data) => {
                    {
                        if (data.hasOwnProperty('error')) {
                            setCodeError(true);
                            await updateSubmission(data.error);
                            setOutput(`At TestCase: ${i + 1}/${size}\n` + testCase + '\n' + data.error + '\n' + data.message);
                            flag = "NOTACC";
                        }
                        else {
                            if (data.output !== AllExpectedOP[i]) {
                                setCodeError(true);
                                flag = "NOTACC";
                                await updateSubmission("Wrong Answer");
                                setOutput('At TestCase: \n' + testCase + '\nWrong Answer\n' + 'Output: ' + data.output + '\nExpected: ' + AllExpectedOP[i]);
                            }
                        }
                    }
                }).catch(error => {
                    console.error('Fetch error:', error);
                });
            } catch (error) {
                console.log("Error Occured: ", error);
            }
        }
        if (flag == "ACC") {
            setOutput("All TestCases Passed..");
            await updateSubmission("Correct Submission");
            setSolved(true);
            if(user){
                const userRef = doc(firestore, "users", user.uid);
                await updateDoc(userRef, {
                    solvedProblems: arrayUnion(problemType)
                })
            }
        }

        setExecuting(false);
    }

    const updateSubmission = async (status) => {
        let userRef = doc(firestore, enrollment, problemType);
        let userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            await updateDoc(userRef, {
                Submission: arrayUnion({
                    Code: userCode,
                    Status: status,
                    lang: formType,
                    time: Timestamp.fromDate(new Date())
                })
            })
        } else {
            await setDoc(userRef, {
                Submission: [{
                    Code: userCode,
                    Status: status,
                    lang: formType,
                    time: Timestamp.fromDate(new Date())
                }]
            })
        }
    }
    return (
        <div className='w-fit px-2 py-1 bg-zinc-600 hover:bg-zinc-500 shadow-lg shadow-gray-700 transition-all duration-300 rounded-xl cursor-pointer' onClick={async () => { setSelectedTab("Output"); await handleSubmit(); }}>
            Submit
        </div>
    )
}

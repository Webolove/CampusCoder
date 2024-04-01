import React, { useEffect, useState } from 'react'
import { TbFileDescription } from "react-icons/tb";
import { GrHistory } from "react-icons/gr";
import { MdOutlineOutput } from "react-icons/md";
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/firebase';
import Description from './Description/Description';
import Submission from './Submission/Submission';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import Output from './Output/Output';

export default function ProblemDesc({ problemType, themeType, selectedTab, setSelectedTab, output, codeError, setCustomInput, setAllExpectedOP, setAllTestCases, enrollment, setEnrollment, solved, setSolved, executing }) {
  const [ProblemMetaData, setProblemMetaData] = useState({});
  const [ProblemData, setProblemData] = useState({});
  const [loading, setLoading] = useState(true);
  const tabs = ["Description", "Submissions", "Output"];

  // Description
  const [viewTopic, setViewTopic] = useState(false);
  const { liked, disliked, setData } = useGetUserInfoOnProblem(ProblemData.Id);
  const [user] = useAuthState(auth);
  const [updating, setUpdating] = useState(false);

  function useGetUserInfoOnProblem(ProblemId) {
    const [data, setData] = useState({ liked: false, disliked: false });
    const [user] = useAuthState(auth);
    useEffect(() => {
      const getUserData = async () => {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setEnrollment(userData.enrollment); // for submission part

          const { likedProblems, dislikedProblems, solvedProblems } = userData;
          setData({
            liked: likedProblems.includes(ProblemId),
            disliked: dislikedProblems.includes(ProblemId),
          })
          if (solvedProblems.includes(ProblemId))
            setSolved(true);
        }
      }

      if (user) getUserData();
      return () => setData({ liked: false, disliked: false });
    }, [ProblemId, user])

    return { ...data, setData };
  }

  const handleLike = async () => {
    if (!user) {
      toast.error("Oops it seems you are not logged in !!")
      return;
    }

    if (updating)
      return;

    setUpdating(true);
    try {
      await runTransaction(firestore, async (transaction) => {
        const userRef = doc(firestore, 'users', user.uid);
        const problemRef = doc(firestore, 'Problem', ProblemData.Id);

        const userSnap = await transaction.get(userRef);
        const problemSnap = await transaction.get(problemRef);

        if (userSnap.exists() && problemSnap.exists()) {
          if (liked) {
            transaction.update(userRef, {
              likedProblems: userSnap.data().likedProblems.filter((id) => { id != ProblemData.Id })
            })

            transaction.update(problemRef, {
              likes: problemSnap.data().likes - 1
            })

            setProblemData(prev => ({ ...prev, likes: prev.likes - 1 }))
            setData(prev => ({ ...prev, liked: false }))
          } else if (disliked) {
            transaction.update(userRef, {
              likedProblems: [...userSnap.data().likedProblems, ProblemData.Id],
              dislikedProblems: userSnap.data().dislikedProblems.filter((id) => { id != ProblemData.Id })
            })

            transaction.update(problemRef, {
              likes: problemSnap.data().likes + 1,
              dislikes: problemSnap.data().dislikes - 1
            })

            setProblemData(prev => ({ ...prev, likes: prev.likes + 1, dislikes: prev.dislikes - 1 }));
            setData(prev => ({ liked: true, disliked: false }))
          } else {
            transaction.update(userRef, {
              likedProblems: [...userSnap.data().likedProblems, ProblemData.Id]
            })
            transaction.update(problemRef, {
              likes: problemSnap.data().likes + 1
            })

            setProblemData(prev => ({ ...prev, likes: prev.likes + 1 }))
            setData(prev => ({ ...prev, liked: true }))
          }
        }
      })
    } catch (e) {
      toast.error("Network Error.");
    }
    setUpdating(false);
  }

  const handleDislike = async () => {
    if (!user) {
      toast.error("Oops it seems you are not logged in !!")
      return;
    }

    if (updating)
      return;

    setUpdating(true);
    try {
      await runTransaction(firestore, async (transaction) => {
        const userRef = doc(firestore, 'users', user.uid);
        const problemRef = doc(firestore, 'Problem', ProblemData.Id);

        const userSnap = await transaction.get(userRef);
        const problemSnap = await transaction.get(problemRef);

        if (userSnap.exists() && problemSnap.exists()) {
          if (disliked) {
            transaction.update(userRef, {
              dislikedProblems: userSnap.data().dislikedProblems.filter((id) => { id != ProblemData.Id })
            })

            transaction.update(problemRef, {
              dislikes: problemSnap.data().dislikes - 1
            })

            setProblemData(prev => ({ ...prev, dislikes: prev.dislikes - 1 }))
            setData(prev => ({ ...prev, disliked: false }))
          } else if (liked) {
            transaction.update(userRef, {
              dislikedProblems: [...userSnap.data().dislikedProblems, ProblemData.Id],
              likedProblems: userSnap.data().likedProblems.filter((id) => { id != ProblemData.Id })
            })

            transaction.update(problemRef, {
              dislikes: problemSnap.data().dislikes + 1,
              likes: problemSnap.data().likes - 1
            })

            setProblemData(prev => ({ ...prev, likes: prev.likes - 1, dislikes: prev.dislikes + 1 }));
            setData(prev => ({ liked: false, disliked: true }))
          } else {
            transaction.update(userRef, {
              dislikedProblems: [...userSnap.data().dislikedProblems, ProblemData.Id]
            })
            transaction.update(problemRef, {
              dislikes: problemSnap.data().dislikes + 1
            })

            setProblemData(prev => ({ ...prev, dislikes: prev.dislikes + 1 }))
            setData(prev => ({ ...prev, disliked: true }))
          }
        }
      })
    } catch (e) {
      toast.error("Network issue.");
    }
    setUpdating(false);
  }
  // End Description

  // Submission
  const [subLoading, setSubLoading] = useState(true);
  const [mysub, setMysub] = useState([]);
 
  useEffect(() => {
    async function getSubmission() {
      if (enrollment) {
        setSubLoading(true);
        const solRef = doc(firestore, enrollment, problemType);
        const solSnap = await getDoc(solRef);

        if (solSnap.exists()) {
          const sortByTime = (a, b) => {
            const timeA = new Date(a.time.seconds * 1000 + a.time.nanoseconds / 1e6);
            const timeB = new Date(b.time.seconds * 1000 + b.time.nanoseconds / 1e6);

            return timeB - timeA;
          };

          let arr = solSnap.data().Submission.sort(sortByTime);
          setMysub(arr);
        }
        setSubLoading(false);
      }
    }
    getSubmission();
  }, [enrollment])


  // End submission

  useEffect(() => {
    async function getProblemInfo(problemType) {
      setLoading(true);
      const allProblemRef = doc(firestore, "AllProblems", problemType);
      const allProblemSnap = await getDoc(allProblemRef);

      if (allProblemSnap.exists()) {
        setProblemMetaData(allProblemSnap.data());
      }

      const ProblemRef = doc(firestore, "Problem", problemType);
      const problemSnap = await getDoc(ProblemRef);

      if (problemSnap.exists()) {
        setProblemData(problemSnap.data());
      }
      setLoading(false);
    }
    getProblemInfo(problemType);
  }, [problemType]);

  useEffect(()=>{
    if(ProblemData.hasOwnProperty('TestCase')){
      setAllExpectedOP(ProblemData.ExpectedOutput);
      setAllTestCases(ProblemData.TestCase);
      setCustomInput(ProblemData.TestCase[0]);
    }
  }, [ProblemData])

  return (
    <div className='p-2'>
      <div className={`overflow-hidden rounded-xl text-white w-full h-full ${themeType == "Copilot" ? "bg-[#232b2e]" : themeType == "Github-Dark" ? "bg-[#0d1117]" : themeType == "Solarized" ? "bg-[#012b37]" : "bg-[#1e1f1f]"}`}>

        <div className='flex place-items-center justify-start space-x-2 p-2 w-full bg-stone-900 overflow-hidden'>
          {
            tabs.map((tab, idx) => {
              return (
                <div className='flex space-x-2 place-items-center' key={idx}>
                  <div className={`${selectedTab == tab ? "text-white font-semibold" : "text-slate-400"} cursor-pointer flex space-x-2 place-items-center justify-center`} onClick={() => { setSelectedTab(tab) }}>
                    <div>
                      {idx == 0 && <TbFileDescription color='skyblue' fontSize={21} />}
                      {user && idx == 1 && <GrHistory color='yellow' />}
                      {idx == 2 && <MdOutlineOutput color='orange' fontSize={19} />}
                    </div>
                    <span className={`${idx != 1 || user ? "visible" : "hidden"}`}>
                      {tab}
                    </span>
                  </div>

                  {
                    !user && (idx != 1 && idx != 2) && <div className='h-[20px] w-[1px] border border-zinc-300'>
                    </div>
                  }

                  {
                    user && idx != 2 && <div className='h-[20px] w-[1px] border border-zinc-300'>
                    </div>
                  }
                </div>
              )
            })
          }
        </div>

        <div className='w-full h-full overflow-scroll'>
          {selectedTab == "Description" ? <Description loading={loading} ProblemMetaData={ProblemMetaData} ProblemData={ProblemData} viewTopic={viewTopic} setViewTopic={setViewTopic} liked={liked} disliked={disliked} updating={updating} solved={solved} handleDislike={handleDislike} handleLike={handleLike} />

            : selectedTab == "Submissions" ? <Submission problemType={problemType} subLoading={subLoading} setSubLoading={setSubLoading} mySub={mysub} setMysub={setMysub} enrollment={enrollment} />

              : <Output testCase={ProblemData.TestCase} testResult={ProblemData.ExpectedOutput} output={output} codeError={codeError} setCustomInput={setCustomInput} executing={executing} />}
        </div>
      </div>
    </div>
  )
}

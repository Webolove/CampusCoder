import React, { useEffect, useState } from 'react'
import { TbFileDescription } from "react-icons/tb";
import { GrHistory } from "react-icons/gr";
import { MdOutlineOutput } from "react-icons/md";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import Description from './Description/Description';

export default function ProblemDesc({ problemType, themeType, selectedTab, setSelectedTab }) {
  const [ProblemMetaData, setProblemMetaData] = useState({});
  const [ProblemData, setProblemData] = useState({});
  const [loading, setLoading] = useState(true);
  const tabs = ["Description", "Submissions", "Output"];

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

  return (
    <div className='p-2'>
      <div className={`overflow-hidden rounded-xl text-white h-full ${themeType == "Copilot" ? "bg-[#232b2e]" : themeType == "Github-Dark" ? "bg-[#0d1117]" : themeType == "Solarized" ? "bg-[#012b37]" : "bg-[#1e1f1f]"}`}>

        <div className='flex place-items-center justify-start space-x-2 p-2 w-full bg-stone-900 overflow-hidden'>
          {
            tabs.map((tab, idx) => {
              return (
                <div className='flex space-x-2 place-items-center' key={idx}>
                  <div className={`${selectedTab == tab ? "text-white" : "text-slate-400"} cursor-pointer flex space-x-2 place-items-center justify-center`} onClick={() => { setSelectedTab(tab) }}>
                    <div>
                      {idx == 0 && <TbFileDescription color='skyblue' fontSize={21} />}
                      {idx == 1 && <GrHistory color='yellow' />}
                      {idx == 2 && <MdOutlineOutput color='orange' fontSize={19} />}
                    </div>
                    <span>
                      {tab}
                    </span>
                  </div>

                  {idx != 2 && <div className='h-[20px] w-[1px] border border-zinc-300'>
                  </div>}
                </div>
              )
            })
          }
        </div>

        {selectedTab == "Description" ? <Description loading={loading} ProblemMetaData={ProblemMetaData} ProblemData={ProblemData} setProblemData={setProblemData} /> : <>ok</>}
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import ProblemForm from './ProblemForm';
import IdForm from './IdForm'
import SDEForm from './SDEForm';
import CustomDropDown from '../CustomDropDown';

export default function Admin() {

  const [formType, setFormType] = useState("");
  const formss = ["Problem", "Student", "Mentor", "SDE Sheet"];

  useEffect(() => {
    const storedFormType = localStorage.getItem('formType');
    if (storedFormType)
      setFormType(JSON.parse(storedFormType));
  }, [])

  useEffect(() => {
    if (formType != "")
      localStorage.setItem('formType', JSON.stringify(formType))
  }, [formType])

  return (
    <div className='w-full min-h-screen p-2 flex  justify-center bg-[#f5f5fa]'>
      <div className='w-2/3 p-6 flex flex-col relative'>
        <div className='flex place-items-center'>
          <span className='mr-2'>Update : </span>
          <CustomDropDown formType={`${formType == "" ? "Problem" : formType}`} setFormType={setFormType} formss={formss} />
          {/* <PreferenceNav formType={`${formType == "" ? "Problem" : formType}`} setFormType={setFormType} /> */}
        </div>
        <div className=' bg-white rounded-lg p-6 mt-6'>
          {(formType == "Problem" || formType == "") ? <ProblemForm /> : formType == "SDE Sheet" ? <SDEForm /> : <IdForm formType={formType} />}
        </div>
      </div>
    </div>
  )
}


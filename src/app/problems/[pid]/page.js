import QuestionHeader from '@/components/WorkSpace/QuestionHeader'
import WorkSpace from '@/components/WorkSpace/WorkSpace'
import React from 'react'

export default function page({ params }) {
  return (
    <section className='bg-slate-700 h-screen' >
      <QuestionHeader />
      <WorkSpace problemType={params.pid} />
    </section>
  )
}

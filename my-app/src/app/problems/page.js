"use client"
import Problem from '@/components/Problems/problem'
import Topbar from '@/components/Topbar'
import React from 'react'

export default function page({ params }) {
  return (
    <div className='bg-white h-fit'>
      <Topbar isAdmin={false} />
      <Problem />
    </div>
  )
}

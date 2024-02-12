import GloabalAuth from '@/components/Auth/GloabalAuth'
import Topbar from '@/components/Topbar'
import React from 'react'

export default function page() {
  return (
    <>
      <Topbar isAdmin={false} />
      <GloabalAuth />
    </>
  )
}

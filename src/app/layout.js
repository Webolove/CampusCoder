"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import { RecoilRoot } from 'recoil'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import { useEffect } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  useEffect(() => {
    AOS.init();
  }, [])

  return (
    <RecoilRoot>
      <html lang="en">
        <Head>
          <title>Campus Coder</title>
          <meta name='description' content='Home' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Head>

        <body className={`${inter.className}`}>
            {children}
            <Toaster />
        </body>

      </html>
    </RecoilRoot >
  )
}

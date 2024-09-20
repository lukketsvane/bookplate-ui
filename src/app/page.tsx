"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DynamicBookplateDesigner = dynamic(() => import('@/components/bookplate-designer').then(mod => mod.BookplateDesigner), {
  loading: () => <p>Loading Bookplate Designer...</p>,
  ssr: false
})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicBookplateDesigner />
      </Suspense>
    </main>
  )
}
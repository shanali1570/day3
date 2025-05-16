import React, { Suspense } from 'react'
import MicrosoftCallback from './microsoft-callback'

const page = () => {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <MicrosoftCallback />
    </Suspense>
  )
}

export default page

import React, { Suspense } from 'react'
import GoogleCallback from './google-callback'

const page = () => {
  return (
    <Suspense fallback={<div>Loading.....</div>}>
      <GoogleCallback />
    </Suspense>
  )
}

export default page

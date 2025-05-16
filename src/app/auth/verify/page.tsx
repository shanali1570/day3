import React, { Suspense } from 'react'
import VerifyCodeForm from './verify'

const page = () => {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <VerifyCodeForm/>
    </Suspense>
  )
}

export default page

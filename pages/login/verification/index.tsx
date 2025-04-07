import { VerificationContainer } from '@/containers'
import Head from 'next/head'
import { NextPage } from 'next'

const VerificationPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Подтверждение</title>
      </Head>
      <VerificationContainer />
    </>
  )
}

export default VerificationPage

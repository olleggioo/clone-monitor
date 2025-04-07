import { LoginContainer } from '@/containers'
import Head from 'next/head'
import { NextPage } from 'next'

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Вход</title>
      </Head>
      <LoginContainer />
    </>
  )
}

export default LoginPage

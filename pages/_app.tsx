import type { AppProps } from 'next/app'
import { Provider } from 'jotai'
import '@/styles/fonts.scss'
import '@/styles/global.scss'
import '@/styles/normalize.scss'
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'
import { StyledEngineProvider, createTheme } from '@mui/material/styles'
import { orange } from '@mui/material/colors'
import { memo } from 'react'
import { RefreshProvider } from '@/hoc/RefreshProvider'


function App({ Component, pageProps }: AppProps) {
  
  return (
    <>
      <Head>
        <title>Promminer</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <RefreshProvider>
        <SnackbarProvider style={{
          fontFamily: "Gilroy"
        }}>
          <StyledEngineProvider injectFirst>
            <Provider>
              <Component {...pageProps} />
            </Provider>
          </StyledEngineProvider>
        </SnackbarProvider>
      </RefreshProvider>
    </>
  )
}

export default memo(App)
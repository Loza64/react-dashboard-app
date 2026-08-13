import { Routes } from '@generouted/react-router/lazy'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { RecoilRoot } from 'recoil'
import { queryClient } from './config/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from './hooks/useTheme'

dayjs.locale('es')

function ThemedApp() {
  const { theme } = useTheme()

  return (
    <>
      <ToastContainer theme={theme} />
      <Routes />
    </>
  )
}

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ThemedApp />
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default App

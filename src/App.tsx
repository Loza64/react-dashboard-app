import { Routes } from '@generouted/react-router/lazy'
import { ConfigProvider } from "antd"
import esES from 'antd/locale/es_ES'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { antd } from './config/antd'
import AppProvider from './context/providers/AppProvider'

dayjs.locale('es')

function App() {
  return (
    <>
      <ToastContainer />
      <AppProvider>
        <ConfigProvider theme={antd} locale={esES}>
          <Routes />
        </ConfigProvider>
      </AppProvider>

    </>
  )
}

export default App

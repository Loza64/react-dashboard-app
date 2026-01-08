import { Routes } from '@generouted/react-router/lazy'
import { ConfigProvider } from "antd"
import esES from 'antd/locale/es_ES'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { antd } from './config/antd'
import { RecoilRoot } from 'recoil'

dayjs.locale('es')

function App() {
  return (
    <>
      <ToastContainer />
      <RecoilRoot>
        <ConfigProvider theme={antd} locale={esES}>
          <Routes />
        </ConfigProvider>
      </RecoilRoot>

    </>
  )
}

export default App

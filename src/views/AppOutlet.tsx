'use client'
import OutletContainer from '@/ui/outlet/OutletContainer'
import { ConfigProvider, Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import esES from 'antd/locale/es_ES'
import { getAntdTheme } from '@/config/antd'
import { useTheme } from '@/hooks/useTheme'
import SessionProvider from '@/context/providers/SessionProvider'

const AppOutlet: React.FC = () => {
  const { theme } = useTheme()

  return (
    <SessionProvider>
      <ConfigProvider theme={getAntdTheme(theme)} locale={esES}>
        <Layout className="max-h-dvh! overflow-hidden! text-[14px]">
          <OutletContainer>
            <Outlet />
          </OutletContainer>
        </Layout>
      </ConfigProvider>
    </SessionProvider>
  )
}

export default AppOutlet

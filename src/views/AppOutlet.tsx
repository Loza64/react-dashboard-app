import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import OutletContainer from 'src/ui/outlet/OutletContainer'

const AppOutlet: React.FC = () => {
  //const isMobile = useResponsive('(max-width: 768px)')
  return (
    <Layout className="max-h-dvh! overflow-hidden!  text-[14px]">
      <OutletContainer isMobile={false}>
        <Outlet />
      </OutletContainer>
    </Layout>
  )
}

export default AppOutlet

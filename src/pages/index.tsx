import { Navigate } from 'react-router-dom'
import { RoutesEnum } from '@/enum/routes..app'

export default function Index() {
  return <Navigate to={RoutesEnum.DASHBOARD} replace />
}

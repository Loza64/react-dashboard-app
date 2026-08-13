import AppOutlet from '@/views/AppOutlet'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoutesEnum } from '@/enum/routes..app'
function Main() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(RoutesEnum.DASHBOARD)
  }, [navigate])

  return <AppOutlet />
}

export default Main

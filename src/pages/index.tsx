import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppOutlet from 'src/views/AppOutlet'
function Main() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/dashboard')
  }, [navigate])

  return <AppOutlet />
}

export default Main

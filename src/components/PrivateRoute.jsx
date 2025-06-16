import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function PrivateRoute({children}) {
    const { status, user } = useAuth()

    if(!status && !user?._id) return <Navigate to='/login' replace />

    return children;
}

export default PrivateRoute

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

function PublicRoute({children}) {
    const { status, user } = useAuth()

    if(status && user?._id) return <Navigate to='/chat' replace/>

    return children;
}

export default PublicRoute

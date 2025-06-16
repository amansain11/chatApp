import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './components'
import { Chat, Login, Register } from './pages'
import { useAuth } from './context/AuthContext'

function App() {
  const {status, user} = useAuth()

  return (
    <>
      <Routes>
        {/* Root route: */}
        <Route
         path="/"
         element={
          status && user?._id ? (
            <Navigate to='/chat' />
          ) : (
            <Navigate to='/login' />
          )
         }
         />

        {/* Private chat route */}
        <Route
          path='/chat'
          element={
            <PrivateRoute>  
              <Chat />
            </PrivateRoute>
          }
        />

        {/* Public Register route */}
        <Route 
          path='/register'
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Public login route */}
        <Route 
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Wildcard route for undefined paths. Shows a 404 error */}
        <Route 
          path="*" 
          element={<p>404 Not found</p>} 
        />
      </Routes>
    </>
  )
}

export default App

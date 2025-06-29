import React, {useState, useEffect} from 'react'
import apiServices from '../../api/api'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import { Loader } from '../../components'

const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null)
    const [status, setStatus] = useState(false)

    const navigate = useNavigate()

    const register = async (data) => {
        setIsLoading(true)
        const response = await apiServices.register(data)
        setIsLoading(false)
        return response ? true : false;
    }

    const login = async (cred) => {
        setIsLoading(true)
        const {data} = await apiServices.login(cred)
        if(data){
            setUser(data.user)
            setStatus(true)
            localStorage.setItem("token", JSON.stringify(data.accessToken))
            setIsLoading(false)
            return true
        }
        else{
            setIsLoading(false)
            return false
        }
    }

    const logout = async () => {
        setIsLoading(true)
        try {
            const response = await apiServices.logout()
            if(response){
                setUser(null)
                setStatus(false)
                localStorage.clear()
                navigate("/login")
            }
        } catch (error) {
            throw error
        } finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const interceptor = apiServices.apiClient.interceptors.response.use(
            res => res,
            async err => {
                const originalRequest = err.config;

                 if (
                    err.response?.status === 401 &&
                    !originalRequest._retry &&
                    !originalRequest.url.includes('/users/refresh-token') &&
                    !originalRequest.url.includes('/users/login')
                ){
                    originalRequest._retry = true;

                    try {
                        const res = await apiServices.refreshAccessToken()
                        const newToken = res.data?.data?.accessToken
                        localStorage.setItem("token", JSON.stringify(newToken))
                        return apiServices.apiClient(originalRequest)
                    } catch (error) {
                        setUser(null)
                        setStatus(false)
                        localStorage.clear()
                        navigate('/login')
                        return Promise.reject(error)
                    }
                }

                return Promise.reject(err)
            }
        )

        return () => apiServices.apiClient.interceptors.response.eject(interceptor)
    },[]) 

    useEffect(() => {
        setIsLoading(true)
        try {
            ;(async ()=>{
                const {data} = await apiServices.getCurrentUser()
                if(data?._id){
                    setUser(data)
                    setStatus(true)
                }
            })()
        } catch (error) {
            throw error
        } finally{
            setIsLoading(false)
        }
    },[])

    return (
        <AuthContext.Provider value={{user, status, register, login, logout}}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    )
}


export default AuthProvider

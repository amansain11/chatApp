import { createContext, useContext, useEffect, useState } from 'react'
import apiServices from '../api/api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext({
    status: false,
    user: null,
    register: async ()=>{},
    login: async ()=>{},
    logout: async ()=>{},
})

const useAuth = () => useContext(AuthContext)

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
        const response = await apiServices.logout()
        if(response){
            setUser(null)
            setStatus(false)
            navigate("/login")
        }
        setIsLoading(false)
    }

    useEffect(() => {
        setIsLoading(true)
        ;(async ()=>{
            const {data} = await apiServices.getCurrentUser()
            if(data?._id){
                setUser(data)
                setStatus(true)
            }
        })()
        setIsLoading(false)
    },[])

    return (
        <AuthContext.Provider value={{user, status, register, login, logout}}>
            {isLoading ? 'loading...' : children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider, useAuth}
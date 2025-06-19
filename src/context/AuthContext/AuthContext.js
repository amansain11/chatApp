import { createContext, useContext} from 'react'

const AuthContext = createContext({
    status: false,
    user: null,
    register: async ()=>{},
    login: async ()=>{},
    logout: async ()=>{},
})

const useAuth = () => useContext(AuthContext)

export {AuthContext, useAuth}
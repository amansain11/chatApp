import {createContext, useContext} from "react"

const SocketContext = createContext({
    socket: null,
})

const useSocket = () => useContext(SocketContext)

export {SocketContext, useSocket}
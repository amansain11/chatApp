import React, { useEffect, useState } from 'react'
import { SocketContext } from "./socketContext";
import io from 'socket.io-client'
import config from '../../config/config';

const getSocket = () =>{
    const token = JSON.parse(localStorage.getItem("token"))

    return io(config.socketulr, {
        withCredentials: true,
        auth:{token}
    })
}

function SocketProvider({children}) {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        setSocket(getSocket)
    },[])

  return (
    <SocketContext.Provider value={{socket}}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider;

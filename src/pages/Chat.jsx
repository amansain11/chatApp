import React, { useState } from 'react'
import {Button, Input, AddChatModal} from '../components'
import { useAuth } from '../context/AuthContext'

function Chat() {
  const [openAddChat, setOpenAddChat] = useState(false) //change it to default: false
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [loadingChats, setLoadingChats] = useState(false)

  const { logout } = useAuth()

  const getChats = () => {}
  return (
    <>
      {openAddChat && 
        <AddChatModal 
          open={openAddChat}
          onClose={() => setOpenAddChat(false)}
          onSuccess={() => getChats()}
        />
      }

      <div className="w-full justify-between items-stretch h-screen flex flex-shrink-0">
        <div className="w-1/3 relative ring-white overflow-y-auto px-4">
          <div className="z-10 w-full sticky top-0 bg-dark py-4 flex justify-between items-center gap-4">
            <Button
              className='rounded-xl border-none bg-purple-400 hover:bg-purple-600 text-white py-4 px-5 flex flex-shrink-0'
              onClick={logout}
            >
              Log Out
            </Button>
            <Input
              placeholder="Search user of group..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value.toLowerCase())}
            />
            <Button
              className='rounded-xl border-none bg-indigo-400 hover:bg-indigo-600 text-white py-4 px-5 flex flex-shrink-0'
              onClick={() => setOpenAddChat(true)}
            >
              + Add chat
            </Button>
          </div>
          {loadingChats ? (
            <div className='flex justify-center items-center h-[calc(100%-88px)]'>
              {/* Typing component comes here*/}
            </div>
          ) : ("")}
        </div>
        <div className="w-2/3 border-l-[0.1px] border-zinc-700">
        </div>
      </div>
    </>
  )
}

export default Chat

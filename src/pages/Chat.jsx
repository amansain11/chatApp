import React, { useEffect, useRef, useState } from 'react'
import {Button, Input, AddChatModal, Typing, ChatItem} from '../components'
import { useAuth } from '../context/AuthContext'
import apiServices from '../api/api'
import { getChatObjectMetadata } from '../utils'

function Chat() {
  const [openAddChat, setOpenAddChat] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [loadingChats, setLoadingChats] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState([])
  const [chats, setChats] = useState([])
  const [message, setMessage] = useState("")

  const currentChat = useRef(null)

  const { user, logout } = useAuth()

  const getChats = async () => {
    setLoadingChats(true)
    const result = await apiServices.getUserChats()
    if(result) setChats(result.data || [])
    setLoadingChats(false)
  }

  const getMessages = async () => {}

  useEffect(() => {
    getChats()

    const _currentChat = JSON.parse(localStorage.getItem("currentChat"))

    if(_currentChat){
      currentChat.current = _currentChat;
    }
  },[])

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
              <Typing />
            </div>
          ) : (
            [...chats]
            .filter((chat) =>
              localSearchQuery
                ? getChatObjectMetadata(chat, user)
                  .title?.toLocaleLowerCase()
                  ?.includes(localSearchQuery)
                : true // If there's no localSearchQuery, include all chats
            )
            .map((chat) => {
              return (
                <ChatItem 
                 key={chat._id}
                 chat={chat}
                 isActive={chat._id === currentChat.current?._id}
                 unreadCount={
                  unreadMessages.filter((n) => n.chat === chat._id).length
                 }
                 onClick={(chat) => {
                  if(
                    currentChat.current?._id && 
                    currentChat.current?._id === chat._id
                  ) return

                  localStorage.setItem("currentChat", JSON.stringify(chat))
                  currentChat.current = chat
                  setMessage("")
                  getMessages()
                 }}
                 onChatDelete={(chatId) => {
                   setChats((prev) => 
                    prev.filter((chat) => chat._id !== chatId)
                   )

                   if(currentChat.current?._id === chatId){
                     currentChat.current = null
                     localStorage.removeItem("currentChat")
                   }
                 }}
                />
              ) 
            })
          )}
        </div>
        <div className="w-2/3 border-l-[0.1px] border-zinc-700">
        </div>
      </div>
    </>
  )
}

export default Chat

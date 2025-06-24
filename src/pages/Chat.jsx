import React, { useEffect, useRef, useState } from 'react'
import {Button, Input, AddChatModal, Typing, ChatItem, MessageItem} from '../components'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import apiServices from '../api/api'
import { getChatObjectMetadata } from '../utils'
import { ArrowLeftStartOnRectangleIcon, PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/20/solid'

const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const NEW_CHAT_EVENT = "newChat";
const JOIN_CHAT_EVENT = "joinChat";
const LEAVE_CHAT_EVENT = "leaveChat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const MESSAGE_DELETE_EVENT = "messageDeleted";
const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
// const SOCKET_ERROR_EVENT = "socketError";

function Chat() {
  const { user, logout } = useAuth()
  const { socket } = useSocket()

  const currentChat = useRef(null)

  const [openAddChat, setOpenAddChat] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [loadingChats, setLoadingChats] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState([])
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([]) // to store chat all messages
  const [message, setMessage] = useState("") // to store currently typed message
  const [attachedFiles, setAttachedFiles] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const getChats = async () => {
    setLoadingChats(true)
    const result = await apiServices.getUserChats()
    if(result) setChats(result.data || [])
    setLoadingChats(false)
  }

  const getMessages = async () => {

  }

  const deleteChatMessage = async (message) => {}

  const handleOnMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const sendChatMessage = async () => {}

  useEffect(() => {
    getChats()

    const _currentChat = JSON.parse(localStorage.getItem("currentChat"))

    if(_currentChat){
      currentChat.current = _currentChat;

      socket?.emit(JOIN_CHAT_EVENT, _currentChat.current?._id)

      getMessages()
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
          {currentChat.current && currentChat.current?._id ? (
            <>
              <div className='p-4 sticky top-0 bg-[#212328] z-20 flex justify-between items-center w-full border-b-[0.1px] border-[#2e333d]'>
                <div className='flex justify-start items-center w-max gap-3'>
                  {currentChat.current.isGroupChat ? (
                    <div className='w-12 relative h-12 flex-shrink-0 flex justify-start items-center flex-nowrap'>
                      {currentChat.current.participants
                        .slice(0, 3)
                        .map((participant, i) => {
                          return (
                            <img 
                              key={participant._id}
                              src={participant.avatar.url}
                              className={`w-9 h-9 border-[1px] border-white rounded-full absolute outline-4 outline-[#212328]
                                ${i === 0 
                                    ? "left-0 z-30"
                                    : i === 1
                                    ? "left-2 z-20"
                                    : i === 2
                                    ? "left-4 z-10"
                                    : ""
                                }
                              `}
                            />
                          )
                        })
                      }
                    </div>
                  ) : (
                    <img
                      className='h-14 w-14 rounded-full flex flex-shrink-0 object-cover'
                      src={ getChatObjectMetadata(currentChat.current, user).avatar }
                    />
                  )}
                  <div>
                    <p className='font-bold'>
                      { getChatObjectMetadata(currentChat.current, user).title }
                    </p>
                    <small className='text-zinc-400'>
                      { getChatObjectMetadata(currentChat.current, user).description }
                    </small>
                  </div>
                </div>
              </div>
              <div
               className={`p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full
                 ${attachedFiles.length > 0 
                    ? "h-[calc(100vh-336px)]"
                    : "h-[calc(100vh-176px)]"
                 }
               `}
               id="message-window"
              >
                {loadingMessages ? (
                  <div className='flex justify-center items-center h-[calc(100% - 88px)]'>
                    <Typing />
                  </div>
                ) : (
                  <>
                    {isTyping ? <Typing /> : null}
                    {messages?.map((msg) => {
                      return (
                        <MessageItem 
                          key={msg._id}
                          isOwnMessage={msg.sender?._id === user?._id}
                          isGroupChatMessage={currentChat.current?.isGroupChat}
                          message={msg}
                          deleteChatMessage={deleteChatMessage}
                        />
                      )
                    })}
                  </>
                )}
              </div>
              {attachedFiles.length > 0 ? (
                <div className='grid gap-4 grid-cols-5 p-4 justify-start max-w-fit'>
                  {attachedFiles.map((file, i) => {
                    return (
                      <div 
                        key={i}
                        className='group w-32 h-32 relative aspect-square rounded-xl cursor-pointer'
                      >
                        <div className='absolute inset-0 flex justify-center items-center w-full h-full bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150'>
                          <Button
                            className='absolute -top-2 -right-2'
                            onClick={() => {
                              setAttachedFiles(
                                attachedFiles.filter((_, ind) => ind !== i)
                              )
                            }}
                          >
                            <XMarkIcon className='h-6 w-6 text-white'/>
                          </Button>
                        </div>
                        <img 
                          className='h-full rounded-xl w-full object-cover'
                          src={URL.createObjectURL(File)} 
                          alt="attachment" 
                        />
                      </div>
                    )
                  })}
                </div>
              ) : null}
              <div className='sticky top-full p-4 flex justify-between items-center w-full gap-2 border-t-[0.1px] border-[#2e333d]'>
                <input 
                  hidden
                  id='attachments'
                  type="file" 
                  value=""
                  onChange={(e) => {
                    if(e.target.files) setAttachedFiles([...e.target.files])
                  }}
                  multiple
                  max={5}
                />
                <label
                  htmlFor='attachments'
                  className='p-4 rounded-full bg-[#212328] hover:bg-[#2e333d]'
                >
                  <PaperClipIcon className='w-6 h-6' />
                </label>
                <Input 
                  placeholder="Message"
                  value={message}
                  onChange={handleOnMessageChange}
                  onKeyDown={(e) => {
                    if(e.key === "Enter") sendChatMessage()
                  }}
                />
                <Button
                  className='p-4 rounded-full bg-[#212328] hover:bg-[#2e333d] disabled:opacity-50'
                  onClick={sendChatMessage}
                  disabled={!message && attachedFiles.length <= 0}
                >
                  <PaperAirplaneIcon className='w-6 h-6'/>
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              No chat selected
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Chat

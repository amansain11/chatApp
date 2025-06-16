import React, { useEffect, useState } from 'react'
import {
  UserGroupIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {Button, Input, Select} from './index'
import apiServices from '../api/api';

function AddChatModal({open, onClose, onSuccess}) {
  const [users, setUsers] = useState([])
  const [creatingChat, setCreatingChat] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isGroupChat, setIsGroupChat] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupParticipants, setGroupParticipants] = useState([])

  const handleClose = () => {
    setUsers([]);
    setSelectedUserId(null)
    setIsGroupChat(false)
    setGroupName("")
    setGroupParticipants([])
    
    onClose()
  }

  const getUsers = async () => {
    const result = await apiServices.getAvailableUsers()
    if(result){
      setUsers(result.data || [])
    }
  }

  const createNewChat = async () => {
    if(!selectedUserId) return alert("Please select a user")
    
    setCreatingChat(true)

    const result = await apiServices.createUserChat(selectedUserId)

    if(result.statusCode === 200){
      setCreatingChat(false)
      alert("Chat with selected user already exists")
      return
    }
    
    onSuccess()
    handleClose()
    setCreatingChat(false)
  }

  const createNewGroupChat = async () => {
    if(!groupName) return alert("Group name is required")
    
    if(!groupParticipants.length || groupParticipants.length < 2)
      return alert("There must be at least 2 group participants")

    setCreatingChat(true)

    const result = await apiServices.createGroupChat({
      name: groupName,
      participants: groupParticipants,
    })

    if(result){
      onSuccess()
      handleClose()
    } else {
      alert('Something went wrong while creating new group chat!')
    }

    setCreatingChat(false)
  }

  useEffect(() => {
    if(!open) return
    getUsers()
  },[open])

  return (
    <div className='absolute z-15 bg-black/50 w-screen h-screen flex justify-center items-center'>
      <div className='relative transform rounded-lg bg-[rgb(33_35_36)] px-4 pb-4 pt-5 text-left shadow-xl  mb-5 m-2.5 transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6'>
        <div>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold leading-6 text-white'>
              Create chat
            </h3>
            <Button
              className='rounded-md bg-transparent text-zinc-400 hover:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2'
              onClick={() => handleClose()}
            >
              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
            </Button>
          </div>
        </div>
        <div>
          <div className='flex items-center my-5'>
            {/* Toggle switch container */}
            <div
            onClick={() => setIsGroupChat(!isGroupChat)}
            className={`${
              isGroupChat 
              ? "bg-gray-700" 
              : "bg-zinc-200"} 
              relative outline outline-white inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-0`}
            >
              {/* Toggle knob */}
              <div
                className={`${
                  isGroupChat
                   ? "translate-x-5 bg-green-500"
                   : "translate-x-0 bg-white"}
                  pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out`
                }
              />
            </div>
            <span className='ml-3 text-sm'>
              <span
                className={`${
                  isGroupChat 
                  ? "" 
                  : "opacity-40"} 
                  font-medium text-white`
                }
              >
                Is it a group chat?
              </span>
            </span>
          </div>

          {isGroupChat ? (
            <div className='my-5'>
              <Input 
               placeholder={"Enter a group name..."}
               value={groupName}
               onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          ) : null}

          <div className='my-5'>
            <Select 
              placeholder={
                isGroupChat
                ? "Select group participants..."
                : "Select a user to chat..."
              }
              value={isGroupChat ? "" : selectedUserId || ""}
              onChange={({value}) => {
                if(isGroupChat && !groupParticipants.includes(value)){
                  setGroupParticipants([...groupParticipants, value])
                } else {
                  setSelectedUserId(value)
                }
              }}
              options={users.map((user) => {
                return {
                  label: user.username,
                  value: user._id,
                }
              })}
            />
          </div>

          {isGroupChat ? (
            <div className='my-5'>
              <span
                className="font-medium text-white inline-flex items-center"
              >
                <UserGroupIcon className='h-5 w-5 mr-2'/>
                Selected participants
              </span>{" "}
              <div className="flex justify-start items-center flex-wrap gap-2 mt-3">
                {users
                  .filter((user) => 
                    groupParticipants.includes(user._id)
                  )
                  ?.map((participant) => {
                    return (
                      <div
                        className='inline-flex bg-secondary rounded-full p-2 border-[1px] border-zinc-400 items-center gap-2'
                        key={participant._id}
                      >
                        <img 
                          className='h-6 w-6 rounded-full object-cover'
                          src={participant.avatar.url}
                        />
                        <p className='text-white'>
                          {participant.username}
                        </p>
                        <XCircleIcon 
                          role='button'
                          className='w-6 h-6 hover:text-primary cursor-pointer'
                          onClick={() => {
                            setGroupParticipants(
                              groupParticipants.filter(
                                (p) => p !== participant._id
                              )
                            )
                          }}
                        />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          ) : null}
        </div>
        <div className='mt-5 flex justify-between items-center gap-4'>
          <Button
            className='w-1/2 rounded-full inline-flex flex-shrink-0 justify-center items-center text-center outline-2 outline-zinc-500 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm bg-[rgb(46_51_61)] hover:bg-[rgb(46_51_61)]/80 disabled:bg-[rgb(46_51_61)]/50 text-base px-4 py-3'
            onClick={handleClose}
            disabled={creatingChat}
          >
            close
          </Button>
          <Button
            className='w-1/2 rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm bg-indigo-400 hover:bg-indigo-400/80 disabled:bg-indigo-400/50 text-base px-4 py-3'
            onClick={isGroupChat ? createNewGroupChat : createNewChat}
            disabled={creatingChat}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddChatModal

import React, { Fragment, useEffect, useState } from 'react'
import {
    PencilIcon,
    TrashIcon,
    UserGroupIcon,
    UserPlusIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import {Button, Input, Select} from './index';
import { useAuth } from '../context/AuthContext';
import apiServices from '../api/api';

function GroupChatDetailsModal({
    open,
    onClose,
    chatId,
    onGroupDelete
}) {
  const {user} = useAuth()

  const [groupDetails, setGroupDetails] = useState(null)
  const [renamingGroup, setRenamingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [addingParticipant, setAddingParticipate] = useState(false)
  const [participantToBeAdded, setParticipantToBeAdded] = useState("")
  const [users, setUsers] = useState([])

  const handleClose = () => {
    onClose()
  }

  const getUsers = async () => {
    const {data} = await apiServices.getAvailableUsers()

    setUsers(data.length > 0 ? data : [])
  }

  const fetchGroupInformation = async () => {
    const {data} = await apiServices.getGroupInfo(chatId)

    if(data){
      setGroupDetails(data)
      setNewGroupName(data.name || "")
    }
  }

  const handleGroupNameUpdate = async () => {
    if(!newGroupName) return alert("Group name is required")
    
    const {data} = await apiServices.updateGroupName(chatId, newGroupName)
    
    if(data){
      setGroupDetails(data)
      setNewGroupName(data.name)
      setRenamingGroup(false)
      alert("Group name updated to " + data.name)
    }
  }

  const addParticipant = async () => {
    if(!participantToBeAdded) return alert("Please select a participant to add.")
    
    const {data} = await apiServices.addParticipantToGroup(chatId, participantToBeAdded)

    const updatedGroupDetails = {
      ...groupDetails,
      participants: data?.participants || []
    }

    setGroupDetails(updatedGroupDetails)
    alert("Participant added")
  }

  const removeParticipant = async (participantId) => {
    const result = await apiServices.removeParticipantFromGroup(chatId, participantId)

    if(result){
      const updatedGroupDetails = {
        ...groupDetails,
        participants: 
          (groupDetails?.participants &&
            groupDetails?.participants?.filter(
              (p) => p._id !== participantId
            )
          ) || []
      }

      setGroupDetails(updatedGroupDetails)
      alert("Participant removed")
    }
  }

  const deleteGroupChat = async () => {
    if(groupDetails?.admin !== user?._id) return alert("You are not the admin of the group")
    
    const result = await apiServices.deleteGroup(chatId)

    if(result){
      onGroupDelete(chatId)
      handleClose()
    }
  }

  useEffect(() => {
    if(!open) return

    fetchGroupInformation()
    getUsers()
  }, [open])

  return (
    <div className='fixed top-0 right-0 z-15 bg-black/50 w-screen h-screen flex justify-end items-center'>
      <div className='bg-[#2e333d] h-full w-screen max-w-2xl flex flex-col overflow-y-scroll py-6 shadow-xl'>
        <div className='px-4 sm:px-6'>
          <div className='flex items-start justify-between'>
            <div className='ml-3 flex h-7 items-center'>
              <Button
                className='relative rounded-md bg-[#2e333d] text-zinc-400 hover:text-zinc-500 focus:outline-none'
                onClick={handleClose}
              >
                <span className='absolute -inset-2.5'/>
                <span className='sr-only'>Close pannel</span>
                <XMarkIcon className='h-6 w-6' aria-hidden='true' />
              </Button>
            </div>
          </div>
        </div>
        <div className='relative mt-6 flex-1 px-4 sm:px-6'>
          <div className='flex flex-col justify-center items-start'>
            <div className='flex pl-16 justify-center items-center relative w-full h-max gap-3'>
              {groupDetails?.participants.slice(0, 3).map((p) => {
                return (
                  <img 
                    className='w-24 h-24 -ml-16 rounded-full outline-4 outline-[#2e333d]'
                    key={p._id}
                    src={p.avatar.url}
                    alt="avatar"
                  />
                )
              })}
              {groupDetails?.participants && groupDetails?.participants.length > 3 ? (
                <p>+{groupDetails?.participants.length - 3}</p>
              ) : null}
            </div>
            <div className='w-full flex flex-col justify-center items-center text-center'>
              {renamingGroup ? (
                <div className='w-full flex justify-center items-center mt-5 gap-2'>
                  <Input 
                     placeholder="Enter new group name..."
                     value={newGroupName}
                     onChange={(e) => setNewGroupName(e.target.value)}
                  />
                  <Button
                    className='rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm
                     bg-[#6b8afd] hover:bg-[#6b8afd]/80 disabled:bg-[#6b8afd]/50 text-base px-4 py-3'
                    onClick={handleGroupNameUpdate}
                  >
                    Save
                  </Button>
                  <Button
                    className='rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm
                     bg-[#2e333d] hover:bg-[#2e333d]/80 disabled:bg-[#2e333d]/50 outline-[1px] outline-zinc-400 text-base px-4 py-3'
                    onClick={() => setRenamingGroup(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className='w-full inline-flex justify-center items-center text-center mt-5'>
                  <h1 className='text-2xl font-semibold truncate-1'>
                    {groupDetails?.name}
                  </h1>
                  {groupDetails?.admin === user?._id ? (
                    <Button onClick={() => setRenamingGroup(true)}>
                      <PencilIcon className='w-5 h-5 ml-4'/>
                    </Button>
                  ) : null}
                </div>
              )}

              <p className='mt-2 text-zinc-400 text-sm'>
                Group · {groupDetails?.participants.length}{" "} participants
              </p>
            </div>
            <hr className='border-[0.1px] border-zinc-600 my-5 w-full'/>
            <div className='w-full'>
              <p className='inline-flex items-center'>
                <UserGroupIcon className='h-6 w-6 mr-2'/>{" "}
                {groupDetails?.participants.length} Participants
              </p>
              <div className='w-full'>
                {groupDetails?.participants?.map((p) => {
                  return (
                    <Fragment key={p._id}>
                      <div className='flex justify-between items-center w-full py-4'>
                        <div className='flex justify-start items-start gap-3 w-full'>
                          <img
                           className='h-12 w-12 rounded-full'
                           src={p.avatar.url} 
                          />
                          <div>
                            <p className="text-white font-semibold text-sm inline-flex items-center w-full">
                              {p.username}{" "}
                              {p._id === groupDetails.admin ? (
                                <span className='ml-2 text-[10px] px-4 bg-green-500/10 border-[0.1px] border-green-500 rounded-full text-green-500'>
                                  admin
                                </span>
                              ) : null}
                            </p>
                            <small className='text-zinc-400'>
                              {p.email}
                            </small>
                          </div>
                        </div>
                        {groupDetails.admin === user?._id ? (
                          <div>
                            <Button
                             className='rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm
                                      bg-red-500 hover:bg-red-500/80 disabled:bg-red-500/50 text-sm px-3 py-1.5'
                             onClick={() => {
                              const ok = confirm(
                                "Are you sure you want to remove " +
                                p.username +
                                " ?"
                              )
                              if(ok){
                                removeParticipant(p._id || "")
                              }
                             }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : null}
                      </div>
                      <hr className='border-[0.1px] border-zinc-600 my-1 w-full'/>
                    </Fragment>
                  )
                })}
                {groupDetails?.admin === user?._id ? (
                  <div className='w-full my-5 flex flex-col justify-center items-center gap-4'>
                    {!addingParticipant ? (
                      <Button
                        onClick={() => setAddingParticipate(true)}
                        className='rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm w-full
                          bg-[#6b8afd] hover:bg-[#6b8afd]/80 disabled:bg-[#6b8afd]/50 text-base px-4 py-3'
                      >
                        <UserPlusIcon className='w-5 h-5 mr-1'/>{" "}
                        Add participant
                      </Button>
                    ) : (
                      <div className='w-full flex justify-start items-center gap-2'>
                        <Select
                         placeholder="Select a user to add..."
                         value={participantToBeAdded}
                         options={users.map((user) => ({
                           label: user.username,
                           value: user._id
                         }))}
                         onChange={({value}) => setParticipantToBeAdded(value)}
                        />
                        <Button
                          onClick={() => addParticipant()}
                          className='rounded-full mt-2 inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm
                            bg-[#6b8afd] hover:bg-[#6b8afd]/80 disabled:bg-[#6b8afd]/50 text-base px-4 py-3'
                        >
                          + Add
                        </Button>
                        <Button
                          onClick={() => {
                            setAddingParticipate(false)
                            setParticipantToBeAdded("")
                          }}
                          className='rounded-full mt-2 inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm
                            bg-[#2e333d] hover:bg-[#2e333d]/80 disabled:bg-[#2e333d]/50 outline-[1px] outline-zinc-400 text-base px-4 py-3'
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    <Button
                      onClick={() => {
                        const ok = confirm("Are you sure you want to delete this group?")
                        if(ok){
                          deleteGroupChat()
                        }
                      }}
                      className='rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm w-full
                           bg-red-500 hover:bg-red-500/80 disabled:bg-red-500/50 text-base px-4 py-3'
                    >
                      <TrashIcon className='w-5 h-5 mr-1'/>
                      Delete group
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupChatDetailsModal

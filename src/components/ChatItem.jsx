import {
    EllipsisVerticalIcon,
    PaperClipIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React, { useState } from 'react'
import moment from 'moment'
import apiServices from "../api/api";
import { getChatObjectMetadata } from "../utils";
import { useAuth } from "../context/AuthContext";
import {Button, GroupChatDetailsModal} from './index'

function ChatItem({
    chat,
    isActive,
    unreadCount = 0, 
    onClick,
    onChatDelete,
}) {
  const { user } = useAuth()
    
  const [openOptions, setOpenOptions] = useState(false)
  const [openGroupInfo, setOpenGroupInfo] = useState(false)

  const deleteChat = async () => {
    const result = await apiServices.deleteUserChat(chat._id)
    if(result) onChatDelete(chat._id)
  }
  
  if(!chat) return

  return (
    <>
        {openGroupInfo && <GroupChatDetailsModal 
          open={openGroupInfo}
          onClose={() => {
            setOpenGroupInfo(false)
          }}
          chatId={chat._id}
          onGroupDelete={onChatDelete}
        />}
        
        <div
            role="button"
            onClick={() => onClick(chat)}
            onMouseLeave={() => setOpenOptions(false)}
            className={`
                ${isActive ? "border border-zinc-500 bg-[#2e333d]": ""}
                ${unreadCount > 0 ? "border border-green-500 bg-[rgb(74_172_104)]/20 font-bold" : ""}
                group p-4 my-2 flex justify-between gap-3 items-start cursor-pointer rounded-3xl hover:bg-[#2e333d]
            `}  
        >
            <Button 
                onClick={(e) => {
                    e.stopPropagation()
                    setOpenOptions(!openOptions)
                }}
                className="self-center p-1 relative"
            >
                <EllipsisVerticalIcon className="h-6 group-hover:w-6 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-300"/>
                <div
                  className={`
                    ${openOptions ? 'block' : 'hidden'}
                    z-20 text-left absolute bottom-0 translate-y-full text-sm w-52 bg-[#212328] rounded-2xl p-2 shadow-md border-[1px] border-[#2e333d]
                  `}
                >
                  {chat.isGroupChat ? (
                    <p
                      roll="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenGroupInfo(true)
                      }}
                      className="p-4 w-full rounded-lg inline-flex items-center hover:bg-[#2e333d]"
                    >
                        <InformationCircleIcon className="h-4 w-4 mr-2"/> 
                        About group
                    </p>
                  ) : (
                    <p
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const ok = confirm("Are you sure you want to delete this chat?")
                        if(ok) deleteChat()
                      }}
                      className="p-4 text-red-500 rounded-lg w-full inline-flex items-center hover:bg-[#2e333d]"
                    >
                        <TrashIcon className="h-4 w-4 mr-2"/>
                        Delete chat
                    </p>
                  )}
                </div>
            </Button>
            <div className="flex justify-center items-center flex-shrink-0">
               {chat.isGroupChat ? (
                  <div className="w-12 relative h-12 flex-shrink-0 flex justify-start items-center flex-nowrap">
                    {chat.participants.slice(0, 3).map((participant, i) => {
                        return (
                            <img
                               key={participant._id}
                               src={participant.avatar.url}
                               className={`
                                 ${i === 0
                                     ? "left-0 z-[3]"
                                     : i === 1
                                     ? "left-2.5 z-[2]"
                                     : i === 2
                                     ? "left-[18px] z-[1]"
                                     : ""
                                 } w-8 h-8 border-[1px] border-white rounded-full absolute outline-4 outline-[#212328] group-hover:outline-[#2e333d]
                               `}
                            />
                        )
                    })}
                  </div>
                ) : (
                    <img 
                      src={getChatObjectMetadata(chat, user).avatar}
                      className="w-12 h-12 rounded-full"
                    />
                )}
            </div>
            <div className="w-full">
                <p className="truncate-1">
                    {getChatObjectMetadata(chat, user).title}
                </p>
                <div className="w-full inline-flex items-center text-left">
                    {chat.lastMessage && chat.lastMessage.attachments.length > 0 ? (
                        // If last message is an attachment show paperclip
                        <PaperClipIcon className="text-white/50 h-3 w-3 mr-2 flex flex-shrink-0"/>
                    ) : null}
                    <small className="text-white/50 truncate-1 text-sm text-ellipsis inline-flex items-center">
                        {getChatObjectMetadata(chat, user).lastMessage}
                    </small>
                </div>
            </div>
            <div className="flex text-white/50 h-full text-sm flex-col justify-between items-end">
                <small className="mb-2 inline-flex flex-shrink-0 w-max">
                    {moment(chat.updatedAt).fromNow(true)}
                </small>
                 {/* Unread count will be > 0 when user is on another chat and there is new message in a chat which is not currently active on user's screen */}
                 {unreadCount <= 0 ? null : (
                    <span className="bg-green-500 h-2 w-2 aspect-square flex-shrink-0 p-2 text-white text-xs rounded-full inline-flex justify-center items-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                 )}
            </div>
        </div>
    </>
  )
}

export default ChatItem

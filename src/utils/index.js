export const getChatObjectMetadata = (chat, user) => {
    const lastMessage = chat.lastMessage?.content
      ? chat.lastMessage?.content
      : chat.lastMessage
        ? `${chat.lastMessage?.attachments?.length} attachment${
            chat.lastMessage.attachments.length > 1 ? "s" : ""
           }`
        : "No messages yes"
    
    if(chat.isGroupChat){
        return {
            avatar: "https://img.icons8.com/?size=100&id=K7ebDTcbruY8&format=png&color=000000",
            title: chat.name,
            description: `${chat.participants.length} members in the chat`,
            lastMessage: chat.lastMessage
              ? chat.lastMessage?.sender?.username + ": " + lastMessage
              : lastMessage
        }
    } else {
        const participant = chat?.participants?.find (
            (p) => p._id !== user?._id
        )

        return {
            avatar: participant?.avatar.url,
            title: participant?.username,
            description: participant?.email,
            lastMessage,
        }
    }
}
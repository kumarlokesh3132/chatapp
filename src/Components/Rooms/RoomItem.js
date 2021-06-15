
import React from 'react'
import TimeAgo from 'timeago-react'
import ProfileAvatar from '../DashBoard/ProfileAvatar';

const RoomItem = ({rooms}) => {
  const {createdAt, name, lastMessage} = rooms;
  return (
    <div>

      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-disappear">{name}</h3>
        <TimeAgo datetime={lastMessage ? new Date(lastMessage.createdAt): new Date(createdAt)} className="text-normal text-blact-45" /> 

      </div>
      <div className="d-flex align-items-center text-black-70">
        { lastMessage ? <>
            <div className="d-flex align-items-center">
              <ProfileAvatar src={lastMessage.author.avatar} name={lastMessage.author.name} size="sm"/>
            </div>
            <div className="text-disappear ml-2">
              <div className="italic">{lastMessage.author.name}</div>
              <span>{lastMessage.text}</span>
            </div>
        </> 
        : <span>No messages yet...</span>}
      </div>
      
    </div>
  )
}

export default RoomItem

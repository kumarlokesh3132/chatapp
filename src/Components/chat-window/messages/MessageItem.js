/* eslint-disable no-constant-condition */
import React,{memo} from 'react'
import TimeAgo from 'timeago-react'
import {Button} from 'rsuite';
import ProfileAvatar from '../../DashBoard/ProfileAvatar'
import ProfileInfoBtnModal from './ProfileInfoBtnModal'
import PresenceDot from '../../PresenceDot'
import {useCurrentRoom} from '../../../context/current-room.context'
import { auth } from '../../../misc/firebase';
import IconBtnControl from './IconBtnControl';
import { useHover, useMediaQuery} from '../../../misc/custom-hooks';


const MessageItem = ({message, handleAdmin, handleLike}) => {

  const {author, createdAt, text, likes, likesCount } = message;
  const [selfRef, isHovered] = useHover();
  const IsMobile = useMediaQuery(('(max-width: 992px)'))
  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
  const canShowIcons = IsMobile || isHovered;

  return (
    <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}
    ref={selfRef}>
     <div className="d-flex align-items-center font-bolder mb-1">
       <PresenceDot uid={author.uid}/>
        <ProfileAvatar src={author.avatar} name={author.name} className="ml-1" size="xs"/>
        <ProfileInfoBtnModal 
        profile={author}
        appearance="link" 
        className="p-0 ml-1 text-black"> 
        {canGrantAdmin && <Button block onClick={()=>{handleAdmin(author.uid)}} color="blue">
          {isMsgAuthorAdmin ? 'Remove admin Premission' : 'Make Admin'}
        </Button>}
        </ProfileInfoBtnModal>
        <TimeAgo datetime={createdAt} className="text-normal text-blact-45 ml-2" />
        <IconBtnControl 
        {...(isLiked ? {color: 'red'} : {})}
        isVisible = {canShowIcons}
        iconName = "heart"
        tooltip = "Like the message"
        onClick = {()=> handleLike(message.id)}
        badgeContent = {likesCount}/>
     </div>
     <div>
       <span className="word-break-all">{text}</span>
     </div>
    </li>
  )
}

export default memo(MessageItem)
import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router';
import { Alert } from 'rsuite'
import { auth, database } from '../../../misc/firebase'
import { transformToArray } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {

  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessage = messages && messages.length > 0;

  useEffect(() => {
    
    const messageRef = database.ref('/messages');

    messageRef.orderByChild('roomId').equalTo(chatId).on('value', (snap) => {
      const data = transformToArray(snap.val());

      setMessages(data);

    })
    
    return () => {
      messageRef.off('value');
    }

  }, [chatId])

  const handleAdmin = useCallback(
    async (uid) => {
      const adminsRef = database.ref(`room/${chatId}/admins`);
      let alertMsg;
      await adminsRef.transaction((admins) => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Admin position removed';
          } else {
            admins[uid] = true;
            alertMsg = 'Admin position granted';
          }
        }
        return admins;
    
      });
      Alert.info(alertMsg, 4000)    

    },
    [chatId],
  )

  const handleLike = useCallback(async (msgId) => {
    const messageRef = database.ref(`messages/${msgId}`);
    const {uid} = auth.currentUser;
      let alertMsg;
      await messageRef.transaction((msg) => {
        if (msg) {
          if (msg.likes && msg.likes[uid]) {
            msg.likesCount -= 1;
            msg.likes[uid] = null;
            alertMsg = 'Like removed';
          } else {
            msg.likesCount += 1;
            if(!msg.likes){
              msg.likes = {};
            }
            msg.likes[uid] = true;
            alertMsg = 'Like Added';
          }
        }
        return msg;
    
      });
      Alert.info(alertMsg, 4000)    

  },[])

  return (
    <ul className="msg-list custom-scroll">
     {isChatEmpty && <li>No messages yet</li>} 
     {canShowMessage && messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} handleLike={handleLike}/>)}
    </ul>
  )
}

export default Messages
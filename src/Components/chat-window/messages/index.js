/* eslint-disable consistent-return */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite'
import { auth, database, storage } from '../../../misc/firebase'
import { groupBy, transformToArray } from '../../../misc/helpers';
import MessageItem from './MessageItem';


const PAGE_SIZE = 15;
const messageRefer = database.ref('/messages');

function scrollToBottom(node, threshold = 30){

  const percentage = (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0 ;

  return percentage > threshold

}

const Messages = () => {

  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef(); 

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessage = messages && messages.length > 0;

  const loadMessages = useCallback((limitToLast) => {
    const node = selfRef.current;

    messageRefer.off();

    messageRefer.orderByChild('roomId').equalTo(chatId).limitToLast(limitToLast || PAGE_SIZE).on('value', (snap) => {
      const data = transformToArray(snap.val());      
      setMessages(data);
      if(scrollToBottom(node))
      node.scrollTop = node.scrollHeight;
    })

    setLimit(p => p + PAGE_SIZE)

  },[chatId])

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;   
    const oldHeight = node.scrollHeight;
    loadMessages(limit);
    setTimeout(() => {  
      const newHeight =   node.scrollHeight;
  
      node.scrollTop = newHeight - oldHeight;
    }, 600);


  }, [loadMessages, limit])

  useEffect(() => {
    const node = selfRef.current;    
    loadMessages();

    setTimeout(() => {      
      node.scrollTop = node.scrollHeight;
    }, 600);

    
    return () => {
      messageRefer.off('value');
    }

  }, [loadMessages])

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
  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if(!window.confirm('Delete this message')){
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`messages/${msgId}`] = null;

      if(isLast && messages.length > 1){
        updates[`room/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id  
        }
      }

      if(isLast && messages.length === 1){
        updates[`room/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.info('Message deleted', 4000);
      } catch (error) {
        return Alert.error(error.message, 4000);
      }


      if(file){
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (error) {
          Alert.error(error.message, 4000);
        }
      }

    },
    [chatId, messages],
  )

  const renderMessages = () => {

    const groups = groupBy(messages, (item) => new Date(item.createdAt).toDateString())

    const items = [];

    Object.keys(groups).forEach((date) => {
        items.push( <li key={date} className="text-center mb-1 padded">{date}</li>)

        const msgs = groups[date].map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} handleLike={handleLike} handleDelete={handleDelete}/>)
        items.push(...msgs)

    });
      return items;
  }

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && <li className="text-center mt-2 mb-2">
        <Button  onClick={onLoadMore} color="green">
          Load More
        </Button>
      </li>}
     {isChatEmpty && <li>No messages yet</li>} 
     {canShowMessage && renderMessages() }
    </ul>
  )
}

export default Messages
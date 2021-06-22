import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router';
import { InputGroup, Icon, Alert } from 'rsuite'
import { ReactMic } from 'react-mic'
import { storage } from '../../../misc/firebase';

const AudioMsgBtn = ({afterUpload}) => {

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploadig] = useState(false);
  const {chatId} = useParams();

  const onClick = useCallback(() => {
      setIsRecording(p => !p);
  }, [])

  const onUpload = useCallback(async (data) => {
    setIsUploadig(true);
      try {
        const snap = await storage.ref(`/chat/${chatId}`).child(`audio_${Date.now()}.mp3`).put(data.blob, { cacheControl: `public, max-age=${3600 *24 * 5}`})

        const file = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL()
        }

        setIsUploadig(false);
   
        afterUpload([file]);
      } catch (error) {
        setIsUploadig(false);
        Alert.error(error.message, 4000);
      }
  },[afterUpload, chatId])

  return (
    <InputGroup.Button onClick={onClick} disabled={isUploading} className={isRecording ? 'animate-blink' : ''}>
      <Icon icon="microphone"/>
      <ReactMic
          record={isRecording}
          className="d-none"
          onStop={onUpload}
          mimeType = "audio/mp3" />
      </InputGroup.Button>
  )
}

export default AudioMsgBtn

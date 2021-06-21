/* eslint-disable arrow-body-style */
import React, {useState} from 'react'
import { useParams } from 'react-router';
import { InputGroup, Icon, Modal, Button, Uploader, Alert } from 'rsuite'
import { useModelState } from '../../../misc/custom-hooks'
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1024 * 1024 * 5;

const AttachmentModalBtn = ({afterUpload}) => {
  const {isOpen, open, close} = useModelState();
  const [fileList, setFileList ] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {chatId} = useParams();
  const onChange = (fileArr) => {

    const filtered = fileArr.filter(el => el.blobFile.size <= MAX_FILE_SIZE).slice(0, 5);

    setFileList(filtered);
  }

  const onUpload = async () => {
      try {
        const uploadPromise = fileList.map(f => {
          return storage.ref(`/chat/${chatId}`).child( Date.now() + f.name).put(f.blobFile, { cacheControl: `public, max-age=${3600 *24 * 5}`})
        });
        const uploadSnap = await Promise.all(uploadPromise);

        const shapePromise = uploadSnap.map(async snap => {
          return{
            contentType: snap.metadata.contentType,
            name: snap.metadata.name,
            url: await snap.ref.getDownloadURL()
          }
        })

        const files = await Promise.all(shapePromise);

        await afterUpload(files);

        setIsLoading(false);
        
        close();
      } catch (error) {
        Alert.error(error.message, 4000);
      }
  }

  return (
    <>
      <InputGroup.Button onClick={open}>
      <Icon icon="attachment"/>
      </InputGroup.Button>
      <Modal  show={isOpen} onHide={close}>
        <Modal.Header>
        <Modal.Title>Attach a new file</Modal.Title>
        </Modal.Header>
        <Modal.Body><Uploader autoUpload = {false} fileList={fileList} action="" onChange={onChange} multiple disabled={isLoading} listType="picture-text" className="w-100"/></Modal.Body>
        <Modal.Footer>
          <Button block disabled={isLoading} onClick={onUpload}>
            Send 
          </Button>
          <div className="text-right mt-2">
            <small>*file size less than 5MB allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AttachmentModalBtn

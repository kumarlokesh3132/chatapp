import React, { useCallback, useRef, useState } from 'react'
import { Button, Icon, Modal, Form, FormGroup, ControlLabel, FormControl, Schema, Alert} from 'rsuite';
import firebase from 'firebase/app'
import { useModelState } from '../misc/custom-hooks';
import { database, auth } from '../misc/firebase';


const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('Room name is required'),
  description: StringType().isRequired('Room description is required'),
})

const INITIAL_FORM = {
  name: '',
  description: ''
} 


const CreateRoomBtnModal = () => {

  const { isOpen, open, close}  = useModelState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  const onFormChange = useCallback(value => {
    setFormValue(value);
  },[]);

  const onSubmit = async() => {
    if(!formRef.current.check()){
      return;
    }

    setIsLoading(true);

    const newRoomData = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      admins: {
        [auth.currentUser.uid] : true,
      }
    }

    try {

      await database.ref('room').push(newRoomData);
      Alert.info(`${formValue.name} has been created`);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
      
    } catch (error) {
      Alert.error(error.messagw, 4000)
    }

  }

  return (
    <div className="mt-1">
      <Button block color="green" onClick={open}>
        <Icon icon="creative" /> Create new Chat Room
      </Button>

      <Modal show={isOpen} hide={close}>
        <Modal.Header>
          <Modal.Title>
            New Chat-room
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formRef}>
            <FormGroup>
              <ControlLabel>Room Name</ControlLabel>
              <FormControl name="name" placeholder="Enter chat room name..." />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Room Name</ControlLabel>
              <FormControl componentClass="textarea" rows={5} name="description" placeholder="Enter room description..." />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button block appearance="primary" onClick={onSubmit} disabled={isLoading}>Create</Button>
        </Modal.Footer>
        
      </Modal>
    </div>
  )
}

export default CreateRoomBtnModal

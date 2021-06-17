import React from 'react'
import { Button, Modal } from 'rsuite'
import { useModelState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../DashBoard/ProfileAvatar';

const ProfileInfoBtnModal = ({profile, children, ...btnProps}) => {

  const {name, avatar, createdAt} = profile;
  const shortName = name.split(' ')[0];

  const memberSince = new Date(createdAt).toLocaleDateString();

  const {open, isOpen, close} = useModelState();
  return (
    <>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>
            {shortName} profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
        <ProfileAvatar src={avatar} name={name} className="height-200 width-200 img-fullsize font-huge"/>
        <h4 className="mt-2">{name}</h4>
        <p>Member since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProfileInfoBtnModal

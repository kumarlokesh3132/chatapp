import React from 'react'
import { Drawer, Button, Divider, Alert } from 'rsuite'
import { useProfile } from '../../context/profile.context'
import { database } from '../../misc/firebase'
import AvatarUploadBtn from './AvatarUploadBtn'
import EditableInput from '../EditableInput'
import ProviderBlock from './ProviderBlock'
import { getUserUpdates } from '../../misc/helpers'
// import { useMediaQuery } from '../../misc/custom-hooks'

const Dashboard = ({onSignOut}) => {

  const {profile} = useProfile();
  // const isMobile = useMediaQuery('(max-width: 992px)');

  const onSave = async newData => {

    try{
        const updates = await getUserUpdates(profile.uid, 'name', newData, database);

        await database.ref().update(updates);

        Alert.success("Nickname has been updated", 4000);
    }catch(err){
      Alert.error(err.message, 4000);

    }

  }
  
  return(


    <>
  
      <Drawer.Header>
        <Drawer.Title>
      Dashboard
        </Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <AvatarUploadBtn />
  <h3>Hi, {profile.name}</h3>
  <ProviderBlock />
  <Divider />
  <EditableInput
  name = "Nickname" 
  initialValue={profile.name}
  onSave={onSave}
  label={<h6 className="mb-2">Nickname</h6>} />
  
      </Drawer.Body>
      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}> 
          SignOut
        </Button>

      </Drawer.Footer>

      </>
    
  )
}

export default Dashboard

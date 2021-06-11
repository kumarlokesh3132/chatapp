import React from 'react';
import { Button, Icon, Drawer} from 'rsuite';
import { useModelState } from '../../misc/custom-hooks';
import Dashboard from '.';

const DashboardToggle = () => {

  const { isOpen, open, close } = useModelState()
  return(
    <>
     <Button block color="blue" onClick={open}>
       <Icon icon="dashboard"/>
       Dashboard
       </Button> 
       <Drawer show={isOpen} onHide={close} position="left">
        <Dashboard />
       </Drawer>
    </>
  )
}


export default DashboardToggle

import React, { useRef, useState, useEffect } from 'react'
import { Divider } from 'rsuite'
import DashboardToggle from './DashBoard/DashboardToggle'
import CreateRoomBtnModal from './CreateRoomBtnModal'
import ChatRoomlist from './Rooms/ChatRoomlist'

const SideBar = () => {
  const topSidebarRef = useRef();
  const [height, setHeight] = useState(0)

  useEffect(()=>{
    if(topSidebarRef.current){
      setHeight(topSidebarRef.current.scrollHeight)
    }

  },[topSidebarRef])

  return (
    <div className="h-100 pt-2">
      
    <div ref={topSidebarRef}>
    <DashboardToggle />
    <CreateRoomBtnModal />
    <Divider>Join Conversation</Divider>
    </div>
    <ChatRoomlist aboveElementHeight={height}/>

    </div>
  )
}


export default SideBar

import React  from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Nav, Loader } from 'rsuite'
import { useRoom } from '../../context/room.context'
import RoomItem from './RoomItem'

const ChatRoomlist = ({ aboveElementHeight }) => {

  const room = useRoom();
  const location = useLocation();

  return (
    <Nav appearance="subtle" vertical reversed className="overflow-y-scroll custom-scroll"
    style={{
      height: `calc(100% - ${aboveElementHeight}px)`,
    }}
    activekey={location.pathname}
  >
      {!room && <Loader center vertical content="loading" speed="slow" size="md" />}
      {room && room.length > 0 && room.map(rooms => (<Nav.Item componentClass={Link} to={`/chat/${rooms.id}`} key={rooms.id} eventKey={`/chat/${rooms.id}`}>  
        <RoomItem rooms={rooms}/>
      </Nav.Item>)
        )}
      
    </Nav>
  )
}

export default ChatRoomlist
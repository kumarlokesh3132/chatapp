import React from 'react'
import { Grid, Row, Col} from 'rsuite'
import SideBar from '../Components/SideBar'
import { RoomProvier } from '../context/room.context'

const Home = () => (
  <RoomProvier>
    <Grid fluid className="h-100">
      <Row className="h-100">
        <Col xs={24} md={8} className="h-100">
        <SideBar />
        </Col>
      </Row>
    </Grid>
    </RoomProvier>
  )


export default Home

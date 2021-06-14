import React from 'react'
import { Grid, Row, Col} from 'rsuite'
import SideBar from '../Components/SideBar'

const Home = () => (
    <Grid fluid className="h-100">
      <Row className="h-100">
        <Col xs={24} md={8} className="h-100">
        <SideBar />
        </Col>
      </Row>
    </Grid>
  )


export default Home

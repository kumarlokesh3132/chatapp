import React from 'react'
import firebase from 'firebase/app'
import {Container, Grid, Panel, Row, Col, Button, Icon, Alert} from 'rsuite'
import { auth, database} from '../misc/firebase'


const SignIn = () =>  {

  const singInwithProvider = async (provider) => {

    try{
      const {additionalUserInfo, user} =await auth.signInWithPopup(provider);
      if(additionalUserInfo.isNewUser){
        await database.ref(`profiles/${user.uid}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        })
      }
      Alert.success('Signed In')

    }catch(err){
        Alert.error(err.message, 4000)
        // eslint-disable-next-line no-console
        console.log(err.message)
    }
    
    
  };

  const onFacebook = () => {
      singInwithProvider( new firebase.auth.FacebookAuthProvider() );
  };

  const onGoogle = () => {
    singInwithProvider( new firebase.auth.GoogleAuthProvider() );
  };
  return(
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to Chat</h2>
                <p>A progressive Chat-App for beginners</p>
              </div>
              <div className="mt-3">
                <Button block color="blue" onClick={onFacebook}>
                  <Icon icon="facebook" />
                    Continue with Facebook
                </Button>
                <Button block color="green" onClick={onGoogle}>
                  <Icon icon="google" />
                  Continue with Google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  )
}


export default SignIn

import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css';
import { Switch } from 'react-router'
import './styles/main.scss';
import SignIn from './Pages/SignIn';
import PrivateRoute from './Components/PrivateRoute';
import PublicRoute from './Components/PublicRoute'
import Home from './Pages/Home';
import { ProfileProvider } from './context/profile.context';

function App() {
  return <ProfileProvider>
  <Switch>
    <PublicRoute path="/signin">
      <SignIn />
    </PublicRoute>
    <PrivateRoute path="/"> 
      <Home />
    </PrivateRoute>
  </Switch>
  </ProfileProvider>
}

export default App;

import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import OTPLogin from './components/Login/OTPLogin';
import NotFound from './components/404'
import 'bulma/css/bulma.css';

function App() {
  return (
    <div className="App">
    <Router>
      <Switch>
        <Route path="/" exact render={props => <Register {...props} />} />
        <Route path="/login" exact render={props => <Login {...props} />} />
        <Route path="/otp/login" exact component={OTPLogin} />
        <Route path='*' exact component={NotFound} />
      </Switch>
    </Router>
    </div>
  );
}

export default App;

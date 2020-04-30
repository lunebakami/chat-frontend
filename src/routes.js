import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { AuthContext, useAuth } from './context/auth';

import SignIn from './pages/SignIn';
import Chat from './pages/Chat';
import SignInAdmin from './pages/SignInAdmin';
import ChatAdmin from './pages/ChatAdmin';

function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        authTokens ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

export default function Routes() {
  const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={SignIn} />
          <PrivateRoute path="/chat" component={Chat} />
          <Route path="/signin_admin" component={SignInAdmin} />
          <PrivateRoute path="/chat_admin" component={ChatAdmin} />
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

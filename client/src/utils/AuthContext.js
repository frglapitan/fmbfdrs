import React from 'react';

const AuthContext = React.createContext({
  accessToken: null,
  role: null,
  setAccessToken: () => {},
  setRole: () => {},
});

export default AuthContext;
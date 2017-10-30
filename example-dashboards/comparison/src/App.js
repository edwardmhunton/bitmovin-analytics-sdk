import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Authenticated from './components/Authenticated.js';
import Main from './components/Main.js';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Authenticated>
          <Main>
          </Main>
        </Authenticated>
      </MuiThemeProvider>
    );
  }
}

export default App;

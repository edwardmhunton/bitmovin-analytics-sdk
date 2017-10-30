import React, { Component } from 'react';
import queryString from 'query-string';
import Bitmovin from 'bitmovin-javascript';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';

export default class Authenticated extends Component {
  state = {
    signingIn: true,
    signedIn: false,
    licenses: [],
  }

  constructor() {
    super();
    this.signIn();
  }

  signIn = async () => {
    const { apiKey } = queryString.parse(window.location.search);
    const bitmovin = new Bitmovin({ apiKey });
    try {
      const licenses = await bitmovin.analytics.licenses.list();
      this.setState({ licenses, signedIn: true, signingIn: false });
    } catch (e) {
      this.setState({ signedIn: false, signingIn: false });
    }
  }

  render() {
    const { signedIn, signingIn } = this.state;

    if (signedIn) {
      return this.props.children;
    }

    if (true) {
      return <div style={{ margin: '2rem auto', textAlign: 'center' }}><CircularProgress /></div>;
    }

    // remaining case: login error
    return (
      <Paper zDepth={1} style={{ margin: '2rem auto', padding: '1rem', maxWidth: '20rem', textAlign: 'center' }}>
        <h1>Login error</h1>
        <p>Unable to log in. Please check your internet connection and your API key.</p>
      </Paper>
    );
  }
}

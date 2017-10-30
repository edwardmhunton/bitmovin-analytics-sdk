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

  apiKey = () => queryString.parse(window.location.search).apiKey;

  signIn = async () => {
    const bitmovin = new Bitmovin({ apiKey: this.apiKey() });
    try {
      const licensesList = await bitmovin.analytics.licenses.list();
      const licenses = licensesList.items;
      this.setState({ licenses, signedIn: true, signingIn: false });
    } catch (e) {
      this.setState({ signedIn: false, signingIn: false });
    }
  }

  render() {
    const { signedIn, signingIn, licenses } = this.state;

    if (signedIn) {
      return React.Children.map(this.props.children, (child) =>
        React.cloneElement(child, { licenses, apiKey: this.apiKey() })
      );
    }

    if (signingIn) {
      return (
        <div style={{ margin: '5rem auto', textAlign: 'center' }}>
          <CircularProgress color="white" />
        </div>
      );
    }

    // remaining case: login error
    return (
      <Paper zDepth={1} style={{ margin: '2rem auto', padding: '1rem 3rem', maxWidth: '30rem', textAlign: 'center' }}>
        <h1 style={{ color: '#2EABE0' }}>Login error</h1>
        <p>Unable to log in. Please check your internet connection and your API key.</p>
      </Paper>
    );
  }
}

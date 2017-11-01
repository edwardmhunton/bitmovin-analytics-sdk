import React, { Component } from 'react';
import queryString from 'query-string';
import Bitmovin from 'bitmovin-javascript';
import { Panel } from 'react-bootstrap';
import './Authenticated.css';

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
        <div className="Authenticated-loading">
          Loading …
        </div>
      );
    }

    // remaining case: login error
    return (
      <Panel header="Login error" className="Authenticated-loginError">
        <p>Unable to log in. Please check your internet connection and your API key.</p>
      </Panel>
    );
  }
}

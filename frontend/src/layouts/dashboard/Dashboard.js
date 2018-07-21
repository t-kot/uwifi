import React, { Component } from 'react'
import { uport } from '../../util/connectors';

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    console.log(authData);

    this.buyTicket = this.buyTicket.bind(this)
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with UPort successfully.</p>
          </div>
          <div className="pure-u-1-1">
            <h1>Buy Tickets</h1>
            <div>
              <table>
                <tr>
                  <th>Plan</th>
                  <th>Price</th>
                  <th></th>
                </tr>
                <tr>
                  <td>30 Minutes Ticket</td>
                  <td>1 UWF</td>
                  <td><button onClick={this.buyTicket}>Buy</button></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </main>
    )
  }

  buyTicket() {
    const expiresIn = 30 * 60 * 1000;
    const expiresAt = Date.now() + expiresIn;
    uport.attestCredentials({
      sub: this.props.authData.address,
      claim: { 'uWifiTicket': { expiresAt } },
      exp: expiresAt,
    }).then(res => {
      console.log(res);
    });
  }
}

export default Dashboard

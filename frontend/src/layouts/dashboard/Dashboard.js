import React, { Component } from 'react'
import { uport } from '../../util/connectors';

function formatEpoch(epoch) {
  const d = new Date(epoch * 1000);
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
}

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    console.log(authData);

    this.buyTicket = this.buyTicket.bind(this)

    const tickets = this.props.authData.verified.map(elem => elem.claim.uWifiTicket).filter(ticket => ticket != null)
    this.state = { tickets }
  }

  render() {
    const { tickets } = this.state
    const itmes = [
      {
        plan: '30 Minutes Ticket (max 500MB)',
        price: '1 UWF',
      },
    ];
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
              <table className="pure-table pure-table-bordered">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  { itmes.map(item => (
                    <tr key={item.plan}>
                      <td>{item.plan}</td>
                      <td>{item.price}</td>
                      <td><button className="pure-button pure-button-primary" onClick={() => this.buyTicket()}>Buy</button></td>
                    </tr>
                  )) }
                </tbody>
              </table>
            </div>
          </div>
          <div className="pure-u-1-1">
            <h1>Available Tickets</h1>
            <div>
              <table className="pure-table pure-table-bordered">
                <thead>
                  <tr>
                    <th>Available </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    tickets.map((ticket, i) => (
                      <tr key={i}>
                        <td>{formatEpoch(ticket.startsAt)} - {formatEpoch(ticket.endsAt)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    )
  }

  buyTicket() {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 30 * 60;
    const endsAt = now + expiresIn;
    const payload = { startsAt: now, endsAt };
    
    uport.attestCredentials({
      sub: this.props.authData.address,
      claim: { 'uWifiTicket': payload },
    }).then(res => {
      const { tickets } = this.state
      tickets.push(payload)
      this.setState({ tickets })
    });
  }
}

export default Dashboard

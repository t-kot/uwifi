import React, { Component } from 'react'
import * as MNID from 'mnid';
import { uport, web3 } from '../../util/connectors';
import { abi, addressLocation } from '../../contract';
import promisify from 'util.promisify'

function formatEpoch(epoch) {
  const d = new Date(epoch * 1000);
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
}

function waitForMined(txHash, response, pendingCb, successCb) {
  if (response.blockNumber) {
    successCb()
  } else {
    pendingCb()
    pollingLoop(txHash, response, pendingCb, successCb)
  }
}

function pollingLoop(txHash, response, pendingCb, successCb) {
  setTimeout(() => {
    web3.eth.getTransaction(txHash, (err, res) => {
      if (err) throw err
      if (res === null) {
        res = { blockNumber: null }
      }
      waitForMined(txHash, res, pendingCb, successCb)
    })
  }, 1000)
}

function prepareContract() {
  const contractABI = web3.eth.contract(abi)
  const contractObj = contractABI.at(addressLocation)
  return contractObj
}

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    console.log(authData);
    console.log('decoded', MNID.decode(this.props.authData.address))

    this.buyTicket = this.buyTicket.bind(this)

    const tickets = this.props.authData.verified.map(elem => elem.claim.uWifiTicket).filter(ticket => ticket != null)
    this.state = {
      ticket: {
        loading: true,
        usable: false,
        remaining: 0,
      },
      tickets,
    }
    this.contract = prepareContract()
  }

  componentDidMount() {
    this.loadStatus()
  }

  async loadStatus() {
    const [usable, remaining] = await Promise.all([
      promisify(this.contract.ticketUsable.call)(),
      promisify(this.contract.remainingTime.call)(),
    ])

    console.log('ticketUsable', usable)
    console.log('remainingTime', remaining)
    const { ticket } = this.state
    const newTicket = Object.assign({}, ticket, { loading: false, usable, remaining })
    const newState = Object.assign({}, this.state, { ticket: newTicket })
    this.setState(newState)
  }

  render() {
    const { ticket } = this.state
    let ticketNode;
    if (ticket.loading) {
      ticketNode = <p>Loading...</p>
    } else if (ticket.usable) {
      ticketNode = <p>You already have a permission for accessing to network</p>
    } else {
      ticketNode = (
        <div>
          <p>You do not have permission.</p>
          <button className="pure-button pure-button-primary" onClick={() => this.buyTicket()}>Buy Ticket (0.01 ETH for 1 day)</button>
        </div>
      )
    }
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with UPort successfully.</p>
          </div>
          <div className="pure-u-1-1">
            <h1>Tickets</h1>
            {ticketNode}
          </div>
        </div>
      </main>
    )
  }

  buyTicket() {
    console.log('will buy ticket')
    this.contract.buyTicket({ value: web3.toWei(0.0001) }, (err, txHash) => {
      console.log(txHash)
      waitForMined(
        txHash,
        { blockNumber: null }, 
        () => {
          console.log('pending')
        },
        () => {
          console.log('success')
          this.loadStatus()
        },
      )
    })
  }
}

export default Dashboard

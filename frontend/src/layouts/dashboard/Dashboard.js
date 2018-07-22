import React, { Component } from 'react'
import * as MNID from 'mnid';
import { uport, web3 } from '../../util/connectors';
import { abi, addressLocation } from '../../contract';
import promisify from 'util.promisify'

function padZero(n, len) {
  let res = `${n}`
  for (let i=res.length; i<len; i++) {
    res = `0${res}`
  }
  return res
}

function formatTime(time) {
  const sec = time % 60
  const min = Math.floor(time / 60) % 60
  const hour = Math.floor(time / 3600)
  return `${hour}:${padZero(min, 2)}:${padZero(sec, 2)}`
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
    const decodedAddress = MNID.decode(this.props.authData.address);
    console.log('decoded', MNID.decode(this.props.authData.address))

    this.buyTicket = this.buyTicket.bind(this)
    this.handleBuySecChange = this.handleBuySecChange.bind(this)

    this.state = {
      ticket: {
        loading: true,
        remaining: 0,
      },
      balance: 0,
      buySec: 10800,
    }
    this.contract = prepareContract()

    web3.eth.getBalance(decodedAddress.address, (err, balance) => {
        if (err) {
            console.err(err);
        } else {
            this.setState({
                ...this.state,
                balance,
            });
        }
    });
  }

  componentDidMount() {
    this.loadStatus()
    window.setInterval(() => {
      const { ticket } = this.state
      if (ticket.remaining) {
        const newTicket = Object.assign({}, ticket, { remaining: ticket.remaining - 1 })
        const newState = Object.assign({}, this.state, { ticket: newTicket })
        this.setState(newState)
      }
    }, 1000)
  }

  async loadStatus() {
    const address = MNID.decode(this.props.authData.address).address
    const remaining = (await promisify(this.contract.getRemainingTimeForUser.call)(address)).toNumber();
    console.log('getRemainingTimeForUser', remaining);

    const { ticket } = this.state
    const newTicket = Object.assign({}, ticket, { loading: false, remaining })
    const newState = Object.assign({}, this.state, { ticket: newTicket })
    this.setState(newState)
  }

  handleBuySecChange(e) {
    this.setState({ ...this.setState, buySec: e.target.value })
  }

  render() {
    const { ticket } = this.state
    console.log(this.state)
    let ticketNode;

    const ticketBuyForm = (
      <form onSubmit={this.buyTicket}>
        <select value={this.state.buySec} className='pure-input-1-2 buysec-select' onChange={this.handleBuySecChange}>
          <option value={10800}>3時間</option>
          <option value={21600}>6時間</option>
          <option value={43200}>12時間</option>
          <option value={86400}>24時間</option>
        </select>
        <input type='submit' className="pure-button pure-button-primary" value='購入' />
        <p className='small'>{this.formatWeiAsEther(this.weiCostForSec(this.state.buySec), 3)}ETH</p>
      </form>
    );

    if (ticket.loading) {
      ticketNode = <p>Loading...</p>
    } else if (ticket.remaining > 0) {
      ticketNode = (
        <div>
          <p style={{ color: '#27ae60' }}>残り時間</p>
          <p className='remaining'>
            {formatTime(ticket.remaining)}
          </p>

          <p className='extend'>延長する</p>
          {ticketBuyForm}
        </div>
      )
    } else {
      ticketNode = (
        <div>
          <p style={{ color: '#c0392b' }}>利用するためには先に時間を購入してください。</p>
          {ticketBuyForm}
        </div>
      )
    }
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            現在のETH残高
            <p>{this.formatWeiAsEther(this.state.balance)}ETH</p>
          </div>
          <div className="pure-u-1-1">
            <h1>Tickets</h1>
            {ticketNode}
          </div>
        </div>
      </main>
    )
  }

  async buyTicket(e) {
    e.preventDefault();
    console.log('will buy ticket')
    const value = this.weiCostForSec(this.state.buySec);
    const txHash = await promisify(this.contract.buyTicket)({ value })
    console.log(txHash)

    {
      const { ticket } = this.state
      const newTicket = Object.assign({}, ticket, { loading: true })
      const newState = Object.assign({}, this.state, { ticket: newTicket })
      this.setState(newState)
    }

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
  }

  formatWeiAsEther(wei, n=2) {
      const ether = web3.fromWei(wei, 'ether');
      return parseFloat(ether).toFixed(n);
  }

  // n秒買うときにかかるweiを返す
  weiCostForSec(n) {
    const weiPerSec = web3.toWei(0.01, 'ether') / 86400;
    return weiPerSec * n;
  }
}

export default Dashboard

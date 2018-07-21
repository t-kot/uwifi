import React, { Component } from 'react'

class Home extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    console.log(authData)
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            Anonymous
          </div>
        </div>
      </main>
    )
  }
}

export default Home

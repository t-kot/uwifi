import React, { Component } from 'react'
import { Link } from 'react-router'

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
            <h1>uWifi とは?</h1>
            <p>
                uWifiはuPortを使ったwifiシェアリングサービスです。
                <br/>
                一度uWifiで接続するだけで、アクセスポイントが変わっても簡単に認証できます。

                <br/>
                <Link to='/login' className='pure-button'>Login</Link>
            </p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home

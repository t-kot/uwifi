import React, { Component } from 'react'

class Login extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>uWifiへようこそ</h1>
            <p>
                uWifiはuPortを使ったwifiシェアリングサービスです。
                <br/>
                uPortでログインしてチケットを購入することで、uWifiのアクセスポイントに簡単につなげることができます。
            </p>
          </div>
        </div>
      </main>
    )
  }
}

export default Login

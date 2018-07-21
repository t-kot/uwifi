import React, { Component } from 'react'
import { uportSetting } from '../../util/connectors';
import { Connect, SimpleSigner } from 'uport-connect'
import './Login.css'

const QRCode = require('qrcode.react');
const qrcode = require('qrcode-terminal');

class Login extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props

    this.state = {
      uportURI: '',
    };

    this.urlHandler = this.urlHandler.bind(this);
  }

  urlHandler(uri) {
    this.setState({ uportURI: uri });
  }

  componentDidMount() {
    const uport = new Connect('uWifi', {
      ...uportSetting,
      uriHandler: this.urlHandler,
    });

    uport.requestCredentials({
      requested: ['name', 'avatar', 'phone', 'country'],
    }).then(credentials => {
      console.log(credentials);
    });
  }

  render() {
    return (
      <main className="container login-container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>uWifiへようこそ</h1>
            <p>
              uWifiはuPortを使ったwifiシェアリングサービスです。
                <br />
              uPortでログインしてチケットを購入することで、uWifiのアクセスポイントに簡単につなげることができます。
            </p>

            <div className='qrcode'>
              {(() => {
                if (this.state.uportURI.length) {
                  return <QRCode value={this.state.uportURI} size={200} />;
                }
              })()}
            </div>

            <div className='login-button'>
              <a className="button-success pure-button button-lg" href={this.state.uportURI}>
                uPortで認証する
              </a>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Login

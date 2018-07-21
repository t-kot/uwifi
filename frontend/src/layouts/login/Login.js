import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { uportSetting } from '../../util/connectors';
import { Connect, SimpleSigner } from 'uport-connect'
import { connect } from 'react-redux'
import './Login.css'
import '../../user/ui/loginbutton/LoginButtonActions';
import { userLoggedIn } from '../../user/ui/loginbutton/LoginButtonActions';
import MobileDetect from 'mobile-detect';

const QRCode = require('qrcode.react');

class Login extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props

    this.state = {
      uportURI: '',
    };

    this.urlHandler = this.urlHandler.bind(this);
    this.requestCredentials = this.requestCredentials.bind(this);
    this.onRequestCredentials = this.onRequestCredentials.bind(this);
  }

  urlHandler(uri) {
    this.setState({ uportURI: uri });
  }

  componentDidMount() {
    const mb = new MobileDetect(window.navigator.userAgent);
    if (!mb.phone()) {
      this.requestCredentials();
    }
  }

  onRequestCredentials(e) {
    e.preventDefault();
    this.requestCredentials();
  }

  requestCredentials() {
    const uport = new Connect('uWifi', {
      ...uportSetting,
      uriHandler: this.urlHandler,
    });

    uport.requestCredentials({
      requested: ['name', 'avatar', 'phone', 'country'],
    }).then(credentials => {
      this.props.dispatch(userLoggedIn(credentials))

      return browserHistory.push('/')
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
                  return (
                    <div>
                        <QRCode value={this.state.uportURI} size={200} />
                        <p className=''>uPortアプリでQRコードを読み取ってください。</p>
                    </div>
                  ); 
                } else {
                    return (
                        <div className='login-button'>
                            <a
                                className="button-success pure-button button-lg"
                                href={this.state.uportURI}
                                onClick={this.onRequestCredentials}
                            >
                                uPortで認証する
                            </a>
                        </div>
                    )
                }
              })()}
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default connect()(Login)

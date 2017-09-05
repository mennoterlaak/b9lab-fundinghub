// React
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'

// FundingHub
import App from './App'

// Ethereum
import EthereumClient from './EthereumClientMobx'

EthereumClient.setProviders('ws://localhost:8546')
EthereumClient.setDefaults()

ReactDOM.render((
  <BrowserRouter>
    <App/>
  </BrowserRouter>
), document.getElementById('root'))

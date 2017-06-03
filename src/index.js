// React
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'

// FundingHub
import App from './App'

// Ethereum
import EthereumClient from './EthereumClientMobx'

EthereumClient.setProviders('http://127.0.0.1:8545')
EthereumClient.setDefaults()

ReactDOM.render((
  <BrowserRouter>
    <App/>
  </BrowserRouter>
), document.getElementById('root'))

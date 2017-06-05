// React
import React from 'react'
import {Link} from 'react-router-dom'

// Material UI
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'

// Ethereum
import EthereumClient from './EthereumClientMobx'

// FundingHub
import Account from './Account'

// MobX
import {observer} from 'mobx-react'

@observer
export default class AppBarProject extends React.Component {
  componentDidMount() {
    EthereumClient.web3.eth.getAccounts((err, acc) => {
      EthereumClient.web3.eth.getBalance(acc[0], (err, result) => {
        Account.balance = EthereumClient.web3.fromWei(result.toNumber(), 'ether')
      })
    })
  }
  render() {
    return (
      <AppBar title={'Account 0 = ' + Account.balance + ' ETH'} iconElementRight={<FlatButton label="New Project" containerElement={ < Link to={{ pathname: '/add' }}/>} / >}/>
    )
  }
}

// React
import React from 'react'

// Material UI
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'

// Ethereum
import EthereumClient from './EthereumClientMobx'

// FundingHub
import Account from './Account'

@observer
export default class ProjectToolbar extends React.Component {

  componentDidMount() {
    EthereumClient.web3.eth.getAccounts((err, acc) => {
      EthereumClient.web3.eth.getBalance(acc[0], (err, result) => {
        Account.balance = EthereumClient.web3.fromWei(result.toNumber(), 'ether')
      })
    })
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup></ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle text={<span> Account[0] Balance : {
            Account.balance
          } ETH </span>}/>
          <FontIcon className="muidocs-icon-custom-sort"/>
          <ToolbarSeparator/>
          <RaisedButton label="Create Project" primary={true} containerElement={<Link to={{ pathname: '/add' }}></Link>}/>
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

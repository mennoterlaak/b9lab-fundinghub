// React
import React from 'react'

// Material UI
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

// Ethereum
import EthereumClient from './EthereumClientMobx'
import Account from './Account'

// MobX
import {observer} from 'mobx-react'

@observer
export default class Project extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            fundingGoalReached: false,
        }    
    }

    tick = () => {
        var elapsed = this.state.deadline - (Math.round(new Date().getTime()/1000))
        elapsed--
        this.setState({
            elapsed: elapsed
        })
    }

    componentDidMount(){
        this.setProjectBalance()
        this.setProjectDetails()
        var intervalId = setInterval(this.tick, 1000)
        this.setState({
            intervalId: intervalId
        })
    }

    componentWillUnmount(){
        clearInterval(this.state.intervalId)
    }

    handleContribute = () => {
        EthereumClient.fundinghub.deployed().then(instance => {
            instance.contribute(this.props.address, {
                value: EthereumClient.web3.toWei(this.state.amountInEthers, "ether")
            }).then(
                result => {
                    this.setProjectBalance()
                    this.setProjectDetails()
                    this.checkAccountBalance()
                },
                error => {
                    console.log(error)
                }
            )
        })
    }

    checkAccountBalance = () => {
        EthereumClient.web3.eth.getAccounts((err, acc) => {
            EthereumClient.web3.eth.getBalance(acc[0], (err, result) => {
                Account.balance = EthereumClient.web3.fromWei(result.toNumber(),'ether');
            })
        })
    }

    setProjectDetails = () => {
        EthereumClient.project.at(this.props.address).then(instance => {
            instance.getDetails.call().then(
                result => {

                    this.setState({
                        fundingGoalReached: result[0],
                        deadline: result[1],
                        projectName: result[2],
                        amountRaised: this.setProjectBalance()
                    })
                },
                error => {
                    console.log(error)
                })
        })
    }

    setProjectBalance = () => {
        EthereumClient.web3.eth.getBalance(this.props.address, (err,result) => {
            this.setState({
                amountRaised: EthereumClient.web3.fromWei(result.toNumber(),'ether')
            })
        })
    }

    handlePayout = () => {
        EthereumClient.project.at(this.props.address).then(instance => {
            instance.payout().then(
                result => {
                this.setProjectBalance()
                this.checkAccountBalance()
            }, error => {
                console.log(error)
            })
        })
    }

    handleRefund = () => {
        EthereumClient.project.at(this.props.address).then(instance => {
            instance.refund().then(
                result => {
                this.setProjectBalance()
                this.checkAccountBalance()
            }, error => {
                console.log(error)
            })
        })
    }

    handleAmount = (event) => {
        this.setState({
            amountInEthers: event.target.value
        })
    }

    render() {
if(this.state.fundingGoalReached === false && this.state.elapsed <= 0)
        {
            return (<Card style={{backgroundColor: '#FBE9E7'}}>
                <CardHeader
                  title={<h3>Project: {this.state.projectName}</h3>}
                  subtitle={
                    <div>
                    <h4>Amount Raised: {this.state.amountRaised}</h4>
                    <h4 style={{color: 'red'}}>Project is closed</h4>
                    </div>
                  }
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardActions>
                  <RaisedButton label="Refund" primary={true} onTouchTap={this.handleRefund} />
                </CardActions>
                <CardText expandable={true}>
                   This project failed to meet its funding goal. Click or press 'Refund' to withdraw your contribution. 
                   Please note that if you did not contribute, a transaction is still send and gas will be used to check if you contributed.
                </CardText>
            </Card>)
        }
        else if(this.state.fundingGoalReached === true){
            return (<Card style={{backgroundColor: '#E8F5E9'}}>
                <CardHeader
                  title={<h3>Project: {this.state.projectName}</h3>}
                  subtitle={
                    <div>
                    <h4>Amount Raised: {this.state.amountRaised}</h4>
                    <h4 style={{color: 'red'}}>Project is closed</h4>
                    </div>
                  }
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardActions>
                  <RaisedButton label="Payout" primary={true} onTouchTap={this.handlePayout} />
                </CardActions>
                <CardText expandable={true}>
                   This project met its funding goal. If you are the beneficiary of this project click or press
                   the 'Payout' button to receive your funding.
                </CardText>
            </Card>)
        } else {
        return(
        <div>
            <Card style={{backgroundColor: '#F5F5F5'}}>
                <CardHeader
                  title={<h3>Project: {this.state.projectName}</h3>}
                  subtitle={
                    <div>
                    <h4>Amount Raised: {this.state.amountRaised}</h4>
                    <h4 style={{color: 'green'}}>Countdown to closure: {this.state.elapsed} seconds</h4>
                    </div>
                  }
                />
                <CardActions>
                  <TextField
                      floatingLabelText="Amount in Ethers"
                      type="text"
                      onChange={this.handleAmount}
                    />
                  <RaisedButton label="Contribute" primary={true} onTouchTap={this.handleContribute} />
                </CardActions>
            </Card>
        </div>)
        }
 }   
}
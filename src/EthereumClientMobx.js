// Ethereum
import Web3 from 'web3'
import FundingHubJSON from "../truffle/build/contracts/FundingHub.json"
import ProjectJSON from "../truffle/build/contracts/Project.json"
import contract from 'truffle-contract'
import {observable, action} from 'mobx'


const EthereumClient = new class {
  @observable web3 = new Web3()
  @observable fundinghub = new this.web3.eth.Contract(FundingHubJSON.abi,'0x09dee9124d562ab10796a5edf8291f11425359f8')
  @observable project = new this.web3.eth.Contract(ProjectJSON.abi)
  @observable projectList = []
  @observable fromAccount

  @action setProviders(url) {
    this.fundinghub.setProvider(new Web3.providers.WebsocketProvider(url))
    this.project.setProvider(new Web3.providers.WebsocketProvider(url))
    this.web3.setProvider(new Web3.providers.WebsocketProvider(url))
    this.web3.eth.getAccounts((e, accounts) => {
      this.fromAccount = accounts[0]
    })
  }

  @action setDefaults() {
    this.web3.eth.getAccounts((err, acc) => {
      this.fundinghub.options.from = acc[0];
      this.fundinghub.options.gasPrice = '1000000';
      this.project.options.from = acc[0];
    })
  }
}

export default EthereumClient

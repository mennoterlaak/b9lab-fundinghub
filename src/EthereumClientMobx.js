// Ethereum
import Web3 from 'web3'
import FundingHubJSON from "../truffle/build/contracts/FundingHub.json"
import ProjectJSON from "../truffle/build/contracts/Project.json"
import contract from 'truffle-contract'
import {observable, action} from 'mobx'

const EthereumClient = new class {
    @observable web3 = new Web3()
    @observable fundinghub = contract(FundingHubJSON)
    @observable project = contract(ProjectJSON)
    @observable projectList = []
    @observable fromAccount
    @observable fundingGoalInEthers
    @observable durationInMinutes
    @observable timeElapsed

    @action setProviders(url) {
        this.fundinghub.setProvider(new Web3.providers.HttpProvider(url))
        this.project.setProvider(new Web3.providers.HttpProvider(url))
        this.web3.setProvider(new Web3.providers.HttpProvider(url))
        this.web3.eth.getAccounts((e,accounts) => {
            this.fromAccount = accounts[0]
        })
    }

    @action setDefaults() {
        this.web3.eth.getAccounts((err, acc) => {
            this.fundinghub.defaults({
                from: acc[0],
                gas: 940000
            })
            this.project.defaults({
                from: acc[0],
                gas: 940000
            })
        })

    }

    @action getAccount() {
        return this.fromAccount
    }
}

export default EthereumClient
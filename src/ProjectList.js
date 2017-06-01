// React
import React, {Component} from 'react'

// Material UI
import Project from './Project'

// Ethereum
import EthereumClient from './EthereumClientMobx'

// MobX
import {observer} from 'mobx-react'

@observer
export default class ProjectList extends Component {

    componentDidMount() {
        EthereumClient.fundinghub.deployed().then(instance => {
             instance.getProjects.call().then(result => {
                EthereumClient.projectList = result
            })
        })
    }
    
    render() {
        return (
          <div >
            {EthereumClient.projectList.slice().map((project) => {return <Project key={project} address={project} />})}
          </div>
        )
    }
}
// React
import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom'

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

// FundingHub
import AppBarProject from './AppBarProject'
import AddProject from './AddProject'
import ProjectList from './ProjectList'
import ProjectToolbar from './ToolBar'

injectTapEventPlugin()

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBarProject/>
          <ProjectToolbar/>
          <Switch>
            <Route exact path='/' component={ProjectList}/>
            <Route path='/List' component={ProjectList}/>
            <Route path='/Add' component={AddProject}/>
          </Switch>
        </div>
      </MuiThemeProvider>
    )
  }
}

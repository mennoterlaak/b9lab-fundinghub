// React
import React from 'react'
import { Redirect } from 'react-router'

// Material UI
import {Step,Stepper,StepLabel} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import ExpandTransition from 'material-ui/internal/ExpandTransition'
import TextField from 'material-ui/TextField'

// Ethereum
import EthereumClient from './EthereumClientMobx'

class AddProject extends React.Component {

    state = {
        loading: false,
        finished: false,
        stepIndex: 0,
        projectName: '',
        fundingGoalInEthers: '',
        durationInMintues: ''
    }

    handleChangeEthers = (event) => {
        this.setState({
            fundingGoalInEthers: event.target.value,
        })
    }

    handleChangeMinutes = (event) => {
        this.setState({
            durationInMintues: event.target.value,
        })
    }

    handleChangeName = (event) => {
        this.setState({
            projectName: event.target.value,
        })
    }


    submitHandler = () => {
        EthereumClient.fundinghub.deployed().then((instance) => {
            instance.createProject(this.state.projectName, EthereumClient.fromAccount, this.state.fundingGoalInEthers, this.state.durationInMintues).then(result => {
                this.setState({
                  redirect: true
              })
            })
        })
    }

  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500)
    })
  }

  handleNext = () => {
    const {stepIndex} = this.state
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      }))
    }
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }))
    }
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <TextField style={{marginTop: 0}} floatingLabelText="Name" onChange={this.handleChangeName}/>
            <h4 style={{fontFamily: 'Helvetica'}}>Give your project a title</h4>
          </div>
        )
      case 1:
        return (
          <div>
            <TextField style={{marginTop: 0}} floatingLabelText="Funding Goal" onChange={this.handleChangeEthers}/>
            <h4 style={{fontFamily: 'Helvetica'}}>
              Specify the funding goal for the project in ethers.
            </h4>
          </div>
        )
      case 2:
        return (
          <div>
            <TextField style={{marginTop: 0}} floatingLabelText="Duration" onChange={this.handleChangeMinutes} />
            <h4 style={{fontFamily: 'Helvetica'}}>
              Specify the duration of the project in minutes.
            </h4>
          </div>
        )
      default:
        return <h4 style={{fontFamily: 'Helvetica'}}>'Please wait while your project is being created / mined'</h4>
    }
  }

  renderContent() {
    const {finished, stepIndex} = this.state
    const contentStyle = {margin: '0 16px', overflow: 'hidden'}

    if (finished) {
      this.submitHandler()
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            primary={true}
            onTouchTap={this.handleNext}
          />
        </div>
      </div>
    )
  }

  render() {
    const {loading, stepIndex} = this.state
    if (this.state.redirect) {
      return <Redirect push to="/" />
    }
    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Project Name</StepLabel>
          </Step>
          <Step>
            <StepLabel>Funding Goal</StepLabel>
          </Step>
          <Step>
            <StepLabel>Duration</StepLabel>
          </Step>
        </Stepper>
        <ExpandTransition loading={loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
      </div>
    )
  }
}

export default AddProject
// React
import React from 'react'
import {Redirect} from 'react-router'

// Material UI
import {Step, Stepper, StepButton, StepContent} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

// Ethereum
import EthereumClient from './EthereumClientMobx'

class AddProject extends React.Component {

  state = {
    loading: false,
    finished: false,
    stepIndex: 0,
    projectName: '',
    fundingGoalInEthers: 0,
    durationInSeconds: ''
  }

  handleChangeEthers = (event) => {
    this.setState({fundingGoalInEthers: Number(event.target.value)})
  }

  handleChangeSeconds = (event) => {
    this.setState({durationInSeconds: event.target.value})
  }

  handleChangeName = (event) => {
    this.setState({projectName: event.target.value})
  }

  submitHandler = () => {
    EthereumClient.fundinghub.deployed().then((instance) => {
      instance.createProject(this.state.projectName, EthereumClient.fromAccount, EthereumClient.web3.toWei(this.state.fundingGoalInEthers, 'ether'), this.state.durationInSeconds).then(result => {
        console.log(result)
        this.setState({redirect: true})
      })
    })
  }

  dummyAsync = (cb) => {
    this.setState({
      loading: true
    }, () => {
      this.asyncTimer = setTimeout(cb, 500)
    })
  }

  handleNext = () => {
      const {stepIndex} = this.state;
      if (stepIndex < 2) {
        this.setState({stepIndex: stepIndex + 1});
      }
    };

    handlePrev = () => {
      const {stepIndex} = this.state;
      if (stepIndex > 0) {
        this.setState({stepIndex: stepIndex - 1});
      }
    };

    renderStepActions(step) {
      return (
        <div style={{margin: '12px 0'}}>
          <RaisedButton
            label="Next"
            disableTouchRipple={true}
            disableFocusRipple={true}
            primary={true}
            onTouchTap={this.handleNext}
            style={{marginRight: 12}}
          />
          {step > 0 && (
            <FlatButton
              label="Back"
              disableTouchRipple={true}
              disableFocusRipple={true}
              onTouchTap={this.handlePrev}
            />
          )}
        </div>
      );
    }

    renderLastStepAction() {
      return (
        <div style={{margin: '12px 0'}}>
          <RaisedButton
            label="Next"
            disableTouchRipple={true}
            disableFocusRipple={true}
            primary={true}
            onTouchTap={this.submitHandler}
            style={{marginRight: 12}}
          />
        </div>
      );
    }

  render() {
    const {stepIndex} = this.state
    if (this.state.redirect) {
      return <Redirect push to="/"/>
    }
    return (
      <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
        <Stepper activeStep={stepIndex} linear={false} orientation="vertical">
          <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: 0})}>
              Give your project a name.
            </StepButton>
            <StepContent>
              <p style={{fontFamily: 'Verdana'}}>
                It surely needs a name.
              </p>
              <TextField floatingLabelText="Name" onChange={this.handleChangeName}/>
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: 1})}>
              How much would you like to raise for this project?
            </StepButton>
            <StepContent>
              <p style={{fontFamily: 'Verdana'}}>
                Amount is in ethers, decimals can be used.
              </p>
              <TextField floatingLabelText="Funding Goal" onChange={this.handleChangeEthers}/>
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: 2})}>
              How long should the project be open?
            </StepButton>
            <StepContent>
              <p style={{fontFamily: 'Verdana'}}>
                This is in seconds for testing.
              </p>
              <TextField floatingLabelText="Duration" onChange={this.handleChangeSeconds}/>
              {this.renderLastStepAction(2)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    )
  }
}

export default AddProject

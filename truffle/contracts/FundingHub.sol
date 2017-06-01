pragma solidity ^0.4.11;

import "./Project.sol";

contract FundingHub {

  address[] projects;

  event ProjectCreated(address projectAtAddress);
  event ProjectClosed(bool projectIsClosed);

  function createProject(string projectName, address ifSuccessfulSendTo, uint fundingGoalInEthers, uint durationInMinutes) returns (address) {
    address newProject = new Project(projectName, ifSuccessfulSendTo, fundingGoalInEthers, durationInMinutes);
    projects.push(newProject);
    ProjectCreated(newProject);
    return newProject;
  }

  function getProjects() constant returns (address[]) {
    return projects;
  }

  function contribute(address projectAddress) payable {
    Project project = Project(projectAddress);
    if(project.fund.value(msg.value)(msg.sender) == false){
      ProjectClosed(true);
    }
  }
}
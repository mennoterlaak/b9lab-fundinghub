pragma solidity ^0.4.11;

import "./Project.sol";

contract FundingHub {

  address[] projects;

  event ProjectCreated(address projectAtAddress);

  function createProject(string projectName, address ifSuccessfulSendTo, uint fundingGoalInWei, uint durationInSeconds) returns (address) {
    address newProject = new Project(projectName, ifSuccessfulSendTo, fundingGoalInWei, durationInSeconds);
    projects.push(newProject);
    ProjectCreated(newProject);
    return newProject;
  }

  function getProjects() constant returns (address[]) {
    return projects;
  }

  function contribute(address projectAddress) payable {
    require(msg.value > 0);
    Project project = Project(projectAddress);
    project.fund.value(msg.value)(msg.sender);
  }
}
var Project = artifacts.require("./Project.sol");
var FundingHub = artifacts.require("./FundingHub.sol");

module.exports = function(deployer) {
  //deployer.deploy(Project);
  deployer.deploy(FundingHub);
};

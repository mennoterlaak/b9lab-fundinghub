var Project = artifacts.require("./Project.sol");
var FundingHub = artifacts.require("./FundingHub.sol");

module.exports = function(deployer) {
  deployer.deploy(FundingHub).then(function() {
    return FundingHub.deployed().then(function(instance) {
      return instance.createProject('Created by Truffle', web3.eth.accounts[0], web3.toWei(10, 'ether'), 300);
    });
  });
};

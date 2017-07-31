var Project = artifacts.require("./Project.sol");
var FundingHub = artifacts.require("./FundingHub.sol");

web3.eth.getAccountsPromise = function () {
    return new Promise(function (resolve, reject) {
        web3.eth.getAccounts(function (e, accounts) {
            if (e != null) {
                reject(e);
            } else {
                resolve(accounts);
            }
        });
    });
};

module.exports = function(deployer) {
  deployer.deploy(FundingHub).then(function() {
    web3.eth.getAccountsPromise().then(function(accounts){
      return accounts[0];
    }).then(function(account){
      return FundingHub.deployed().then(function(instance) {
        return instance.createProject('Created by Truffle', account, web3.toWei(10, 'ether'), 300);
      });
    });
  });
};

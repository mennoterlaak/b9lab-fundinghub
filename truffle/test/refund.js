var FundingHub = artifacts.require("FundingHub");
var Project = artifacts.require("Project");
contract('FundingHub and Project', function(accounts) {
  it("Should create new project and send 1 ether with the contribute function, wait 2 seconds for the project to expire and refund the ether", function() {
    return FundingHub.deployed().then(function(instance) {
      return instance.createProject('Test Project', accounts[0], 10, 2);
    }).then(function(hub) {
      var projectAddress = hub.logs[0].args.projectAtAddress;
      Project.address = projectAddress;
      initialAccountBalance = web3.eth.getBalance(accounts[0]);
      FundingHub.deployed().then(function(instance) {
        instance.contribute(projectAddress, {
          from: accounts[0],
          value: web3.toWei(1, 'ether')
        }).then(function() {
          Project.deployed().then(function(instance) {
            setTimeout(function(){
              instance.refund({from: accounts[0]})
            },2000);
          })
        })
      })
      afterAccountBalance = web3.eth.getBalance(accounts[0]);
      assert.equal(web3.eth.getBalance(projectAddress), 0, "Project balance should be 0");
      assert.isBelow((initialAccountBalance - afterAccountBalance), 1, "Account should only have used gas and the project contract should have refunded 1 ether");
    });
  });
});
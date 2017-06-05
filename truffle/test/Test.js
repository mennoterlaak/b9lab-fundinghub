var FundingHub = artifacts.require("FundingHub");
var Project = artifacts.require("Project");

contract('FundingHub', function(accounts) {
  it("Should create a new project", function() {
    return FundingHub.deployed().then(function(instance) {
      return instance.createProject('Test Project', accounts[0], web3.toWei(10, 'ether'), 10);
    });
  });

  it("Should contribute to a newly created project", function() {
    return FundingHub.deployed().then(function(instance) {
      return instance.createProject('Test Project for contribute', accounts[0], web3.toWei(10, 'ether'), 10);
    }).then(function(result) {
      return FundingHub.deployed().then(function(instance) {
        return instance.contribute(result.logs[0].args.projectAtAddress, {
          from: accounts[0],
          value: web3.toWei(1, 'ether')
        });
      });
    });
  });
});

contract('Project', function(accounts) {
  function delay(t) {
    return new Promise(function(resolve) {
      setTimeout(resolve, t)
    });
  }

  it("Should deploy a new project contract", function() {
    return Project.new('Test Project', accounts[0], web3.toWei(10, 'ether'), 10).then(function(instance) {
      projectAtAddress = instance.address;
    });
  });

  it("Should fund a new deployed project contract", function() {
    return Project.new('Test Project', accounts[0], web3.toWei(10, 'ether'), 10).then(function(instance) {
      return instance.fund(accounts[0], {
        from: accounts[0],
        value: web3.toWei(1, 'ether')
      });
    });
  });

  it("Should refund a new deployed project contract", function() {
    return Project.new('Test Project', accounts[0], web3.toWei(10, 'ether'), 2).then(function(instance) {
      projectAddress = instance.address;
      initialAccountBalance = web3.fromWei(web3.eth.getBalance(accounts[0]));

      return instance.fund(accounts[0], {
        from: accounts[0],
        value: web3.toWei(1, 'ether')
      }).then(function() {
        return delay(3000).then(function() {
          return instance.refund(accounts[0]).then(function() {
            afterAccountBalance = web3.fromWei(web3.eth.getBalance(accounts[0]), 'ether');
            assert.equal(web3.eth.getBalance(projectAddress).toNumber(), 0, "Project balance should be 0");
            assert.isBelow((initialAccountBalance - afterAccountBalance), 1, "Account should only have used gas and the project contract should have refunded 1 ether");
          });
        });
      });
    });
  });

  it("Should payout a new deployed project contract", function() {
    return Project.new('Test Project', accounts[0], web3.toWei(10, 'ether'), 60).then(function(instance) {
      projectAddress = instance.address;
      initialAccountBalance = web3.fromWei(web3.eth.getBalance(accounts[0]));

      return instance.fund(accounts[0], {
        from: accounts[0],
        value: web3.toWei(10, 'ether')
      }).then(function() {
        return instance.payout(accounts[0]).then(function() {
          afterAccountBalance = web3.fromWei(web3.eth.getBalance(accounts[0]), 'ether');
          assert.equal(web3.eth.getBalance(projectAddress).toNumber(), 0, "Project balance should be 0");
          assert.isBelow((initialAccountBalance - afterAccountBalance), 1, "Account should only have used gas and the project contract should have refunded 1 ether");
        });
      });
    });
  });
})

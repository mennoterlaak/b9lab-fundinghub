pragma solidity ^0.4.11;

contract Project {
    
    struct projectInfo {
        address beneficiary;
        string projectName;
        uint fundingGoal; 
        uint deadline;
        uint amountRaised;
        bool fundingGoalReached;
        mapping (address => uint256) balanceOf;
    }

    projectInfo projectState;

    modifier deadlineReached(){
        if(now >= projectState.deadline)
        _;
    }

    modifier fundingFailed(){
        if (projectState.amountRaised < projectState.fundingGoal)
        _;
    }

    modifier fundingReached(){
        if (projectState.fundingGoalReached == true)
        _;
    }

    function Project(string projectName, address ifGoalReachedSentTo, uint fundingGoalInEthers, uint durationInMinutes) {
        projectState.beneficiary = ifGoalReachedSentTo;
        projectState.projectName = projectName;
        projectState.fundingGoal =  fundingGoalInEthers * 1 ether;
        projectState.deadline = now + durationInMinutes;
        projectState.amountRaised = 0;
        projectState.fundingGoalReached = false;
    }

    function getDetails() returns (bool, uint, string){
        bool _fundingGoalReached = projectState.fundingGoalReached;
        uint _deadline = projectState.deadline;
        string _projectName = projectState.projectName;

        return (_fundingGoalReached, _deadline, _projectName);
    }

    function fund(address _contributor) payable returns (bool){
        uint amount = msg.value;
        address contributor = _contributor;
        uint toBeAmount = projectState.amountRaised + amount;

        if(now > projectState.deadline){
            contributor.transfer(msg.value);
            return false;
        }

        if(projectState.fundingGoalReached == true){
            contributor.transfer(msg.value);
            return false;
        }

        if(toBeAmount >= projectState.fundingGoal) {
            projectState.balanceOf[contributor] += amount;
            projectState.fundingGoalReached = true;
            return true;
        }
    
        if(toBeAmount < projectState.fundingGoal) {
            projectState.balanceOf[contributor] += amount;
            projectState.amountRaised += amount;
            return true;
        }

    }

    function refund() deadlineReached fundingFailed {
        uint amount = projectState.balanceOf[msg.sender];
        projectState.balanceOf[msg.sender] = 0;
        projectState.amountRaised -= amount;
        if(amount > 0){
            msg.sender.transfer(amount);
        }
    }

    function payout() fundingReached {
        if (projectState.beneficiary == msg.sender) {
            uint balance = this.balance;
            projectState.beneficiary.transfer(balance);
        }
    }
}
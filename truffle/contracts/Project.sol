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

    function Project(string projectName, address ifGoalReachedSentTo, uint fundingGoalInWei, uint durationInSeconds) {
        projectState.beneficiary = ifGoalReachedSentTo;
        projectState.projectName = projectName;
        projectState.fundingGoal =  fundingGoalInWei;
        projectState.deadline = now + durationInSeconds;
    }

    function getDetails() constant returns (bool, uint, string, uint){
        bool _fundingGoalReached = projectState.fundingGoalReached;
        uint _deadline = projectState.deadline;
        string _projectName = projectState.projectName;
        uint _fundingGoal = projectState.fundingGoal;
        return (_fundingGoalReached, _deadline, _projectName, _fundingGoal);
    }

    function fund(address _contributor) payable returns (bool success){
        require(now < projectState.deadline);
        require(!projectState.fundingGoalReached);
        require(msg.value > 0);

        uint amount = msg.value;
        address contributor = _contributor;
        uint toBeAmount = projectState.amountRaised + amount;

        if(toBeAmount >= projectState.fundingGoal) {
            projectState.balanceOf[contributor] += amount;
            projectState.fundingGoalReached = true;
            projectState.amountRaised += amount;
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

# Fundinghub
`https://git.academy.b9lab.com/ETH-8-exam-projects/menno`

## Installation instructions:
1. `$ truffle compile`
2. `$ testrpc / geth / parity`
3. `$ truffle migrate (--reset)`
4. `$ npm start`

## Notes:

> Because this app is bootstrapped with create-react-app, I included the node_modules directory. This project is ready to run as is.
> No need to run `npm install`.

> Sadly the web application currently crashes when using safari `10.1.1 (12603.2.4)`.

> The web application is tested and found to be working in the following browsers:
> - `Safari Technology Preview`
> - `Chrome`
> - `Firefox`

> Because of contract safety:
> If the funding succeeded, the beneficiary has to manually click the payout button or call the payout function in the contract.
> If the funding failed, every contributor has to manually click the refund button or call the refund function in the contract.

### Input fields:

- Project name
- Project deadline is in seconds
- Funding goal is in ethers
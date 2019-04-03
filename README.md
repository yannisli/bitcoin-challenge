This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

Clone the project and then run in the root as well as the /reactapp folder:

`npm install`

## Running the project (Production Build)

First navigate to /reactapp and run 
`npm run build` to create an optimized production build of the react app

Second, navigate to / and run
`npm run start` to run the Express.js server that will serve the built React App and connect to MySQL

This will start your application and it will be accessible at http://localhost:80, or whichever port you have specified in the /.env file

## Running the project (Development Mode)

First navigate to / and run
`npm run start` to run the Express.js server. It will connect to MySQL and listen for API requests at http://localhost:80 or whichever port you have specified in the /.env file

Second, navigate to /reactapp and run
`npm run start` to run the development mode of the React App which will proxy requests to http://localhost:80, and serve the react app at http://localhost:3000 which has the added ability to display code changes during runtime

## Dependencies (React App)

`node-fetch bitcoinjs-lib tiny-secp256k1 react react-redux react-router-dom moment eccrypto`

## Dependencies (Backend)

`body-parser cookie dotenv express morgan mysql`

## Notes
To install bitcoinjs-lib, eccrypto, and by extension tiny-secp256k1, the prerequisites of Python2.7 and Microsoft Build Tools for C++ are needed.

You can install them via npm in elevated PowerShell by running 

`npm install -g windows-build-tools`

Or you can manually install Python 2.7 and Microsoft Build Tools for C++ and run the following:

* `npm config set python python2.7`

* `npm config set msvs_version 2017`


## Further notes

The .env is present in the root folder. By default it is connecting to the database I have used to test this during development which is a MySQL server running on Google Cloud Platform.
It has (0.0.0.0/0) whitelist enabled, so everyone should be able to connect to it given the proper credentials.

To send a payment via this application, you will need to register a new account to get to the dashboard, and then subsequently register a new address in Wallet Import Format with that account.
After you have registered the account and address, you can navigate to that addresses' page by selecting it from the list in /dashboard and there should be the ability to send the payment.

WIFs are not exclusive to accounts, multiple accounts can have the same WIF registered to them.
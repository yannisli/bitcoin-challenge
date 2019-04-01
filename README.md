This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

Clone the project and then run in the root as well as the reactapp folder:

`npm install`

## Running the project

First navigate to /reactapp and run 
`npm run build` to build the production build of the React App.

Second, navigate to / and run
`npm run start` to run the Express.js server that will serve the built React App and connect to MySQL

This will start your application and it will be accessible at http://localhost:80, or whichever port you have specified in the /.env file

## Additional Dependencies (React App)

`node-fetch bitcoinjs-lib tiny-secp256k1 react react-redux moment eccrypto`

## Dependencies (Backend)

`body-parser cookie dotenv express morgan mysql`

## Notes
To install bitcoinjs-lib and by extension tiny-secp256k1, the prerequisites of Python2.7 and Microsoft Build Tools for C++ are needed.

You can install them via npm in elevated PowerShell by running 

`npm install -g windows-build-tools`

Or you can manually install Python 2.7 and Microsoft Build Tools for C++ and run the following:

* `npm config set python python2.7`

* `npm config set msvs_version 2017`
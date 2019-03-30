This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

Clone the project and then run in the root folder:

`npm install`

## Running the project

`npm run start` to run the development version where changes are hot-loaded.

This will start your application and it will be accessible at http://localhost:3000

## Additional Dependencies

`node-fetch bitcoinjs-lib tiny-secp256k1 react react-redux moment`

## Notes
To install bitcoinjs-lib and by extension tiny-secp256k1, the prerequisites of Python2.7 and Microsoft Build Tools for C++ are needed.

You can install them via npm in elevated PowerShell by running 

`npm install -g windows-build-tools`

Or you can manually install Python 2.7 and Microsoft Build Tools for C++ and run the following:

* `npm config set python python2.7`

* `npm config set msvs_version 2017`
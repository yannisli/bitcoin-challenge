const bitcoin = require("bitcoinjs-lib");

const TESTNET = bitcoin.networks.testnet;

const kp = bitcoin.ECPair.makeRandom({ network: TESTNET });

console.log("Key Pair:", kp);

const  addr  = bitcoin.payments.p2pkh({ pubkey: kp.publicKey, network: TESTNET });

console.log("Addr:", addr);

console.log("Address: ", addr.address);

console.log("Private Key:",  kp.privateKey.toString('hex'));

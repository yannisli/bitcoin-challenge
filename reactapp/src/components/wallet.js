import React, {Component} from 'react';

import {connect} from 'react-redux';

import {Link, Redirect, withRouter} from 'react-router-dom';

import bitcoin from 'bitcoinjs-lib';

import NavBar from './navbar';

import './styles/wallet.css';

import loading from '../loading.svg';

import Transactions from './transactions';

import crypto from 'crypto';
import eccrypto from 'eccrypto';

class Wallet extends Component
{
    constructor(props)
    {
        super(props);
        this.showSendingModal = this.showSendingModal.bind(this);
        this.hideSendingModal = this.hideSendingModal.bind(this);
        this.trySendPayment = this.trySendPayment.bind(this);
    }
    /**
     * Try to send payment. Parameters optional and intended for calls that do not have the send dialog shown to pull values from.
     * @param {number} amt Optional parameter. Will prevent reading the textarea for value. For calls that might not have the textarea shown
     * @param {string} toWho Optioanl parameter. Will prevent reading the textarea for value.
     */
    trySendPayment(amt, toWho)
    {
        // TODO: Implement loading screen/awaiting
        // Validate
        let amount = typeof(amt) === "number" ? amt : document.getElementById("walletamount").value;
        if(typeof(amount) === "string")
            amount = parseInt(amount, 10);
        if(amount <= 0)
        {
            this.props.dispatch({type: "WALLET_ERROR", data: "Must provide valid amount"});
            return;
        }
        let to = toWho ? toWho : document.getElementById("walletto").value;
        if(to.length === 0)
        {
            this.props.dispatch({type: "WALLET_ERROR", data: "Must provide valid address"});
            return;
        }

        if(amount > this.props.Data.balance)
        {
            this.props.dispatch({type: "WALLET_ERROR", data: "Insufficient Funds"});
            return;
        }
        // Send this to Blockcypher...
        let newtx = {
            inputs: [{addresses: [this.props.ECPair.Address]}],
            outputs: [{addresses: [to], value: amount}]
        };
        this.props.dispatch({type: "AWAITING_SERVER_RESPONSE"});
        // POST now
        fetch('https://api.blockcypher.com/v1/btc/test3/txs/new', {
            method: 'POST',
            body: JSON.stringify(newtx)
        }).then(res => {

            if(!res.ok)
            {
                console.log("Response was not okay");
                console.log(res);
                res.json().then(body => {this.props.dispatch({type: "ERROR_RESPONSE", data: `Received server response code ${res.status}\n${body.errors[0].error}`})}).catch(err => console.log(err));
                
            }
            else
            {
                res.json().then(json => {
                    console.log("JSON done", json);
                    // From Blockcypher API reference
                    let tmptx = Object.assign({}, json);
                    // Pubkeys and Signatures must be the same index.
                    tmptx.pubkeys = [];
                    tmptx.signatures = [];
                    // Keep count of how much we have iterated through, as eccrypto.sign is an asynchronous function
                    let counter = 0;
                    // Loop through what we have to sign
                    let handler = sig => {
                        console.log("Signature:", sig.toString('hex'));
                        // Push the signature as well
                        tmptx.signatures.push(sig.toString('hex'));
                        
                        // Increment our counter
                        counter++;
                        // When counter reaches the length of what we had to sign, then we've finished and we should POST to the API to send
                        if(counter === tmptx.tosign.length)
                        {
                            // POST request to send
                            fetch('https://api.blockcypher.com/v1/btc/test3/txs/send', {
                                method: 'POST',
                                body: JSON.stringify(tmptx)
                            }).then(res2 => {
                                if(res2.ok)
                                {
                                    // Done. It should come back with a finished TX for us to push into our Store instead of fetching again

                                    // JSON result is a {tosign: [empty array], tx: {...}}
                                    // We just want to push the tx since tosign is useless to us
                                    res2.json().then(json2 => {

                                        this.props.dispatch({type: "SERVER_RESPONSE_RECEIVED"});
                                        // Push the new TX to the store for data
                                        this.props.dispatch({type: "WALLET_NEW_TX", data: json2.tx});


                                    }).catch(err => console.log(err));
                                    
                                    // Set a timeout because there's rate limit..
                                    //setTimeout(() => 
                                    //this.fetchAddressData(), 5000);
                                }
                                else
                                {
                                    console.log("Not ok...");
                                    console.log(res2);
                                    // Errors come back as JSON as {"Errors": [{Error:}]}
                                    res2.json().then(body => this.props.dispatch({type: "ERROR_RESPONSE", data: `Received server response code ${res2.status}\n${body.errors[0].error}`})).catch(err => console.log(err));
                                }
                            }).catch(err => {
                                console.log("Reached error", err);
                                console.log(err);
                                this.props.dispatch({type: "ERROR_RESPONSE", data: `Failed to send POST request to Blockcypher`});
                            })
                        }
                    }
                    for(let n in tmptx.tosign) 
                    {
                        let tosign = tmptx.tosign[n];
                        // Push public key
                        tmptx.pubkeys.push(this.props.ECPair.KP.publicKey.toString("hex"));
                        let buf = Buffer.from(tosign, "hex");

                        crypto.createHash("sha256").update(buf).digest();
                        // Sign using our private key
                        eccrypto.sign(this.props.ECPair.KP.privateKey, buf).then(handler).catch(err => console.log(err));
                    }
                    

                    


                }).catch(err => console.log(err));
            }

        }).catch(err => {
            console.log(err);
            this.props.dispatch({type: "ERROR_RESPONSE", data: `POST request to Blockcypher has failed`});
        })
    }
    showSendingModal()
    {
        this.props.dispatch({type: "WALLET_SHOW_SENDING"});
    }
    hideSendingModal()
    {
        this.props.dispatch({type: "WALLET_HIDE_SENDING"});
    }
    fetchAddressData(ecpair)
    {
        if((!this.props.ECPair || !this.props.ECPair.KP) && !ecpair)
            return;
        let ec = ecpair ? ecpair : this.props.ECPair.KP;
        const addr = bitcoin.payments.p2pkh({ pubkey: ec.publicKey, network: bitcoin.networks.testnet});
        this.props.dispatch({type: "WALLET_FETCHING_DATA"});
        // Fetch from Blockcypher now
        console.log(addr.address);

        fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${addr.address}/full`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(res => {
            if(!res.ok)
            {
                console.log("Not good response");
                this.props.dispatch({type: "ERROR_RESPONSE", data: `Received response code ${res.status} from server`});
                this.props.dispatch({type: "WALLET_FETCHED_DATA"});
            }
            else
            {
                res.json().then(json => {
                    console.log(json);
                    this.props.dispatch({type: "WALLET_FETCHED_DATA", data: json});
                }).catch(err => console.log(err));
            }
        }).catch(err => {
            console.log(err);
            this.props.dispatch({type: "ERROR_RESPONSE", data: `GET request to Blockcypher for Address data failed`});
            this.props.dispatch({type: "WALLET_FETCHED_DATA"});
        })
    }
    render()
    {
        let exists = false;
        for(let i = 0 ; i < this.props.Addrs.length; i++)
        {
            if(this.props.Addrs[i].wif === this.props.match.params.walletId)
            {
                exists = i;
                break;
            }
        }
        if(exists === false)
        {
            return <Redirect to="/"/>
        }
        let walletRoot = document.getElementById("walletroot");
        if(walletRoot !== null)
            if(this.props.Display)
                walletRoot.style.filter = 'blur(5px)';
            else
                walletRoot.style.filter = 'none';

        let toRender = [];
        toRender.push(<div key="walletroot" id="walletroot" className="wallet-root">
            <NavBar/>
            <div className="wallet-container">
                <div className="wallet-row" style={{flexDirection: 'row'}}>
                    <Link to="/dashboard" style={{width: '45%', alignSelf: 'flex-start', textDecoration: 'none'}}>
                        <div className="error-button" style={{'padding': '5px'}}>
                            Back to Dashboard
                        </div>
                    </Link>
                    <div className="wallet-button" onClick={this.showSendingModal}>
                        Send Payment
                    </div>
                </div>
                {this.props.ECPair && this.props.ECPair.Nick !== "" && 
                    <div className="wallet-header">
                        "{this.props.ECPair.Nick}"
                    </div>
                }
                {this.props.ECPair &&
                    <div>
                        Public Key
                        <div className="wallet-subheader">
                            "{this.props.ECPair.Address}"
                        </div>
                    </div>
                }
                <div>
                    WIF
                    <div className="wallet-subheader">
                        "{this.props.Addrs[exists].wif}"
                    </div>
                </div>
                {this.props.Loading &&
                    <img src={loading} alt="Loading..." className="login-loading" />
                }
                
                {!this.props.Loading && this.props.Loaded && this.props.Data &&
                    <div className="wallet-row">
                        <div className="wallet-row-body">
                            <div className="wallet-row-header">
                                Balance (sat)
                            </div>
                            <div className="wallet-row-content">
                                Current: {this.props.Data.balance}
                            </div>
                            <div className="wallet-row-content">
                                Unconfirmed: {this.props.Data.unconfirmed_balance}
                            </div>
                            <div className="wallet-row-content">
                                Total: {this.props.Data.final_balance}
                            </div>
                        </div>
                        <div className="wallet-row-body">
                            <div className="wallet-row-header">
                                Transactions
                            </div>
                            <div className="wallet-row-content">
                                Confirmed: {this.props.Data.n_tx}
                            </div>
                            <div className="wallet-row-content">
                                Pending: {this.props.Data.unconfirmed_n_tx}
                            </div>
                            <div className="wallet-row-content">
                                Total: {this.props.Data.final_n_tx}
                            </div>
                        </div>
                        {/*<div className="wallet-row-body">
                            <div className="wallet-row-header">
                                In/Out
                            </div>
                            <div className="wallet-row-content">
                                Received: {this.props.Data.total_received}
                            </div>
                            <div className="wallet-row-content">
                                Sent: {this.props.Data.total_sent}
                            </div>
                </div>*/}
                    </div>
                }
                {!this.props.Loading && this.props.Loaded && <Transactions TSP={this.trySendPayment} Address={this.props.ECPair.Address} AddressData={this.props.Data}/>}
            </div>
           
        </div>);
        
        if(this.props.Display) 
            toRender.push(<div key="walletmodal" className="wallet-modal">
                <div className="wallet-modal-container">
                    <div className="wallet-modal-header" style={this.props.Error ? {color: "#F04747"} : {}}>
                        {this.props.Error ? this.props.Error : "Sending payment..."}
                    </div>
                    <div className="wallet-modal-field">
                        AMOUNT
                    </div>
                    <textarea id="walletamount" className="wallet-modal-textarea"/>
                    <div className="wallet-modal-field">
                        TO
                    </div>
                    <textarea id="walletto" className="wallet-modal-textarea"/>
                    <div className="wallet-modal-button" onClick={this.trySendPayment}>
                        Confirm
                    </div>
                    <div className="wallet-modal-cancel" onClick={this.hideSendingModal}>
                        Cancel
                    </div>
                </div>
            </div>);
            
        return toRender;
    }
    componentDidMount()
    {
        if(this.props.ECPair && this.props.ECPair.Address === this.props.match.params.walletId)
            return;
        let exists = false;
        for(let i in this.props.Addrs)
        {
            if(this.props.Addrs[i].wif === this.props.match.params.walletId)
            {
                exists = i;
                break;
            }
        }
        // Fetch data from Blockcypher if we don't have data!
        if(exists)
        {
            // From WIF
            let ecpair = new bitcoin.ECPair.fromWIF(this.props.Addrs[exists].wif, bitcoin.networks.testnet);
            console.log(ecpair);
            const addr = bitcoin.payments.p2pkh({ pubkey: ecpair.publicKey, network: bitcoin.networks.testnet});
            this.props.dispatch({type: "WALLET_SET_ECPAIR", data: {KP: ecpair, Address: addr.address, Nick: this.props.Addrs[exists].nick}});

            this.fetchAddressData(ecpair);
        }
    }
}

export default withRouter(connect(state => {
    return {
        Addrs: state.dashboard.addresses,
        Loading: state.wallet.loading,
        Loaded: state.wallet.loaded,
        Data: state.wallet.data,
        ECPair: state.wallet.ecpair,
        Display: state.wallet.display,
        Error: state.wallet.error
    }
})(Wallet));